from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional

from services.binance_service import BinanceService

router = APIRouter(
    prefix="/symbols",
    tags=["Semboller"],
    responses={404: {"description": "Bulunamadı"}},
)

@router.get("/")
async def get_symbols(
    quote_asset: Optional[str] = Query(None, description="USDT, BTC, ETH gibi temel varlık filtresi"),
    only_favorites: bool = Query(False, description="Sadece favorileri göster")
):
    """
    Kripto para sembollerini listeler
    """
    try:
        binance_service = BinanceService()
        symbols_info = await binance_service.get_symbols_info()
        
        # Filtrele
        if quote_asset:
            symbols_info = [s for s in symbols_info if s["quoteAsset"] == quote_asset]
        
        # Favori filtreleme (gerçek uygulamada veritabanından çekilir)
        if only_favorites:
            # Şimdilik sadece BTCUSDT, ETHUSDT gibi popüler sembolleri favori kabul edelim
            popular_symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT"]
            symbols_info = [s for s in symbols_info if s["symbol"] in popular_symbols]
            
        return {
            "count": len(symbols_info),
            "symbols": symbols_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semboller alınırken hata oluştu: {str(e)}")

@router.get("/{symbol}")
async def get_symbol_info(symbol: str):
    """
    Belirli bir sembol hakkında detaylı bilgi alır
    """
    try:
        binance_service = BinanceService()
        
        # Sembol bilgisini al
        symbols_info = await binance_service.get_symbols_info()
        
        # İstenen sembolü bul
        symbol_info = next((s for s in symbols_info if s["symbol"] == symbol.upper()), None)
        
        if not symbol_info:
            raise HTTPException(status_code=404, detail=f"Sembol bulunamadı: {symbol}")
        
        # 24 saatlik fiyat değişim bilgilerini al
        ticker_info = await binance_service.get_ticker(symbol.upper())
        
        # Bilgileri birleştir
        result = {
            **symbol_info,
            "price": ticker_info["lastPrice"],
            "priceChange": ticker_info["priceChange"],
            "priceChangePercent": ticker_info["priceChangePercent"],
            "volume": ticker_info["volume"],
            "highPrice": ticker_info["highPrice"],
            "lowPrice": ticker_info["lowPrice"]
        }
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sembol bilgisi alınırken hata oluştu: {str(e)}") 