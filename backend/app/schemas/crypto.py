from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

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
    symbol: str
    price: float

class KlineData(BaseModel):
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