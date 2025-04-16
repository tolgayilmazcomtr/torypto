from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Dict, Any, Optional
import asyncio

from ...services.binance_service import BinanceService
from ...utils.technical_indicators import TechnicalIndicators

router = APIRouter(
    prefix="/technical",
    tags=["technical-analysis"],
    responses={404: {"description": "Bulunamadı"}},
)

@router.get("/indicators/{symbol}")
async def get_technical_indicators(
    symbol: str, 
    interval: str = Query("1d", description="Mum aralığı: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M"),
    limit: int = Query(100, ge=10, le=1000, description="Kaç kayıt getirileceği"),
):
    """
    Belirli bir sembol için teknik göstergeleri hesaplar ve döndürür
    """
    try:
        # Binance servisinden veri al
        binance_service = BinanceService()
        klines = await binance_service.get_klines(symbol, interval, limit)
        
        # Teknik göstergeleri hesapla
        indicators_df = TechnicalIndicators.calculate_indicators(klines)
        
        # JSON'a dönüştür (son 30 kayıt)
        result = indicators_df.tail(30).to_dict(orient="records")
        
        return {
            "symbol": symbol,
            "interval": interval,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Teknik göstergeler hesaplanırken hata oluştu: {str(e)}")

@router.get("/trend/{symbol}")
async def get_trend_analysis(
    symbol: str, 
    interval: str = Query("1d", description="Mum aralığı: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M"),
    limit: int = Query(100, ge=10, le=1000, description="Kaç kayıt getirileceği"),
):
    """
    Belirli bir sembol için teknik analiz trend sonuçlarını döndürür
    """
    try:
        # Binance servisinden veri al
        binance_service = BinanceService()
        klines = await binance_service.get_klines(symbol, interval, limit)
        
        # Teknik göstergeleri hesapla
        indicators_df = TechnicalIndicators.calculate_indicators(klines)
        
        # Trend analizi yap
        trend = TechnicalIndicators.analyze_trend(indicators_df)
        
        return {
            "symbol": symbol,
            "interval": interval,
            "trend": trend
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analizi yapılırken hata oluştu: {str(e)}")

@router.get("/multi-trends")
async def get_multiple_trends(
    symbols: List[str] = Query(..., description="Analiz edilecek semboller"),
    interval: str = Query("1d", description="Mum aralığı: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M"),
):
    """
    Birden çok sembol için trend analizlerini paralel olarak yapar ve döndürür
    """
    try:
        binance_service = BinanceService()
        
        async def analyze_symbol(symbol):
            try:
                klines = await binance_service.get_klines(symbol, interval, 100)
                indicators_df = TechnicalIndicators.calculate_indicators(klines)
                trend = TechnicalIndicators.analyze_trend(indicators_df)
                return {
                    "symbol": symbol,
                    "trend": trend
                }
            except Exception as e:
                return {
                    "symbol": symbol,
                    "error": str(e)
                }
        
        # Tüm sembolleri paralel olarak analiz et
        tasks = [analyze_symbol(symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks)
        
        return {
            "interval": interval,
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Çoklu trend analizi yapılırken hata oluştu: {str(e)}")

@router.get("/top-symbols")
async def get_top_symbols(
    filter_type: str = Query("gainers", description="gainers, losers, or volume"),
    limit: int = Query(10, ge=5, le=50, description="Kaç sembol getirileceği"),
    interval: str = Query("1d", description="Mum aralığı: 1d, 1w"),
):
    """
    En çok kazanan, kaybeden veya hacmi yüksek sembolleri döndürür
    """
    try:
        binance_service = BinanceService()
        
        # Tüm fiyatları ve 24 saatlik ticker bilgilerini al
        prices = await binance_service.get_all_prices()
        tickers = await binance_service.get_24h_ticker()
        
        # Filtrele
        if filter_type == "gainers":
            # En çok kazananlar
            sorted_symbols = sorted(tickers, key=lambda x: float(x.get('priceChangePercent', 0)), reverse=True)[:limit]
        elif filter_type == "losers":
            # En çok kaybedenler
            sorted_symbols = sorted(tickers, key=lambda x: float(x.get('priceChangePercent', 0)))[:limit]
        elif filter_type == "volume":
            # En yüksek hacim
            sorted_symbols = sorted(tickers, key=lambda x: float(x.get('volume', 0)), reverse=True)[:limit]
        else:
            raise HTTPException(status_code=400, detail=f"Geçersiz filtre tipi: {filter_type}")
        
        # Sembolleri çıkar
        symbols = [ticker.get('symbol') for ticker in sorted_symbols]
        
        # Trend analizlerini al
        trend_results = await get_multiple_trends(symbols=symbols, interval=interval)
        
        return {
            "filter_type": filter_type,
            "interval": interval,
            "data": trend_results["results"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"En iyi semboller alınırken hata oluştu: {str(e)}") 