from sqlalchemy import Column, Integer, String, Numeric, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.base import Base

class Signal(Base):
    """Sinyal modeli"""
    
    __tablename__ = "signals"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False)
    signal_type = Column(String(20), nullable=False)  # 'BUY', 'SELL', 'STRONG_BUY' vb.
    price = Column(Numeric, nullable=False)
    indicators = Column(JSON, nullable=False)  # teknik gösterge değerleri
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    status = Column(String(20), default='active')
    extra_data = Column(JSON)
    
    # İlişkiler
    user_signals = relationship("UserSignal", back_populates="signal")

class UserSignal(Base):
    """Kullanıcı sinyalleri modeli"""
    
    __tablename__ = "user_signals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    signal_id = Column(Integer, ForeignKey("signals.id"), nullable=False)
    is_read = Column(Boolean, default=False)
    is_acted_upon = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # İlişkiler
    user = relationship("User", back_populates="user_signals")
    signal = relationship("Signal", back_populates="user_signals") 