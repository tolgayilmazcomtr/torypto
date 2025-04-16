from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..auth.utils import get_password_hash

class UserRepository:
    """
    Kullanıcı veritabanı işlemleri için repository
    """
    
    @staticmethod
    def get_by_username(db: Session, username: str) -> Optional[User]:
        """Kullanıcı adına göre kullanıcı bulur"""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """E-posta adresine göre kullanıcı bulur"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """ID'ye göre kullanıcı bulur"""
        return db.query(User).filter(User.id == user_id).first()
        
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """Tüm kullanıcıları döndürür"""
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def create(db: Session, user_data: UserCreate) -> User:
        """Yeni kullanıcı oluşturur"""
        # Şifreyi hashle
        hashed_password = get_password_hash(user_data.password)
        
        # Kullanıcı nesnesini oluştur
        user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password
        )
        
        # Veritabanına ekle
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def update(db: Session, user: User, user_data: UserUpdate) -> User:
        """Kullanıcıyı günceller"""
        # Güncellenecek alanları kontrol et
        update_data = user_data.dict(exclude_unset=True)
        
        # Şifre varsa hashle
        if "password" in update_data:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))
            
        # Kullanıcıyı güncelle
        for key, value in update_data.items():
            setattr(user, key, value)
            
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def delete(db: Session, user_id: int) -> bool:
        """Kullanıcıyı siler"""
        user = db.query(User).filter(User.id == user_id).first()
        
        if user:
            db.delete(user)
            db.commit()
            return True
            
        return False 