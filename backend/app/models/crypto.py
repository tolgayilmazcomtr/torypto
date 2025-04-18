from sqlalchemy import Column, String, Float, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.base import Base

class Symbol(Base):
    """
    Kripto para sembollerini temsil eden model.
    """
    __tablename__ = "symbols"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    base_asset = Column(String, nullable=False)
    quote_asset = Column(String, nullable=False)
    status = Column(String, nullable=False, default="TRADING")
    
    # İkon URL'i
    icon_url = Column(String, nullable=True)
    
    # Fiyat bilgileri
    price = Column(Float, nullable=True)
    price_change = Column(Float, nullable=True)
    price_change_percent = Column(Float, nullable=True)
    volume = Column(Float, nullable=True)
    high_price = Column(Float, nullable=True)
    low_price = Column(Float, nullable=True)
    
    # Zaman damgaları
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Kullanıcılar için favorilere eklenmiş mi?
    is_featured = Column(Boolean, default=False)
    rank = Column(Integer, nullable=True)  # Market cap sıralaması
    
    def __repr__(self):
        return f"<Symbol {self.symbol}>" 