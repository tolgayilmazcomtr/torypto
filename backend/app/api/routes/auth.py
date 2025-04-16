from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ...database.base import get_db
from ...schemas.user import Token, UserCreate, UserOut
from ...services.user_service import UserService

router = APIRouter(
    prefix="/api/auth",
    tags=["Kimlik Doğrulama"],
    responses={401: {"description": "Yetkisiz Erişim"}}
)

@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Kullanıcı giriş yapar ve JWT token alır
    """
    # Kullanıcıyı doğrula
    user = UserService.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hatalı kullanıcı adı veya şifre",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Token oluştur
    return UserService.create_token(user)

@router.post("/register", response_model=UserOut)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Yeni kullanıcı kaydı oluşturur
    """
    return UserService.create_user(db, user_data) 