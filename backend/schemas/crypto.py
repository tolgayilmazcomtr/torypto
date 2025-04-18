from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SymbolBase(BaseModel):
    """Sembol temel şeması"""
    symbol: str
    base_asset: str
    quote_asset: str
    
class SymbolCreate(SymbolBase):
    """Sembol oluşturma şeması"""
    pass
    
class SymbolUpdate(BaseModel):
    """Sembol güncelleme şeması"""
    symbol: Optional[str] = None
    base_asset: Optional[str] = None
    quote_asset: Optional[str] = None
    is_favorite: Optional[bool] = None
    is_active: Optional[bool] = None
    
class Symbol(SymbolBase):
    """Veritabanından döndürülen sembol şeması"""
    id: int
    is_favorite: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True 