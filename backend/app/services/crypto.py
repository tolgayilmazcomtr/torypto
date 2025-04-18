from sqlalchemy.orm import Session
from ..models.crypto import Symbol
from ..schemas.crypto import Symbol as SymbolSchema
import httpx
import asyncio
from typing import List, Dict, Any
import os
from sqlalchemy.exc import IntegrityError

class SymbolService:
    def __init__(self, db: Session):
        self.db = db
        self.base_url = "https://api.binance.com"
        self.icon_base_url = "https://cryptoicons.org/api/icon"

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
    
    async def fetch_binance_symbols(self) -> List[Dict[str, Any]]:
        """
        Binance'den tüm kripto sembolleri hakkında bilgi çeker
        """
        async with httpx.AsyncClient() as client:
            try:
                # Binance exchange info endpoint'inden sembol bilgilerini çek
                response = await client.get(f"{self.base_url}/api/v3/exchangeInfo")
                response.raise_for_status()
                data = response.json()
                
                # Sadece USDT çiftlerini filtrele ve aktif olanları al
                usdt_symbols = [
                    {
                        "symbol": symbol["symbol"],
                        "baseAsset": symbol["baseAsset"],
                        "quoteAsset": symbol["quoteAsset"],
                        "status": symbol["status"]
                    }
                    for symbol in data["symbols"]
                    if symbol["quoteAsset"] == "USDT" and symbol["status"] == "TRADING"
                ]
                
                return usdt_symbols
            except Exception as e:
                print(f"Binance'den sembol bilgileri alınırken hata: {str(e)}")
                return []
    
    async def fetch_binance_prices(self) -> Dict[str, float]:
        """
        Binance'den tüm kripto sembollerin fiyatlarını çeker
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.base_url}/api/v3/ticker/price")
                response.raise_for_status()
                data = response.json()
                
                # USDT çiftlerini filtrele ve fiyatları al
                price_dict = {
                    item["symbol"]: float(item["price"])
                    for item in data
                    if item["symbol"].endswith("USDT")
                }
                
                return price_dict
            except Exception as e:
                print(f"Binance'den fiyat bilgileri alınırken hata: {str(e)}")
                return {}
    
    async def fetch_binance_24h_stats(self) -> Dict[str, Dict[str, Any]]:
        """
        Binance'den 24 saatlik istatistikleri çeker
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.base_url}/api/v3/ticker/24hr")
                response.raise_for_status()
                data = response.json()
                
                # USDT çiftlerini filtrele ve istatistikleri al
                stats_dict = {
                    item["symbol"]: {
                        "price_change": float(item["priceChange"]),
                        "price_change_percent": float(item["priceChangePercent"]),
                        "volume": float(item["volume"]),
                        "high_price": float(item["highPrice"]),
                        "low_price": float(item["lowPrice"])
                    }
                    for item in data
                    if item["symbol"].endswith("USDT")
                }
                
                return stats_dict
            except Exception as e:
                print(f"Binance'den 24 saatlik istatistikler alınırken hata: {str(e)}")
                return {}
    
    def get_crypto_icon_url(self, base_asset: str) -> str:
        """
        Kripto para birimi için icon URL'si oluşturur
        """
        # CryptoIcons API veya alternatif kaynaklar kullanılabilir
        # Örnek: Bitcoin için https://cryptoicons.org/api/icon/btc/200
        return f"{self.icon_base_url}/{base_asset.lower()}/64"
    
    async def sync_binance_symbols_to_db(self):
        """
        Binance'den sembol bilgilerini çeker ve veritabanını günceller
        """
        # Binance'den sembol bilgilerini al
        symbols = await self.fetch_binance_symbols()
        prices = await self.fetch_binance_prices()
        stats = await self.fetch_binance_24h_stats()
        
        updated_count = 0
        created_count = 0
        errors = 0
        
        for symbol_data in symbols:
            symbol_name = symbol_data["symbol"]
            base_asset = symbol_data["baseAsset"]
            
            # Sembol için fiyat ve 24 saatlik istatistikleri al
            price = prices.get(symbol_name, 0)
            symbol_stats = stats.get(symbol_name, {})
            
            # Icon URL oluştur
            icon_url = self.get_crypto_icon_url(base_asset)
            
            try:
                # Veritabanında sembolü ara
                existing_symbol = self.get_symbol(symbol_name)
                
                if existing_symbol:
                    # Mevcut sembolü güncelle
                    existing_symbol.base_asset = base_asset
                    existing_symbol.quote_asset = symbol_data["quoteAsset"]
                    existing_symbol.status = symbol_data["status"]
                    existing_symbol.price = price
                    existing_symbol.icon_url = icon_url
                    
                    # 24 saatlik istatistikleri ekle
                    if symbol_stats:
                        existing_symbol.price_change = symbol_stats.get("price_change", 0)
                        existing_symbol.price_change_percent = symbol_stats.get("price_change_percent", 0)
                        existing_symbol.volume = symbol_stats.get("volume", 0)
                        existing_symbol.high_price = symbol_stats.get("high_price", 0)
                        existing_symbol.low_price = symbol_stats.get("low_price", 0)
                    
                    self.db.commit()
                    self.db.refresh(existing_symbol)
                    updated_count += 1
                else:
                    # Yeni sembol oluştur
                    new_symbol = Symbol(
                        symbol=symbol_name,
                        base_asset=base_asset,
                        quote_asset=symbol_data["quoteAsset"],
                        status=symbol_data["status"],
                        price=price,
                        icon_url=icon_url,
                        price_change=symbol_stats.get("price_change", 0),
                        price_change_percent=symbol_stats.get("price_change_percent", 0),
                        volume=symbol_stats.get("volume", 0),
                        high_price=symbol_stats.get("high_price", 0),
                        low_price=symbol_stats.get("low_price", 0)
                    )
                    self.db.add(new_symbol)
                    self.db.commit()
                    self.db.refresh(new_symbol)
                    created_count += 1
            except IntegrityError as e:
                self.db.rollback()
                print(f"Veritabanı bütünlük hatası: {str(e)}")
                errors += 1
            except Exception as e:
                self.db.rollback()
                print(f"Sembol kaydedilirken hata oluştu ({symbol_name}): {str(e)}")
                errors += 1
        
        return {
            "total": len(symbols),
            "created": created_count,
            "updated": updated_count,
            "errors": errors
        } 