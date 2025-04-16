from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..data.binance_client import BinanceClient
from ..schemas.crypto import SymbolPrice, KlineData
from datetime import datetime
import logging

router = APIRouter(
    prefix="/crypto",
    tags=["crypto"],
    responses={404: {"description": "Not found"}},
)

binance_client = BinanceClient()
logger = logging.getLogger(__name__)

@router.get("/price/{symbol}", response_model=SymbolPrice)
async def get_symbol_price(symbol: str):
    """
    Belirli bir kripto para çiftinin anlık fiyatını getirir.
    Örnek: /crypto/price/BTCUSDT
    """
    try:
        response = await binance_client.get_ticker_price(symbol.upper())
        return {"symbol": response["symbol"], "price": float(response["price"])}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/prices", response_model=List[SymbolPrice])
async def get_all_prices(symbols: Optional[str] = None):
    """
    Birden fazla kripto para çiftinin fiyatını getirir.
    Örnek: /crypto/prices?symbols=BTCUSDT,ETHUSDT,BNBUSDT
    """
    try:
        if symbols:
            symbol_list = [s.strip().upper() for s in symbols.split(",")]
            prices = await binance_client.get_ticker_prices(symbol_list)
        else:
            prices = await binance_client.get_ticker_prices()
        return [{"symbol": k, "price": v} for k, v in prices.items()]
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/klines/{symbol}", response_model=List[KlineData])
async def get_symbol_klines(
    symbol: str,
    interval: str = "1h",
    limit: int = 100
):
    """
    Belirli bir kripto para çifti için Kline/Candlestick verilerini getirir.
    Örnek: /crypto/klines/BTCUSDT?interval=1h&limit=100
    
    Geçerli aralıklar: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
    """
    try:
        klines = await binance_client.get_klines(
            symbol.upper(),
            interval=interval,
            limit=limit
        )
        
        # Binance'den gelen veriyi KlineData formatına dönüştür
        formatted_klines = []
        for kline in klines:
            formatted_klines.append({
                "open_time": datetime.fromtimestamp(kline[0] / 1000),  # Binance milisaniye cinsinden timestamp döndürür
                "open": float(kline[1]),
                "high": float(kline[2]),
                "low": float(kline[3]),
                "close": float(kline[4]),
                "volume": float(kline[5]),
                "close_time": datetime.fromtimestamp(kline[6] / 1000),
                "quote_volume": float(kline[7]),
                "trades": int(kline[8]),
                "taker_buy_base": float(kline[9]),
                "taker_buy_quote": float(kline[10])
            })
            
        return formatted_klines
    except Exception as e:
        logger.error(f"Kline verisi alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {str(e)}") 