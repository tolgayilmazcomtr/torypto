from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database.base import Base

class Symbol(Base):
    """
    Kripto para sembollerini saklayan tablo
    """
    __tablename__ = "symbols"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)
    base_asset = Column(String)
    quote_asset = Column(String)
    is_favorite = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 