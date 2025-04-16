from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Uygulama oluşturma
app = FastAPI(
    title="Torypto API",
    description="AI Destekli Kripto Teknik Analiz ve Sinyal Platformu API",
    version="0.1.0",
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için tüm originlere izin ver (prod'da kısıtlanacak)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ana endpoint
@app.get("/")
async def root():
    return {"message": "Torypto API'ye hoş geldiniz!"}

# Sağlık kontrolü
@app.get("/health")
async def health_check():
    return JSONResponse(
        status_code=200,
        content={"status": "Sistem çalışıyor", "version": app.version},
    )

# API versiyonu
@app.get("/version")
async def version():
    return {"version": app.version}

# API rotalarını içe aktar
# NOT: Daha sonra oluşturulacak API modülleri burada import edilecek
# from app.api import auth, analysis, signals, subscriptions
# app.include_router(auth.router, prefix="/api/auth", tags=["Kimlik Doğrulama"])
# app.include_router(analysis.router, prefix="/api/analysis", tags=["Analizler"])
# app.include_router(signals.router, prefix="/api/signals", tags=["Sinyaller"])
# app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["Abonelikler"])

# Uygulama başlatıldığında çalışacak olaylar
@app.on_event("startup")
async def startup_event():
    # Veritabanı bağlantıları, önbellek, başlangıç görevleri vb.
    print("Torypto API başlatılıyor...")

@app.on_event("shutdown")
async def shutdown_event():
    # Bağlantıları kapat, temizlik işlemleri vb.
    print("Torypto API kapatılıyor...")

# Uygulamayı çalıştırmak için: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 