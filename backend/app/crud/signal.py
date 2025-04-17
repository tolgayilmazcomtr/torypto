from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc, func

from backend.app.models.signal import Signal, SignalType, SignalTimeframe
from backend.app.schemas.signal import SignalCreate, SignalUpdate, SignalFilters, SignalClose


def create_signal(db: Session, signal: SignalCreate) -> Signal:
    """Yeni bir sinyal oluştur"""
    db_signal = Signal(
        symbol=signal.symbol,
        type=signal.type,
        timeframe=signal.timeframe,
        price=signal.price,
        take_profit=signal.take_profit,
        stop_loss=signal.stop_loss,
        confidence=signal.confidence,
        description=signal.description,
        active=True,
        created_at=datetime.utcnow()
    )
    db.add(db_signal)
    db.commit()
    db.refresh(db_signal)
    return db_signal


def get_signal(db: Session, signal_id: int) -> Optional[Signal]:
    """ID'ye göre sinyal getir"""
    return db.query(Signal).filter(Signal.id == signal_id).first()


def get_signals(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    filters: Optional[SignalFilters] = None
) -> List[Signal]:
    """Sinyalleri filtrelerle getir"""
    query = db.query(Signal)
    
    if filters:
        if filters.symbol:
            query = query.filter(Signal.symbol == filters.symbol)
        
        if filters.type:
            query = query.filter(Signal.type == filters.type)
            
        if filters.timeframe:
            query = query.filter(Signal.timeframe == filters.timeframe)
            
        if filters.active_only:
            query = query.filter(Signal.active == True)
            
        if filters.min_confidence is not None:
            query = query.filter(Signal.confidence >= filters.min_confidence)
            
        if filters.date_from:
            query = query.filter(Signal.created_at >= filters.date_from)
            
        if filters.date_to:
            query = query.filter(Signal.created_at <= filters.date_to)
    
    # En yeni sinyaller önce
    query = query.order_by(desc(Signal.created_at))
    
    return query.offset(skip).limit(limit).all()


def get_active_signals(db: Session, skip: int = 0, limit: int = 100) -> List[Signal]:
    """Aktif sinyalleri getir"""
    return db.query(Signal).filter(Signal.active == True).order_by(
        desc(Signal.created_at)
    ).offset(skip).limit(limit).all()


def update_signal(db: Session, signal_id: int, signal_data: SignalUpdate) -> Optional[Signal]:
    """Sinyali güncelle"""
    db_signal = get_signal(db, signal_id)
    if not db_signal:
        return None
        
    signal_data_dict = signal_data.dict(exclude_unset=True)
    
    # Manuel olarak updated_at'i güncelle
    signal_data_dict["updated_at"] = datetime.utcnow()
    
    for key, value in signal_data_dict.items():
        setattr(db_signal, key, value)
        
    db.commit()
    db.refresh(db_signal)
    return db_signal


def close_signal(db: Session, signal_id: int, close_data: SignalClose) -> Optional[Signal]:
    """Sinyali kapat ve PNL hesapla"""
    db_signal = get_signal(db, signal_id)
    if not db_signal:
        return None
    
    if not db_signal.active:
        return None  # Zaten kapalı sinyal
    
    # close() metodu sinyali kapatır ve PNL hesaplar
    db_signal.close(close_data.closed_price)
    
    db.commit()
    db.refresh(db_signal)
    return db_signal


def delete_signal(db: Session, signal_id: int) -> bool:
    """Sinyali sil"""
    db_signal = get_signal(db, signal_id)
    if not db_signal:
        return False
        
    db.delete(db_signal)
    db.commit()
    return True


def get_signal_statistics(db: Session) -> Dict[str, Any]:
    """Sinyal istatistiklerini hesapla"""
    
    # Toplam sinyal sayısı
    total_signals = db.query(func.count(Signal.id)).scalar()
    
    # Aktif sinyal sayısı
    active_signals = db.query(func.count(Signal.id)).filter(Signal.active == True).scalar()
    
    # Kapalı sinyal sayısı
    closed_signals = db.query(func.count(Signal.id)).filter(Signal.active == False).scalar()
    
    # Kârlı sinyal sayısı (kapalı sinyaller arasında)
    profitable_signals = db.query(func.count(Signal.id)).filter(
        Signal.active == False,
        Signal.profit_loss_percentage > 0
    ).scalar()
    
    # Zararlı sinyal sayısı (kapalı sinyaller arasında)
    losing_signals = db.query(func.count(Signal.id)).filter(
        Signal.active == False,
        Signal.profit_loss_percentage <= 0
    ).scalar()
    
    # Ortalama kâr yüzdesi
    avg_profit = db.query(func.avg(Signal.profit_loss_percentage)).filter(
        Signal.active == False,
        Signal.profit_loss_percentage > 0
    ).scalar() or 0.0
    
    # Ortalama zarar yüzdesi
    avg_loss = db.query(func.avg(Signal.profit_loss_percentage)).filter(
        Signal.active == False,
        Signal.profit_loss_percentage <= 0
    ).scalar() or 0.0
    
    # Tüm sembolleri getir
    symbols = [s[0] for s in db.query(Signal.symbol).distinct().all()]
    
    # Tüm timeframe'leri getir
    timeframes = [
        t[0] for t in db.query(Signal.timeframe).distinct().all()
    ]
    
    return {
        "total_signals": total_signals or 0,
        "active_signals": active_signals or 0,
        "closed_signals": closed_signals or 0,
        "profitable_signals": profitable_signals or 0,
        "losing_signals": losing_signals or 0,
        "average_profit_percentage": avg_profit,
        "average_loss_percentage": avg_loss,
        "success_rate": (profitable_signals / closed_signals * 100) if closed_signals > 0 else 0,
        "symbols": symbols,
        "timeframes": timeframes
    } 