from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func

from ..database import Base

class Symbol(Base):
    __tablename__ = "symbols"

    symbol = Column(String, primary_key=True, index=True)
    base_asset = Column(String, nullable=False)
    quote_asset = Column(String, nullable=False)
    name = Column(String)
    icon_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 