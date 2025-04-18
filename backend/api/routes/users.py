from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(
    prefix="/users",
    tags=["Kullanıcılar"],
    responses={404: {"description": "Bulunamadı"}},
)

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool = True

@router.get("/", response_model=List[User])
async def read_users():
    """
    Tüm kullanıcıları listele
    """
    # Burada veritabanından tüm kullanıcıları çekip döndüreceğiz
    return [
        {"username": "admin", "email": "admin@torypto.com", "full_name": "Admin Kullanıcı", "is_active": True},
        {"username": "demo", "email": "demo@torypto.com", "full_name": "Demo Kullanıcı", "is_active": True}
    ]

@router.get("/me", response_model=User)
async def read_current_user():
    """
    Mevcut kullanıcının bilgilerini getir
    """
    return {"username": "admin", "email": "admin@torypto.com", "full_name": "Admin Kullanıcı", "is_active": True}

@router.get("/{username}", response_model=User)
async def read_user(username: str):
    """
    Belirli bir kullanıcının bilgilerini getir
    """
    return {"username": username, "email": f"{username}@torypto.com", "is_active": True} 