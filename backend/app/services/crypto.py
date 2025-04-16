from sqlalchemy.orm import Session
from ..models.crypto import Symbol
from ..schemas.crypto import Symbol as SymbolSchema

class SymbolService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_symbols(self):
        return self.db.query(Symbol).all()

    def get_symbol(self, symbol: str):
        return self.db.query(Symbol).filter(Symbol.symbol == symbol).first()

    def create_symbol(self, symbol_data: SymbolSchema):
        db_symbol = Symbol(**symbol_data.model_dump())
        self.db.add(db_symbol)
        self.db.commit()
        self.db.refresh(db_symbol)
        return db_symbol

    def update_symbol(self, symbol: str, symbol_data: SymbolSchema):
        db_symbol = self.get_symbol(symbol)
        if db_symbol:
            for key, value in symbol_data.model_dump(exclude_unset=True).items():
                setattr(db_symbol, key, value)
            self.db.commit()
            self.db.refresh(db_symbol)
        return db_symbol

    def delete_symbol(self, symbol: str):
        db_symbol = self.get_symbol(symbol)
        if db_symbol:
            self.db.delete(db_symbol)
            self.db.commit()
        return db_symbol

    def bulk_create_or_update_symbols(self, symbols_data: list[SymbolSchema]):
        for symbol_data in symbols_data:
            existing_symbol = self.get_symbol(symbol_data.symbol)
            if existing_symbol:
                self.update_symbol(symbol_data.symbol, symbol_data)
            else:
                self.create_symbol(symbol_data)
        return self.get_all_symbols() 