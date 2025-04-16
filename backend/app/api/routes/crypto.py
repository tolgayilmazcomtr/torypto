from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime

from ...data.binance_client import BinanceClient

# Logger
logger = logging.getLogger("torypto")

# Router oluşturma
router = APIRouter(
    prefix="/api/crypto",
    tags=["Kripto"],
    responses={404: {"description": "Bulunamadı"}},
)

# Bağımlılık
def get_binance_client():
    """Binance istemcisini getir"""
    return BinanceClient()

@router.get("/exchange-info")
async def get_exchange_info(
    client: BinanceClient = Depends(get_binance_client)
):
    """Borsa bilgilerini al"""
    try:
        exchange_info = await client.get_exchange_info()
        return {
            "status": "success",
            "data": exchange_info
        }
    except Exception as e:
        logger.error(f"Borsa bilgileri alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Binance API hatası: {str(e)}")

@router.get("/symbols")
async def get_symbols(
    client: BinanceClient = Depends(get_binance_client)
):
    """Tüm sembol listesini al"""
    try:
        symbols = await client.get_symbols()
        return {
            "status": "success",
            "data": symbols
        }
    except Exception as e:
        logger.error(f"Sembol listesi alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Binance API hatası: {str(e)}")

@router.get("/ticker/price")
async def get_ticker_price(
    symbol: Optional[str] = None,
    client: BinanceClient = Depends(get_binance_client)
):
    """
    Anlık fiyat bilgisini al.
    Symbol belirtilmezse tüm sembollerin fiyatları döner.
    """
    try:
        prices = await client.get_ticker_price(symbol)
        return {
            "status": "success",
            "data": prices
        }
    except Exception as e:
        logger.error(f"Fiyat bilgisi alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Binance API hatası: {str(e)}")

@router.get("/klines")
async def get_klines(
    symbol: str = Query(..., description="Kripto para sembolü, örn: BTCUSDT"),
    interval: str = Query("1h", description="Mum aralığı: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M"),
    limit: int = Query(100, description="Alınacak mum sayısı", ge=1, le=1000),
    start_time: Optional[int] = Query(None, description="Başlangıç zamanı (milisaniye olarak Unix timestamp)"),
    end_time: Optional[int] = Query(None, description="Bitiş zamanı (milisaniye olarak Unix timestamp)"),
    client: BinanceClient = Depends(get_binance_client)
):
    """
    Kripto para için OHLCV verilerini al
    """
    try:
        klines = await client.get_klines(
            symbol=symbol,
            interval=interval,
            limit=limit,
            start_time=start_time,
            end_time=end_time
        )
        
        # Veri dönüşümü
        formatted_data = []
        for k in klines:
            formatted_data.append({
                "open_time": k[0],
                "open": float(k[1]),
                "high": float(k[2]),
                "low": float(k[3]),
                "close": float(k[4]),
                "volume": float(k[5]),
                "close_time": k[6],
                "quote_asset_volume": float(k[7]),
                "number_of_trades": k[8],
                "taker_buy_base_asset_volume": float(k[9]),
                "taker_buy_quote_asset_volume": float(k[10])
            })
            
        return {
            "status": "success",
            "symbol": symbol,
            "interval": interval,
            "count": len(formatted_data),
            "data": formatted_data
        }
    except Exception as e:
        logger.error(f"OHLCV verileri alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Binance API hatası: {str(e)}")

@router.get("/markets")
async def get_markets(
    quote_asset: Optional[str] = Query(None, description="Temel para birimi (USDT, BTC, vb.)"),
    client: BinanceClient = Depends(get_binance_client)
):
    """
    Mevcut piyasaları al
    """
    try:
        all_symbols = await client.get_symbols()
        
        # Quote asset'e göre filtreleme yap
        if quote_asset:
            markets = [s for s in all_symbols if s.endswith(quote_asset)]
        else:
            # En yaygın quote asset'lere göre grupla
            quote_assets = ["USDT", "BUSD", "BTC", "ETH"]
            markets = {}
            for qa in quote_assets:
                markets[qa] = [s for s in all_symbols if s.endswith(qa)]
            
            # Diğer quote asset'leri de ekle
            others = []
            for symbol in all_symbols:
                found = False
                for qa in quote_assets:
                    if symbol.endswith(qa):
                        found = True
                        break
                if not found:
                    others.append(symbol)
            
            if others:
                markets["OTHER"] = others
        
        return {
            "status": "success",
            "data": markets
        }
    except Exception as e:
        logger.error(f"Piyasa bilgileri alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Binance API hatası: {str(e)}") 