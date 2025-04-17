from typing import Optional, List, Union
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field, validator
import enum

from backend.app.models.signal import SignalType


class SignalTimeframe(str, enum.Enum):
    M1 = "1m"  # 1 dakika
    M5 = "5m"  # 5 dakika
    M15 = "15m"  # 15 dakika
    M30 = "30m"  # 30 dakika
    H1 = "1h"  # 1 saat
    H2 = "2h"  # 2 saat
    H4 = "4h"  # 4 saat
    H6 = "6h"  # 6 saat
    H12 = "12h"  # 12 saat
    D1 = "1d"  # 1 gün
    W1 = "1w"  # 1 hafta
    M1M = "1M"  # 1 ay


class SignalConfidence(str, Enum):
    LOW = "LOW"  # Düşük güven
    MEDIUM = "MEDIUM"  # Orta güven
    HIGH = "HIGH"  # Yüksek güven


class SignalBase(BaseModel):
    """Sinyal temel şeması"""
    symbol: str = Field(..., description="Kripto para sembolü (BTCUSDT gibi)")
    type: SignalType = Field(..., description="Sinyal tipi (ALIŞ/SATIŞ)")
    timeframe: SignalTimeframe = Field(..., description="Zaman dilimi")
    price: float = Field(..., description="Giriş fiyatı")
    take_profit: Optional[float] = Field(None, description="Hedef fiyat")
    stop_loss: Optional[float] = Field(None, description="Zarar kesme fiyatı")
    confidence: Optional[int] = Field(None, description="Güven derecesi (%)", ge=0, le=100)
    description: Optional[str] = Field(None, description="Sinyal açıklaması")
    
    @validator('symbol')
    def check_symbol(cls, v):
        if not v or len(v) < 2:
            raise ValueError('Sembol geçerli değil')
        return v.upper()
    
    @validator('price', 'take_profit', 'stop_loss')
    def check_positive_price(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Fiyat pozitif olmalıdır')
        return v


class SignalCreate(SignalBase):
    """Sinyal oluşturma şeması"""
    pass


class SignalUpdate(BaseModel):
    """Sinyal güncelleme şeması"""
    symbol: Optional[str] = None
    type: Optional[SignalType] = None
    timeframe: Optional[SignalTimeframe] = None
    price: Optional[float] = None
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None
    confidence: Optional[int] = Field(None, ge=0, le=100)
    description: Optional[str] = None
    active: Optional[bool] = None


class SignalClose(BaseModel):
    """Sinyal kapatma şeması"""
    closed_price: float = Field(..., description="Kapanış fiyatı")


class SignalInDB(SignalBase):
    """Veritabanındaki sinyal şeması"""
    id: int
    active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    closed_price: Optional[float] = None
    profit_loss: Optional[float] = None
    profit_loss_percentage: Optional[float] = None

    class Config:
        orm_mode = True


class SignalResponse(SignalInDB):
    """API yanıtı için sinyal şeması"""
    pass


class SignalFilters(BaseModel):
    """Sinyal filtreleme şeması"""
    symbol: Optional[str] = None
    type: Optional[SignalType] = None
    timeframe: Optional[SignalTimeframe] = None
    active_only: bool = False
    min_confidence: Optional[int] = Field(None, ge=0, le=100)
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None


class SignalStatistics(BaseModel):
    """Sinyal istatistikleri şeması"""
    total_signals: int
    active_signals: int
    closed_signals: int
    profitable_signals: int
    losing_signals: int
    average_profit_percentage: float
    average_loss_percentage: float
    success_rate: float  # Yüzde olarak başarı oranı
    symbols: List[str]  # Sinyal verilen semboller
    timeframes: List[SignalTimeframe]  # Kullanılan zaman dilimleri