#!/usr/bin/env python3
"""
Torypto API uygulamasını çalıştırmak için ana script.
Bu script, uvicorn'u kullanarak uygulamayı başlatır.
"""
import os
import sys
import logging

# Loglama yapılandırması
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("torypto")

if __name__ == "__main__":
    # Mevcut dizin
    current_dir = os.path.abspath(os.path.dirname(__file__))
    logger.info(f"Çalışma dizini: {current_dir}")
    
    # API çalışırken kullanılacak port
    PORT = int(os.getenv("PORT", 8002))
    
    # Python yoluna çalışma dizinini ekle
    sys.path.insert(0, current_dir)
    
    try:
        # Doğrudan uvicorn modülünü çalıştır
        from uvicorn import run
        logger.info(f"API http://localhost:{PORT} adresinde başlatılıyor...")
        
        # Ana uygulamayı başlat
        run(
            "main:app", 
            host="0.0.0.0", 
            port=PORT, 
            reload=True,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Uygulama başlatılırken hata oluştu: {str(e)}")
        sys.exit(1) 