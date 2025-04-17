from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import and_, or_, desc

from backend.app.models.signal import Signal
from backend.app.schemas.signal import SignalCreate, SignalUpdate, SignalType, SignalTimeframe, SignalConfidence


class SignalService:
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def create_signal(db: Session, signal_data: SignalCreate) -> Signal:
        """Yeni bir sinyal oluştur"""
        db_signal = Signal(
            symbol=signal_data.symbol,
            type=signal_data.type,
            timeframe=signal_data.timeframe,
            price=signal_data.price,
            take_profit=signal_data.take_profit,
            stop_loss=signal_data.stop_loss,
            confidence=signal_data.confidence,
            description=signal_data.description,
            active=True
        )
        db.add(db_signal)
        db.commit()
        db.refresh(db_signal)
        return db_signal

    @staticmethod
    def get_signal(db: Session, signal_id: int) -> Optional[Signal]:
        """ID'ye göre sinyal getir"""
        return db.query(Signal).filter(Signal.id == signal_id).first()

    @staticmethod
    def get_signals(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        symbol: Optional[str] = None,
        active: Optional[bool] = None,
        signal_type: Optional[SignalType] = None
    ) -> List[Signal]:
        """Sinyalleri filtrelerle getir"""
        query = db.query(Signal)
        
        # Filtreleri uygula
        if symbol:
            query = query.filter(Signal.symbol == symbol)
        if active is not None:
            query = query.filter(Signal.active == active)
        if signal_type:
            query = query.filter(Signal.type == signal_type)
            
        # Sıralama ve sayfalama
        return query.order_by(desc(Signal.created_at)).offset(skip).limit(limit).all()

    @staticmethod
    def update_signal(db: Session, signal_id: int, signal_data: SignalUpdate) -> Optional[Signal]:
        """Sinyali güncelle"""
        db_signal = SignalService.get_signal(db, signal_id)
        if not db_signal:
            return None
            
        # Güncelleme verilerini hazırla
        update_data = signal_data.dict(exclude_unset=True)
        
        # Sinyali güncelle
        for key, value in update_data.items():
            setattr(db_signal, key, value)
            
        db.commit()
        db.refresh(db_signal)
        return db_signal

    @staticmethod
    def delete_signal(db: Session, signal_id: int) -> bool:
        """Sinyali sil"""
        db_signal = SignalService.get_signal(db, signal_id)
        if not db_signal:
            return False
            
        db.delete(db_signal)
        db.commit()
        return True

    @staticmethod
    def close_signal(db: Session, signal_id: int, closed_price: float) -> Optional[Signal]:
        """Sinyali kapat ve kâr/zarar hesapla"""
        db_signal = SignalService.get_signal(db, signal_id)
        if not db_signal or not db_signal.active:
            return None
            
        # close metodunu çağır
        db_signal.close(closed_price)
        db.commit()
        db.refresh(db_signal)
        return db_signal

    @staticmethod
    def get_signal_statistics(db: Session) -> Dict[str, Any]:
        """Sinyallerle ilgili istatistikler getir"""
        # Toplam sinyal sayısı
        total_signals = db.query(Signal).count()
        
        # Aktif sinyal sayısı
        active_signals = db.query(Signal).filter(Signal.active == True).count()
        
        # Kapalı sinyal sayısı
        closed_signals = db.query(Signal).filter(Signal.active == False).count()
        
        # Kârlı sinyal sayısı
        profitable_signals = db.query(Signal).filter(
            and_(
                Signal.active == False,
                Signal.profit_loss > 0
            )
        ).count()
        
        # Zararlı sinyal sayısı
        losing_signals = db.query(Signal).filter(
            and_(
                Signal.active == False,
                Signal.profit_loss < 0
            )
        ).count()
        
        # Alış sinyali sayısı
        buy_signals = db.query(Signal).filter(Signal.type == SignalType.BUY).count()
        
        # Satış sinyali sayısı
        sell_signals = db.query(Signal).filter(Signal.type == SignalType.SELL).count()
        
        return {
            "total_signals": total_signals,
            "active_signals": active_signals,
            "closed_signals": closed_signals,
            "profitable_signals": profitable_signals,
            "losing_signals": losing_signals,
            "buy_signals": buy_signals,
            "sell_signals": sell_signals,
            "success_rate": profitable_signals / closed_signals if closed_signals > 0 else 0
        } 