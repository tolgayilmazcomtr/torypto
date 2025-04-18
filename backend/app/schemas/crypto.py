from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
from decimal import Decimal


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


class SymbolBase(BaseModel):
    """Kripto sembol temel veri modeli"""
    symbol: str
    base_asset: str
    quote_asset: str
    status: str = "TRADING"
    icon_url: Optional[str] = None


class SymbolCreate(SymbolBase):
    """Sembol oluşturma modeli"""
    pass


class SymbolUpdate(BaseModel):
    """Sembol güncelleme modeli"""
    base_asset: Optional[str] = None
    quote_asset: Optional[str] = None
    status: Optional[str] = None
    icon_url: Optional[str] = None
    price: Optional[float] = None
    price_change: Optional[float] = None
    price_change_percent: Optional[float] = None
    volume: Optional[float] = None
    high_price: Optional[float] = None
    low_price: Optional[float] = None
    is_featured: Optional[bool] = None
    rank: Optional[int] = None


class Symbol(SymbolBase):
    """Sembol tam veri modeli"""
    id: int
    price: Optional[float] = None
    price_change: Optional[float] = None
    price_change_percent: Optional[float] = None
    volume: Optional[float] = None
    high_price: Optional[float] = None
    low_price: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_featured: bool = False
    rank: Optional[int] = None

    class Config:
        from_attributes = True


class SymbolList(BaseModel):
    """Sembol listesi yanıt modeli"""
    items: List[Symbol]
    total: int


class SymbolPrice(BaseModel):
    """Sembol fiyat bilgisi modeli"""
    symbol: str
    price: float


class KlineData(BaseModel):
    """Mum grafiği verisi modeli"""
    open_time: int
    open: float
    high: float
    low: float
    close: float
    volume: float
    close_time: int
    quote_asset_volume: float
    number_of_trades: int
    taker_buy_base_asset_volume: float
    taker_buy_quote_asset_volume: float

    @field_validator('open', 'high', 'low', 'close', 'volume', 'quote_asset_volume', 
                 'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', mode='before')
    @classmethod
    def ensure_float(cls, v):
        if isinstance(v, str):
            return float(v)
        return v


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


class SyncSymbolsResult(BaseModel):
    """Sembol senkronizasyon sonucu"""
    total: int
    created: int
    updated: int
    errors: int 