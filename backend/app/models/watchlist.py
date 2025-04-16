from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.base import Base

class Watchlist(Base):
    """Favori coinler modeli"""
    
    __tablename__ = "watchlist"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    alerts = Column(JSON)  # fiyat alarmları
    
    # İlişkiler
    user = relationship("User", back_populates="watchlist_items") 