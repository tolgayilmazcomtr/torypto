from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.crypto import Symbol as SymbolSchema
from ..services.crypto import SymbolService

router = APIRouter(
    prefix="/symbols",
    tags=["symbols"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[SymbolSchema])
def get_all_symbols(
    db: Session = Depends(get_db),
    active_only: bool = False
):
    """
    Tüm sembolleri listeler.
    Opsiyonel olarak sadece aktif sembolleri filtreleyebilir.
    """
    symbol_service = SymbolService(db)
    symbols = symbol_service.get_all_symbols()
    
    if active_only:
        symbols = [s for s in symbols if s.is_active]
        
    return symbols

@router.get("/{symbol}", response_model=SymbolSchema)
def get_symbol(symbol: str, db: Session = Depends(get_db)):
    """
    Belirli bir sembolün detaylarını getirir.
    """
    symbol_service = SymbolService(db)
    db_symbol = symbol_service.get_symbol(symbol.upper())
    if not db_symbol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Sembol bulunamadı: {symbol}"
        )
    return db_symbol

@router.post("/", response_model=SymbolSchema, status_code=status.HTTP_201_CREATED)
def create_symbol(symbol: SymbolSchema, db: Session = Depends(get_db)):
    """
    Yeni bir kripto para sembolü oluşturur.
    """
    symbol.symbol = symbol.symbol.upper()
    symbol_service = SymbolService(db)
    
    # Sembol zaten var mı kontrol et
    existing_symbol = symbol_service.get_symbol(symbol.symbol)
    if existing_symbol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sembol zaten mevcut: {symbol.symbol}"
        )
    
    return symbol_service.create_symbol(symbol)

@router.put("/{symbol}", response_model=SymbolSchema)
def update_symbol(
    symbol: str, 
    symbol_data: SymbolSchema, 
    db: Session = Depends(get_db)
):
    """
    Var olan bir sembolü günceller.
    """
    symbol = symbol.upper()
    symbol_service = SymbolService(db)
    
    db_symbol = symbol_service.get_symbol(symbol)
    if not db_symbol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sembol bulunamadı: {symbol}"
        )
    
    return symbol_service.update_symbol(symbol, symbol_data)

@router.delete("/{symbol}", response_model=SymbolSchema)
def delete_symbol(symbol: str, db: Session = Depends(get_db)):
    """
    Bir sembolü siler.
    """
    symbol = symbol.upper()
    symbol_service = SymbolService(db)
    
    db_symbol = symbol_service.get_symbol(symbol)
    if not db_symbol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sembol bulunamadı: {symbol}"
        )
    
    return symbol_service.delete_symbol(symbol)

@router.post("/bulk", response_model=List[SymbolSchema])
def bulk_create_or_update_symbols(
    symbols: List[SymbolSchema], 
    db: Session = Depends(get_db)
):
    """
    Toplu olarak sembol ekleme veya güncelleme işlemi yapar.
    Varolan semboller güncellenir, olmayanlar oluşturulur.
    """
    # Sembolleri büyük harfe dönüştür
    for symbol in symbols:
        symbol.symbol = symbol.symbol.upper()
    
    symbol_service = SymbolService(db)
    return symbol_service.bulk_create_or_update_symbols(symbols) 