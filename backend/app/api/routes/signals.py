from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, Body
from sqlalchemy.orm import Session
from datetime import datetime

from backend.app.api.deps import get_db, get_current_active_user
from backend.app.models.user import User
from backend.app.crud import signal as signal_crud
from backend.app.schemas.signal import (
    SignalCreate,
    SignalUpdate,
    SignalResponse,
    SignalClose,
    SignalStatistics,
    SignalFilters,
    SignalType,
    SignalTimeframe
)

router = APIRouter(
    prefix="/api/signals",
    tags=["Sinyaller"],
)


@router.post("/", response_model=SignalResponse, summary="Yeni sinyal oluştur")
async def create_signal(
    signal_data: SignalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Yeni bir alım/satım sinyali oluşturur.
    
    - **symbol**: Kripto para sembolü (örn. BTCUSDT)
    - **type**: Sinyal tipi (BUY veya SELL)
    - **timeframe**: Zaman dilimi (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w)
    - **price**: Giriş fiyatı
    - **take_profit**: Hedef fiyat (opsiyonel)
    - **stop_loss**: Zarar durdurma seviyesi (opsiyonel)
    - **confidence**: Güven derecesi (0-100)
    - **description**: Sinyal açıklaması (opsiyonel)
    """
    # Sadece admin kullanıcılar sinyal oluşturabilir
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Bu işlem için yeterli yetkiniz yok"
        )
    
    return signal_crud.create_signal(db=db, signal=signal_data)


@router.get("/", response_model=List[SignalResponse], summary="Sinyalleri listele")
async def list_signals(
    symbol: Optional[str] = Query(None, description="Kripto para sembolü"),
    type: Optional[SignalType] = Query(None, description="Sinyal tipi"),
    timeframe: Optional[SignalTimeframe] = Query(None, description="Zaman dilimi"),
    active_only: bool = Query(False, description="Sadece aktif sinyalleri göster"),
    min_confidence: Optional[int] = Query(None, ge=0, le=100, description="Minimum güven derecesi"),
    date_from: Optional[datetime] = Query(None, description="Başlangıç tarihi"),
    date_to: Optional[datetime] = Query(None, description="Bitiş tarihi"),
    skip: int = Query(0, ge=0, description="Atlanacak kayıt sayısı"),
    limit: int = Query(100, ge=1, le=100, description="Getirilecek kayıt sayısı"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Sinyalleri filtreli olarak listeler.
    
    - **symbol**: Kripto para sembolüne göre filtrele
    - **type**: Sinyal tipine göre filtrele (BUY/SELL)
    - **timeframe**: Zaman dilimine göre filtrele
    - **active_only**: Sadece aktif sinyalleri getir
    - **min_confidence**: Minimum güven derecesine göre filtrele
    - **date_from**: Başlangıç tarihine göre filtrele
    - **date_to**: Bitiş tarihine göre filtrele
    - **skip**: Atlanacak kayıt sayısı (sayfalama için)
    - **limit**: Getirilecek kayıt sayısı (sayfalama için)
    """
    filters = SignalFilters(
        symbol=symbol,
        type=type,
        timeframe=timeframe,
        active_only=active_only,
        min_confidence=min_confidence,
        date_from=date_from,
        date_to=date_to
    )
    
    return signal_crud.get_signals(
        db=db,
        skip=skip,
        limit=limit,
        filters=filters
    )


@router.get("/active", response_model=List[SignalResponse], summary="Aktif sinyalleri getir")
async def get_active_signals(
    skip: int = Query(0, ge=0, description="Atlanacak kayıt sayısı"),
    limit: int = Query(100, ge=1, le=100, description="Getirilecek kayıt sayısı"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Aktif (henüz kapanmamış) sinyalleri listeler.
    
    - **skip**: Atlanacak kayıt sayısı (sayfalama için)
    - **limit**: Getirilecek kayıt sayısı (sayfalama için)
    """
    return signal_crud.get_active_signals(db, skip=skip, limit=limit)


@router.get("/statistics", response_model=SignalStatistics, summary="Sinyal istatistiklerini getir")
async def get_signal_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Sinyal istatistiklerini getirir:
    
    - Toplam sinyal sayısı
    - Aktif/kapalı sinyal sayısı
    - Kârlı/zararlı sinyal sayısı
    - Ortalama kâr/zarar yüzdeleri
    - Başarı oranı
    - Sinyal verilen semboller
    - Kullanılan zaman dilimleri
    """
    return signal_crud.get_signal_statistics(db)


@router.get("/{signal_id}", response_model=SignalResponse, summary="Sinyal detayını getir")
async def get_signal(
    signal_id: int = Path(..., description="Sinyal ID", ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Belirli bir sinyal detayını getirir.
    
    - **signal_id**: Sinyal ID
    """
    signal = signal_crud.get_signal(db, signal_id=signal_id)
    
    if not signal:
        raise HTTPException(
            status_code=404,
            detail="Sinyal bulunamadı"
        )
    
    return signal


@router.put("/{signal_id}", response_model=SignalResponse, summary="Sinyal güncelle")
async def update_signal(
    signal_id: int = Path(..., description="Sinyal ID", ge=1),
    signal_data: SignalUpdate = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Sinyal bilgilerini günceller.
    
    - **signal_id**: Güncellenecek sinyal ID
    - **signal_data**: Güncellenecek alanlar (yalnızca değiştirmek istediğiniz alanları gönderin)
    """
    # Sadece admin kullanıcılar sinyal güncelleyebilir
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Bu işlem için yeterli yetkiniz yok"
        )
    
    updated_signal = signal_crud.update_signal(db, signal_id=signal_id, signal_data=signal_data)
    
    if not updated_signal:
        raise HTTPException(
            status_code=404,
            detail="Sinyal bulunamadı"
        )
    
    return updated_signal


@router.post("/{signal_id}/close", response_model=SignalResponse, summary="Sinyali kapat")
async def close_signal(
    signal_id: int = Path(..., description="Sinyal ID", ge=1),
    close_data: SignalClose = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Sinyali kapatır ve kâr/zarar hesaplar.
    
    - **signal_id**: Kapatılacak sinyal ID
    - **closed_price**: Kapanış fiyatı
    """
    # Sadece admin kullanıcılar sinyal kapatabilir
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Bu işlem için yeterli yetkiniz yok"
        )
    
    closed_signal = signal_crud.close_signal(db, signal_id=signal_id, close_data=close_data)
    
    if not closed_signal:
        raise HTTPException(
            status_code=404,
            detail="Sinyal bulunamadı veya zaten kapatılmış"
        )
    
    return closed_signal


@router.delete("/{signal_id}", status_code=204, summary="Sinyali sil")
async def delete_signal(
    signal_id: int = Path(..., description="Sinyal ID", ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Sinyali siler.
    
    - **signal_id**: Silinecek sinyal ID
    """
    # Sadece admin kullanıcılar sinyal silebilir
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Bu işlem için yeterli yetkiniz yok"
        )
    
    deleted = signal_crud.delete_signal(db, signal_id=signal_id)
    
    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Sinyal bulunamadı"
        )
    
    return None 