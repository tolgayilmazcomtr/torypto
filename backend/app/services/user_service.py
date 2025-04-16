from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime

from ..repositories.user_repository import UserRepository
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate, UserOut
from ..auth.utils import verify_password, create_access_token

class UserService:
    """
    Kullanıcı işlemleri için servis sınıfı
    """
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        """
        Kullanıcı adı ve şifre ile kimlik doğrulama yapar
        """
        # Kullanıcıyı bul
        user = UserRepository.get_by_username(db, username)
        
        # Kullanıcı yoksa veya şifre yanlışsa None döndür
        if not user or not verify_password(password, user.password_hash):
            return None
            
        return user
    
    @staticmethod
    def create_token(user: User) -> dict:
        """
        Kullanıcı için JWT token oluşturur
        """
        # Token verisi
        token_data = {"sub": user.username}
        
        # Token oluştur
        access_token = create_access_token(data=token_data)
        
        # Kullanıcının son giriş zamanını güncelle
        user.last_login = datetime.utcnow()
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> UserOut:
        """
        Yeni kullanıcı oluşturur
        """
        # Kullanıcı adı kontrol et
        existing_username = UserRepository.get_by_username(db, user_data.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu kullanıcı adı zaten kullanılıyor"
            )
            
        # E-posta kontrol et
        existing_email = UserRepository.get_by_email(db, user_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu e-posta adresi zaten kullanılıyor"
            )
            
        # Kullanıcı oluştur
        user = UserRepository.create(db, user_data)
        
        return UserOut.from_orm(user)
    
    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[UserOut]:
        """
        Tüm kullanıcıları listeler
        """
        users = UserRepository.get_all(db, skip, limit)
        return [UserOut.from_orm(user) for user in users]
    
    @staticmethod
    def get_user(db: Session, user_id: int) -> UserOut:
        """
        Kullanıcı ID'sine göre kullanıcı bilgilerini getirir
        """
        user = UserRepository.get_by_id(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kullanıcı bulunamadı"
            )
            
        return UserOut.from_orm(user)
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> UserOut:
        """
        Kullanıcı bilgilerini günceller
        """
        # Kullanıcıyı bul
        user = UserRepository.get_by_id(db, user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kullanıcı bulunamadı"
            )
            
        # E-posta güncelleme durumunda kontrol et
        if user_data.email and user_data.email != user.email:
            existing_email = UserRepository.get_by_email(db, user_data.email)
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Bu e-posta adresi zaten kullanılıyor"
                )
                
        # Kullanıcıyı güncelle
        updated_user = UserRepository.update(db, user, user_data)
        
        return UserOut.from_orm(updated_user)
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> dict:
        """
        Kullanıcıyı siler
        """
        success = UserRepository.delete(db, user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kullanıcı bulunamadı"
            )
            
        return {"message": "Kullanıcı başarıyla silindi"} 