import secrets
from typing import List, Optional, Union

from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 dakika * 24 saat * 7 gün = 1 hafta
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    # CORS ayarlarını yalnızca geliştirme ortamında kabul et
    SERVER_NAME: str = "torypto-api"
    SERVER_HOST: AnyHttpUrl = "http://localhost:8000"
    
    # CORS ayarları
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:3000"]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # PostgreSQL ayarları
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "torypto"
    DATABASE_URI: Optional[PostgresDsn] = None

    @field_validator("DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], values: dict[str, any]) -> any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"{values.get('POSTGRES_DB') or ''}",
        )

    # Redis ayarları
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB: int = 0

    # Binance API
    BINANCE_API_KEY: str = ""
    BINANCE_API_SECRET: str = ""

    # OpenAI API
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    
    # WooCommerce ayarları
    WC_API_URL: str = ""
    WC_CONSUMER_KEY: str = ""
    WC_CONSUMER_SECRET: str = ""
    PREMIUM_PRODUCT_ID: int = 1

    # Freemium ayarları
    FREE_DAILY_ANALYSIS_LIMIT: int = 3

    # JWT token
    JWT_SECRET: str = "torypto-jwt-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")


settings = Settings() 