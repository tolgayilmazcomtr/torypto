from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class IntervalEnum(str, Enum):
    """Mum grafiği aralıkları"""
    MINUTE_1 = "1m"
    MINUTE_3 = "3m"
    MINUTE_5 = "5m"
    MINUTE_15 = "15m"
    MINUTE_30 = "30m"
    HOUR_1 = "1h"
    HOUR_2 = "2h"
    HOUR_4 = "4h"
    HOUR_6 = "6h"
    HOUR_8 = "8h"
    HOUR_12 = "12h"
    DAY_1 = "1d"
    DAY_3 = "3d"
    WEEK_1 = "1w"
    MONTH_1 = "1M"


class Symbol(BaseModel):
    symbol: str
    base_asset: str  # Örn: BTC
    quote_asset: str  # Örn: USDT
    name: str | None = None
    icon_url: str | None = None
    is_active: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


class SymbolPrice(BaseModel):
    """Sembol fiyat bilgisi"""
    symbol: str
    price: float


class KlineData(BaseModel):
    """Kline (mum) veri formatı"""
    open_time: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float
    close_time: datetime
    quote_volume: float
    trades: int
    taker_buy_base: float
    taker_buy_quote: float


class SymbolDetail(BaseModel):
    """Sembol detay bilgisi"""
    symbol: str
    baseAsset: str
    quoteAsset: str
    status: str


class PriceChangeInfo(BaseModel):
    """Fiyat değişim bilgisi"""
    symbol: str
    priceChange: float
    priceChangePercent: float
    weightedAvgPrice: float
    prevClosePrice: float
    lastPrice: float
    lastQty: float
    bidPrice: float
    bidQty: float
    askPrice: float
    askQty: float
    openPrice: float
    highPrice: float
    lowPrice: float
    volume: float
    quoteVolume: float
    openTime: datetime
    closeTime: datetime
    firstId: int
    lastId: int
    count: int


class TechnicalAnalysis(BaseModel):
    """Teknik analiz sonuçları"""
    symbol: str
    interval: str
    last_price: float
    price_change: float
    price_change_percent: float
    trend: Dict[str, Any]
    signals: Dict[str, Any]
    support_resistance: Dict[str, List[float]]
    indicators: Dict[str, Any]
    
    
class SimpleTicker(BaseModel):
    """Basit ticker bilgisi"""
    symbol: str
    base_asset: str
    quote_asset: str
    price: float
    volume_24h: float
    quote_volume_24h: float
    price_change_24h: float
    price_change_percent_24h: float 