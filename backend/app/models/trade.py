from sqlalchemy import Column, Integer, String, Numeric, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database.base import Base

class Trade(Base):
    """İşlem geçmişi modeli"""
    
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    side = Column(String(4), nullable=False)  # 'BUY' veya 'SELL'
    quantity = Column(Numeric, nullable=False)
    price = Column(Numeric, nullable=False)
    total_amount = Column(Numeric, nullable=False)
    commission = Column(Numeric)
    commission_asset = Column(String(10))
    trade_time = Column(DateTime(timezone=True), nullable=False)
    order_id = Column(String(100))
    status = Column(String(20))
    type = Column(String(20))  # 'MARKET', 'LIMIT' vb.
    extra_data = Column(JSON)  # ek bilgiler
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # İlişkiler
    user = relationship("User", back_populates="trades") 