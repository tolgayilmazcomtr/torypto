from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum, func
from sqlalchemy.orm import relationship
import enum

from app.database.base_class import Base

class SignalType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"

class SignalTimeframe(str, enum.Enum):
    M1 = "1m"
    M5 = "5m"
    M15 = "15m"
    M30 = "30m"
    H1 = "1h"
    H2 = "2h"
    H4 = "4h"
    H6 = "6h"
    H8 = "8h"
    H12 = "12h"
    D1 = "1d"
    W1 = "1w"
    M1M = "1M"

class SignalConfidence(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class Signal(Base):
    """Alım/satım sinyalleri için veritabanı modeli"""
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False, index=True)
    type = Column(SQLEnum(SignalType), nullable=False)
    timeframe = Column(SQLEnum(SignalTimeframe), nullable=False)
    price = Column(Float, nullable=False)
    take_profit = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)
    confidence = Column(Integer, nullable=True)  # 0-100 arası güven derecesi
    description = Column(Text, nullable=True)
    
    # Sinyal durum alanları
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    closed_price = Column(Float, nullable=True)
    profit_loss = Column(Float, nullable=True)  # Net kazanç/kayıp miktarı
    profit_loss_percentage = Column(Float, nullable=True)  # Yüzde olarak kazanç/kayıp
    
    # İlişkiler
    user_signals = relationship("UserSignal", back_populates="signal", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"Signal(id={self.id}, symbol={self.symbol}, type={self.type}, price={self.price})"
        
    def close(self, closed_price: float):
        """Sinyali kapat ve kâr/zarar hesapla"""
        self.active = False
        self.closed_price = closed_price
        self.closed_at = datetime.utcnow()
        
        # Kâr/zarar hesaplama
        if self.type == SignalType.BUY:
            # Alış sinyalinde, kapanış > giriş ise kâr
            self.profit_loss = closed_price - self.price
            self.profit_loss_percentage = (closed_price - self.price) / self.price * 100
        else:  # SELL
            # Satış sinyalinde, kapanış < giriş ise kâr
            self.profit_loss = self.price - closed_price
            self.profit_loss_percentage = (self.price - closed_price) / self.price * 100
        
        return self

class UserSignal(Base):
    """Kullanıcı-sinyal ilişkisi için veritabanı modeli"""
    __tablename__ = "user_signals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    signal_id = Column(Integer, ForeignKey("signals.id"), nullable=False)
    
    # Kullanıcı özel ayarları
    custom_take_profit = Column(Float, nullable=True)
    custom_stop_loss = Column(Float, nullable=True)
    order_placed = Column(Boolean, default=False)  # Sipariş verildi mi?
    notes = Column(Text, nullable=True)  # Kullanıcı notları
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # İlişkiler
    user = relationship("User", back_populates="signals")
    signal = relationship("Signal", back_populates="user_signals") 