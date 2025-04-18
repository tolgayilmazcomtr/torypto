from fastapi import APIRouter, Depends, HTTPException, Query, Path, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.crypto import Symbol, SymbolCreate, SymbolUpdate, SymbolList, SyncSymbolsResult
from app.services.crypto import SymbolService

# Logger
logger = logging.getLogger("torypto")

router = APIRouter(
    prefix="/api/symbols",
    tags=["Semboller"],
    responses={404: {"description": "Bulunamadı"}},
)

@router.get("/", response_model=SymbolList)
async def get_symbols(
    skip: int = Query(0, description="Atlanacak sembol sayısı"),
    limit: int = Query(100, description="Alınacak maksimum sembol sayısı"),
    base_asset: Optional[str] = Query(None, description="Baz varlık filtreleme (örn. BTC)"),
    quote_asset: Optional[str] = Query("USDT", description="Teklif varlığı filtreleme (örn. USDT)"),
    order_by: Optional[str] = Query("symbol", description="Sıralama kriteri (symbol, price, volume, price_change_percent)"),
    order_dir: Optional[str] = Query("asc", description="Sıralama yönü (asc, desc)"),
    db: Session = Depends(get_db)
):
    """
    Kripto para sembollerini listeler.
    Filtreleme ve sıralama seçenekleri sunar.
    """
    symbol_service = SymbolService(db)
    
    # Temel sorguyu oluştur
    query = db.query(Symbol)
    
    # Filtreleme
    if base_asset:
        query = query.filter(Symbol.base_asset == base_asset.upper())
    if quote_asset:
        query = query.filter(Symbol.quote_asset == quote_asset.upper())
    
    # Toplam sayıyı hesapla
    total = query.count()
    
    # Sıralama
    if order_by == "price" and order_dir == "desc":
        query = query.order_by(Symbol.price.desc())
    elif order_by == "price":
        query = query.order_by(Symbol.price)
    elif order_by == "volume" and order_dir == "desc":
        query = query.order_by(Symbol.volume.desc())
    elif order_by == "volume":
        query = query.order_by(Symbol.volume)
    elif order_by == "price_change_percent" and order_dir == "desc":
        query = query.order_by(Symbol.price_change_percent.desc())
    elif order_by == "price_change_percent":
        query = query.order_by(Symbol.price_change_percent)
    elif order_dir == "desc":
        query = query.order_by(Symbol.symbol.desc())
    else:
        query = query.order_by(Symbol.symbol)
    
    # Sayfalama
    symbols = query.offset(skip).limit(limit).all()
    
    return {"items": symbols, "total": total}

@router.get("/{symbol}", response_model=Symbol)
async def get_symbol(
    symbol: str = Path(..., description="Kripto para sembolü (örn. BTCUSDT)"),
    db: Session = Depends(get_db)
):
    """
    Belirli bir kripto para sembolü hakkında detaylı bilgi alır.
    """
    symbol_service = SymbolService(db)
    db_symbol = symbol_service.get_symbol(symbol.upper())
    if db_symbol is None:
        raise HTTPException(status_code=404, detail="Sembol bulunamadı")
    return db_symbol

@router.post("/", response_model=Symbol, status_code=201)
async def create_symbol(
    symbol_data: SymbolCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Yeni bir kripto para sembolü ekler.
    """
    # Sadece admin kullanıcılar sembol ekleyebilir
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")
    
    symbol_service = SymbolService(db)
    
    # Sembolün zaten var olup olmadığını kontrol et
    existing_symbol = symbol_service.get_symbol(symbol_data.symbol)
    if existing_symbol:
        raise HTTPException(status_code=400, detail="Bu sembol zaten mevcut")
    
    # Sembolü oluştur
    return symbol_service.create_symbol(symbol_data)

@router.put("/{symbol}", response_model=Symbol)
async def update_symbol(
    symbol: str,
    symbol_data: SymbolUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mevcut bir kripto para sembolünü günceller.
    """
    # Sadece admin kullanıcılar sembol güncelleyebilir
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")
    
    symbol_service = SymbolService(db)
    
    # Sembolün var olup olmadığını kontrol et
    existing_symbol = symbol_service.get_symbol(symbol.upper())
    if not existing_symbol:
        raise HTTPException(status_code=404, detail="Sembol bulunamadı")
    
    # Sembolü güncelle
    updated_symbol = symbol_service.update_symbol(symbol.upper(), symbol_data)
    return updated_symbol

@router.delete("/{symbol}", status_code=204)
async def delete_symbol(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Bir kripto para sembolünü siler.
    """
    # Sadece admin kullanıcılar sembol silebilir
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")
    
    symbol_service = SymbolService(db)
    
    # Sembolün var olup olmadığını kontrol et
    existing_symbol = symbol_service.get_symbol(symbol.upper())
    if not existing_symbol:
        raise HTTPException(status_code=404, detail="Sembol bulunamadı")
    
    # Sembolü sil
    symbol_service.delete_symbol(symbol.upper())
    return None

@router.post("/sync", response_model=SyncSymbolsResult)
async def sync_symbols(
    background_tasks: BackgroundTasks,
    run_in_background: bool = Query(True, description="İşlemi arka planda çalıştır"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Kripto para sembollerini Binance'den senkronize eder.
    Varsayılan olarak arka planda çalışır, istenirse bekleyerek çalıştırılabilir.
    """
    # Sadece admin kullanıcılar senkronizasyon başlatabilir
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")
    
    symbol_service = SymbolService(db)
    
    async def sync_task():
        try:
            await symbol_service.sync_binance_symbols_to_db()
            logger.info("Sembol senkronizasyonu tamamlandı")
        except Exception as e:
            logger.error(f"Sembol senkronizasyonu sırasında hata: {str(e)}")
    
    if run_in_background:
        # Arka planda çalıştır
        background_tasks.add_task(sync_task)
        return {"total": 0, "created": 0, "updated": 0, "errors": 0, "message": "Senkronizasyon başlatıldı"}
    else:
        # Bekleyerek çalıştır
        result = await symbol_service.sync_binance_symbols_to_db()
        return result

@router.get("/featured", response_model=List[Symbol])
async def get_featured_symbols(
    limit: int = Query(10, description="Alınacak maksimum sembol sayısı"),
    db: Session = Depends(get_db)
):
    """
    Öne çıkan kripto para sembollerini listeler.
    """
    return db.query(Symbol).filter(Symbol.is_featured == True).limit(limit).all()

@router.post("/{symbol}/feature", response_model=Symbol)
async def feature_symbol(
    symbol: str,
    featured: bool = Query(True, description="Öne çıkar/çıkarma"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Bir kripto para sembolünü öne çıkarılmış olarak işaretler.
    """
    # Sadece admin kullanıcılar sembol öne çıkarabilir
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Bu işlem için yetkiniz yok")
    
    symbol_service = SymbolService(db)
    
    # Sembolün var olup olmadığını kontrol et
    existing_symbol = symbol_service.get_symbol(symbol.upper())
    if not existing_symbol:
        raise HTTPException(status_code=404, detail="Sembol bulunamadı")
    
    # Sembolü güncelle
    existing_symbol.is_featured = featured
    db.commit()
    db.refresh(existing_symbol)
    
    return existing_symbol 