from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
import os
import secrets
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Şifreleme ayarları
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT ayarları
SECRET_KEY = os.getenv("SECRET_KEY")
# Eğer SECRET_KEY yoksa veya çok kısaysa, güvenli bir anahtar oluştur
if not SECRET_KEY or len(SECRET_KEY) < 32:
    SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_hex(32))
    # Uyarı ver ama uygulamayı durdurmuyoruz
    print(f"UYARI: Güvenli SECRET_KEY bulunamadı, otomatik oluşturuldu: {SECRET_KEY}")
    print("Bu anahtarı .env dosyanıza SECRET_KEY olarak eklemeniz önerilir.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Gönderilen şifrenin hash'lenmiş şifre ile eşleşip eşleşmediğini kontrol eder
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Verilen şifreyi hashler
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    JWT token oluşturur
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt 