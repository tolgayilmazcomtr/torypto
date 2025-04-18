from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from services.binance_service import BinanceService
from utils.technical_indicators import TechnicalIndicators

router = APIRouter(prefix="/crypto", tags=["Kripto"])
binance_service = BinanceService()

@router.get("/symbols")
async def get_all_symbols():
    """
    Binance borsasındaki tüm kripto para sembollerini döndürür
    
    Returns:
        List[str]: Sembol listesi
    """
    try:
        symbols = await binance_service.get_all_symbols()
        return {"symbols": symbols}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semboller getirilirken hata oluştu: {str(e)}")

@router.get("/price/{symbol}")
async def get_price(symbol: str):
    """
    Belirli bir sembol için güncel fiyat bilgisini döndürür
    
    Args:
        symbol: Fiyatı istenilen kripto para sembolü (örn. BTCUSDT)
        
    Returns:
        Dict: Sembol ve fiyat bilgisi
    """
    try:
        price = await binance_service.get_price(symbol)
        return {"symbol": symbol, "price": price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fiyat bilgisi alınırken hata oluştu: {str(e)}")

@router.get("/prices")
async def get_all_prices():
    """
    Tüm semboller için güncel fiyat bilgilerini döndürür
    
    Returns:
        List[Dict]: Sembol ve fiyat bilgilerini içeren liste
    """
    try:
        prices = await binance_service.get_all_prices()
        return {"prices": prices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fiyatlar alınırken hata oluştu: {str(e)}")

@router.get("/klines/{symbol}")
async def get_klines(
    symbol: str,
    interval: str = "1h",
    limit: int = 100,
    add_indicators: bool = False
):
    """
    Belirli bir sembol için OHLCV (mum) verisini döndürür
    
    Args:
        symbol: İstenilen kripto para sembolü (örn. BTCUSDT)
        interval: Zaman aralığı (1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M)
        limit: Kaç mum getirileceği
        add_indicators: Teknik göstergelerin eklenip eklenmeyeceği
        
    Returns:
        Dict: OHLCV verisi ve opsiyonel olarak teknik göstergeler
    """
    try:
        # OHLCV verilerini al
        klines = await binance_service.get_klines(symbol, interval, limit)
        
        # DataFrame'e dönüştür
        df = pd.DataFrame(klines, columns=[
            'open_time', 'open', 'high', 'low', 'close', 'volume',
            'close_time', 'quote_asset_volume', 'number_of_trades',
            'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
        ])
        
        # Veri tipleri düzeltme
        for col in ['open', 'high', 'low', 'close', 'volume']:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        df['open_time'] = pd.to_datetime(df['open_time'], unit='ms')
        df['close_time'] = pd.to_datetime(df['close_time'], unit='ms')
        
        # Teknik göstergeleri ekle
        if add_indicators:
            df = TechnicalIndicators.add_all_indicators(df)
        
        # Sonucu JSON formatına dönüştür
        result = {
            "symbol": symbol,
            "interval": interval,
            "data": df.to_dict(orient='records')
        }
        
        # Teknik göstergeler eklendiyse, trend analizi de ekle
        if add_indicators:
            result["trend_analysis"] = TechnicalIndicators.get_trend(df)
            result["signals"] = TechnicalIndicators.get_signals(df)
            result["support_resistance"] = TechnicalIndicators.identify_support_resistance(df)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OHLCV verisi alınırken hata oluştu: {str(e)}")

@router.get("/top-volume")
async def get_top_volume(
    quote_asset: str = "USDT",
    limit: int = 10
):
    """
    En yüksek işlem hacmine sahip kripto paraları döndürür
    
    Args:
        quote_asset: Baz para birimi (USDT, BTC, ETH vb.)
        limit: Kaç adet sembol getirileceği
        
    Returns:
        List[Dict]: Yüksek hacimli kripto paraların bilgilerini içeren liste
    """
    try:
        all_tickers = await binance_service.get_24h_ticker()
        
        # Quote asset ile biten sembolleri filtrele
        filtered_tickers = [
            ticker for ticker in all_tickers 
            if ticker["symbol"].endswith(quote_asset)
        ]
        
        # Hacme göre sırala
        sorted_tickers = sorted(
            filtered_tickers, 
            key=lambda x: float(x["volume"]) * float(x["lastPrice"]), 
            reverse=True
        )
        
        # İstenilen sayıda döndür
        top_tickers = sorted_tickers[:limit]
        
        # Sonucu formatlama
        result = []
        for ticker in top_tickers:
            symbol = ticker["symbol"]
            base_asset = symbol.replace(quote_asset, "")
            
            result.append({
                "symbol": symbol,
                "base_asset": base_asset,
                "quote_asset": quote_asset,
                "price": float(ticker["lastPrice"]),
                "volume_24h": float(ticker["volume"]),
                "quote_volume_24h": float(ticker["volume"]) * float(ticker["lastPrice"]),
                "price_change_24h": float(ticker["priceChange"]),
                "price_change_percent_24h": float(ticker["priceChangePercent"])
            })
        
        return {"top_volume": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hacim bilgisi alınırken hata oluştu: {str(e)}")

@router.get("/technical/{symbol}")
async def get_technical_analysis(
    symbol: str,
    interval: str = "1h",
    limit: int = 100
):
    """
    Bir sembol için detaylı teknik analiz bilgilerini döndürür
    
    Args:
        symbol: İstenilen kripto para sembolü (örn. BTCUSDT)
        interval: Zaman aralığı (1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M)
        limit: Kaç mum kullanılacağı
        
    Returns:
        Dict: Teknik analiz sonuçları ve öneriler
    """
    try:
        # OHLCV verilerini al
        klines = await binance_service.get_klines(symbol, interval, limit)
        
        # DataFrame'e dönüştür
        df = pd.DataFrame(klines, columns=[
            'open_time', 'open', 'high', 'low', 'close', 'volume',
            'close_time', 'quote_asset_volume', 'number_of_trades',
            'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
        ])
        
        # Veri tipleri düzeltme
        for col in ['open', 'high', 'low', 'close', 'volume']:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        df['open_time'] = pd.to_datetime(df['open_time'], unit='ms')
        df['close_time'] = pd.to_datetime(df['close_time'], unit='ms')
        
        # Teknik göstergeleri ekle
        df = TechnicalIndicators.add_all_indicators(df)
        
        # Son fiyat
        current_price = df['close'].iloc[-1]
        
        # Trend analizi
        trend_analysis = TechnicalIndicators.get_trend(df)
        
        # Alım-satım sinyalleri
        signals = TechnicalIndicators.get_signals(df)
        
        # Destek ve direnç seviyeleri
        support_resistance = TechnicalIndicators.identify_support_resistance(df)
        
        # Son mum verileri
        last_candle = {
            "time": df['close_time'].iloc[-1].isoformat(),
            "open": float(df['open'].iloc[-1]),
            "high": float(df['high'].iloc[-1]),
            "low": float(df['low'].iloc[-1]),
            "close": float(df['close'].iloc[-1]),
            "volume": float(df['volume'].iloc[-1])
        }
        
        # Temel teknik gösterge değerleri
        indicators = {
            "rsi": float(df['rsi'].iloc[-1]),
            "macd": float(df['macd'].iloc[-1]),
            "macd_signal": float(df['macd_signal'].iloc[-1]),
            "macd_hist": float(df['macd_hist'].iloc[-1]),
            "stoch_k": float(df['stoch_k'].iloc[-1]),
            "stoch_d": float(df['stoch_d'].iloc[-1]),
            "bb_upper": float(df['bb_upper'].iloc[-1]),
            "bb_middle": float(df['bb_middle'].iloc[-1]),
            "bb_lower": float(df['bb_lower'].iloc[-1]),
            "ma7": float(df['ma7'].iloc[-1]),
            "ma25": float(df['ma25'].iloc[-1]),
            "ma99": float(df['ma99'].iloc[-1]),
            "adx": float(df['adx'].iloc[-1])
        }
        
        # Sonuç
        return {
            "symbol": symbol,
            "interval": interval,
            "current_price": current_price,
            "last_candle": last_candle,
            "indicators": indicators,
            "trend_analysis": trend_analysis,
            "signals": signals,
            "support_resistance": support_resistance
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Teknik analiz yapılırken hata oluştu: {str(e)}") 