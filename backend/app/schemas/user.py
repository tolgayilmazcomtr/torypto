from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    """Kullanıcı temel özelliklerini içeren şema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    
class UserCreate(UserBase):
    """Kullanıcı oluşturma için şema"""
    password: str = Field(..., min_length=8)
    password_confirm: str
    
    @validator('password_confirm')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Şifreler eşleşmiyor')
        return v

class UserLogin(BaseModel):
    """Kullanıcı girişi için şema"""
    username: str
    password: str

class UserOut(UserBase):
    """Kullanıcı yanıt şeması"""
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    """Kullanıcı güncelleme şeması"""
    email: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

class Token(BaseModel):
    """Token yanıt şeması"""
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    """Token veri şeması"""
    username: Optional[str] = None 