from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
import sys

# Loglama yapılandırması
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("torypto")

# FastAPI uygulaması
app = FastAPI(
    title="Torypto API",
    description="Kripto para analizi için API servisi",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {"name": "Kimlik Doğrulama", "description": "Kullanıcı kimlik doğrulama işlemleri"},
        {"name": "Kullanıcılar", "description": "Kullanıcı yönetimi"},
        {"name": "Kripto", "description": "Kripto para fiyat verileri"},
        {"name": "Semboller", "description": "Kripto para sembolleri"},
        {"name": "Teknik Analiz", "description": "Teknik analiz işlemleri"},
        {"name": "status", "description": "API durum kontrolleri"},
        {"name": "admin", "description": "Yönetici işlemleri"},
        {"name": "docs", "description": "API dokümantasyon bilgileri"}
    ]
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için tüm kökenlere izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hata yakalama
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Beklenmeyen hata: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Sunucu hatası", "error": str(exc)}
    )

# Router'ları içe aktar ve ekle
try:
    # API rotalarını ekleme
    from api.routes.auth import router as auth_router
    app.include_router(auth_router)
    logger.info("Auth router başarıyla eklendi")
    
    from api.routes.users import router as users_router
    app.include_router(users_router)
    logger.info("Users router başarıyla eklendi")
    
    from api.routes.crypto import router as crypto_router
    app.include_router(crypto_router)
    logger.info("Crypto router başarıyla eklendi")
    
    from api.routes.technical_analysis import router as technical_analysis_router
    app.include_router(technical_analysis_router)
    logger.info("Technical Analysis router başarıyla eklendi")
    
    from api.routes.symbols import router as symbols_router
    app.include_router(symbols_router)
    logger.info("Symbols router başarıyla eklendi")
    
    # Tüm router'ları debug için göster
    for route in app.routes:
        logger.info(f"Endpoint: {route.path}, methods: {route.methods if hasattr(route, 'methods') else 'N/A'}")
        
except Exception as e:
    logger.error(f"Router ekleme genel hatası: {str(e)}")
    import traceback
    logger.error(f"Tam hata: {traceback.format_exc()}")

@app.get("/", tags=["status"])
async def root():
    """API durum kontrolü için endpoint"""
    return {
        "status": "online",
        "api_version": "0.1.0",
        "app_name": "Torypto API"
    }

@app.get("/health", tags=["status"])
async def health_check():
    """Sağlık kontrolü için endpoint"""
    return {"status": "healthy"}

@app.get("/test/db")
async def test_db():
    """Veritabanı bağlantısını test et"""
    try:
        from database.base import engine
        from sqlalchemy import text
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            value = result.scalar()
        
        return {"success": True, "message": f"Veritabanı bağlantısı başarılı! Test sorgusu sonucu: {value}"}
    except Exception as e:
        logger.error(f"Veritabanı bağlantı hatası: {str(e)}")
        return {"success": False, "error": str(e)}

@app.get("/db/create-tables", tags=["admin"])
async def create_tables():
    """Veritabanı tablolarını oluştur"""
    try:
        # Modelleri import et
        from models.crypto import Symbol
        from database.base import Base, engine
        
        # Tabloları oluştur
        Base.metadata.create_all(bind=engine)
        
        return {"success": True, "message": "Tablolar başarıyla oluşturuldu"}
    except Exception as e:
        logger.error(f"Tablo oluşturma hatası: {str(e)}")
        return {"success": False, "error": str(e)}

# API dokümantasyonu rotaları
@app.get("/api-info", tags=["docs"])
async def api_info():
    """
    API bilgisi ve mevcut rotalar
    """
    routes = []
    for route in app.routes:
        routes.append({
            "path": route.path,
            "name": route.name,
            "methods": list(route.methods) if hasattr(route, "methods") else []
        })
    
    return {
        "title": app.title,
        "description": app.description,
        "version": app.version,
        "routes_count": len(routes),
        "routes": routes
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"API başlatılıyor... http://localhost:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True) 