from .data.binance_client import BinanceClient
import os
from typing import Optional
from functools import lru_cache
import logging

logger = logging.getLogger("torypto")

@lru_cache
def get_binance_client() -> BinanceClient:
    """
    Binance istemcisini döndürür. API anahtarları varsa bunları kullanır.
    Singleton olarak çalışması için lru_cache ile işaretlenmiştir.
    """
    api_key: Optional[str] = os.environ.get("BINANCE_API_KEY")
    api_secret: Optional[str] = os.environ.get("BINANCE_API_SECRET")
    
    if api_key and api_secret:
        logger.info("Binance istemcisi API anahtarları ile oluşturuluyor")
        return BinanceClient(api_key=api_key, api_secret=api_secret)
    else:
        logger.warning("Binance istemcisi API anahtarları olmadan oluşturuluyor (sadece public API'ler kullanılabilir)")
        return BinanceClient() 