from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.base import Base

class APIKey(Base):
    """API anahtarları modeli"""
    
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exchange = Column(String(50), nullable=False)  # 'binance', 'ftx' vb.
    api_key = Column(String(255), nullable=False)
    api_secret = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True))
    permissions = Column(JSON)  # izinler ve kısıtlamalar
    
    # İlişkiler
    user = relationship("User", back_populates="api_keys") 