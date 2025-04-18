from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional

router = APIRouter(
    prefix="/auth",
    tags=["Kimlik Doğrulama"],
    responses={404: {"description": "Bulunamadı"}},
)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# Basit kullanıcı veritabanı (geçici)
fake_users_db = {
    "admin": {
        "username": "admin",
        "full_name": "Admin Kullanıcı",
        "email": "admin@torypto.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    }
}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Kullanıcı girişi ve token oluşturma
    """
    # Burada gerçek bir kimlik doğrulama yapılacak
    if form_data.username != "admin" or form_data.password != "password":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre yanlış",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Basit bir token dönelim (gerçek uygulamada JWT kullanılmalı)
    return {"access_token": "fakesecrettoken", "token_type": "bearer"} 