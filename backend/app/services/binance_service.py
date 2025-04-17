import httpx
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import os
import asyncio
from datetime import datetime

class BinanceService:
    """
    Binance API ile etkileşim için servis sınıfı.
    Kripto para fiyat verileri ve işlem bilgilerini çeker.
    """
    
    def __init__(self):
        self.base_url = "https://api.binance.com"
        self.api_key = os.getenv("BINANCE_API_KEY", "")
        self.api_secret = os.getenv("BINANCE_API_SECRET", "")
        self.timeout = 30.0
    
    async def get_klines(self, symbol: str, interval: str, limit: int = 100) -> pd.DataFrame:
        """
        Belirli bir sembol için mum verilerini (OHLCV) çeker ve DataFrame olarak döndürür.
        
        Args:
            symbol: Kripto para sembolü (örn. "BTCUSDT")
            interval: Mum aralığı ("1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M")
            limit: Kaç tane mum verisi getirileceği (max 1000)
            
        Returns:
            pandas DataFrame ile OHLCV verileri
        """
        endpoint = f"/api/v3/klines"
        params = {
            "symbol": symbol.upper(),
            "interval": interval,
            "limit": min(limit, 1000)  # Binance maksimum 1000 kayıt döndürür
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}{endpoint}", params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Binance verileri liste olarak döndürür, DataFrame'e dönüştürüyoruz
            df = pd.DataFrame(data, columns=[
                "timestamp", "open", "high", "low", "close", "volume",
                "close_time", "quote_asset_volume", "number_of_trades",
                "taker_buy_base_asset_volume", "taker_buy_quote_asset_volume", "ignore"
            ])
            
            # Veri tiplerini düzelt
            numeric_columns = ["open", "high", "low", "close", "volume", 
                              "quote_asset_volume", "taker_buy_base_asset_volume", 
                              "taker_buy_quote_asset_volume"]
            for col in numeric_columns:
                df[col] = pd.to_numeric(df[col])
            
            # Zaman damgasını datetime'a dönüştür
            df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
            df.set_index("timestamp", inplace=True)
            
            return df
    
    async def get_ticker(self, symbol: str) -> Dict[str, Any]:
        """
        Belirli bir sembolün 24 saatlik fiyat değişim bilgilerini çeker.
        
        Args:
            symbol: Kripto para sembolü (örn. "BTCUSDT")
            
        Returns:
            24 saatlik ticker bilgileri
        """
        endpoint = "/api/v3/ticker/24hr"
        params = {"symbol": symbol.upper()}
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
    
    async def get_24h_ticker(self) -> List[Dict[str, Any]]:
        """
        Tüm semboller için 24 saatlik fiyat değişim bilgilerini döndürür.
        
        Returns:
            Tüm sembollerin 24 saatlik ticker bilgileri
        """
        endpoint = "/api/v3/ticker/24hr"
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}{endpoint}")
            response.raise_for_status()
            
            # Sadece USDT çiftlerini filtrele
            all_tickers = response.json()
            usdt_pairs = [ticker for ticker in all_tickers if ticker['symbol'].endswith('USDT')]
            
            return usdt_pairs
    
    async def get_all_prices(self) -> List[Dict[str, Any]]:
        """
        Tüm kripto para çiftlerinin güncel fiyatlarını döndürür.
        
        Returns:
            Tüm sembollerin güncel fiyatları
        """
        endpoint = "/api/v3/ticker/price"
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}{endpoint}")
            response.raise_for_status()
            
            # Sadece USDT çiftlerini filtrele
            all_prices = response.json()
            usdt_pairs = [price for price in all_prices if price['symbol'].endswith('USDT')]
            
            return usdt_pairs
    
    async def get_exchange_info(self) -> Dict[str, Any]:
        """
        Borsa bilgilerini ve sembol kısıtlamalarını döndürür.
        
        Returns:
            Borsa kuralları ve sembol bilgileri
        """
        endpoint = "/api/v3/exchangeInfo"
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}{endpoint}")
            response.raise_for_status()
            return response.json()
            
    async def get_symbols_info(self) -> List[Dict[str, Any]]:
        """
        USDT çiftleri hakkında filtrelenmiş bilgi döndürür.
        
        Returns:
            USDT çiftlerinin özet bilgisi
        """
        exchange_info = await self.get_exchange_info()
        
        # USDT çiftlerini filtrele
        usdt_symbols = [
            {
                "symbol": symbol["symbol"],
                "baseAsset": symbol["baseAsset"],
                "quoteAsset": symbol["quoteAsset"],
                "status": symbol["status"]
            }
            for symbol in exchange_info["symbols"]
            if symbol["quoteAsset"] == "USDT" and symbol["status"] == "TRADING"
        ]
        
        return usdt_symbols
        
    async def get_price(self, symbol: str) -> float:
        """
        Belirli bir sembol için güncel fiyatı alır
        
        Args:
            symbol: Kripto para sembolü (örn. "BTCUSDT")
            
        Returns:
            Güncel fiyat (float)
        """
        endpoint = "/api/v3/ticker/price"
        params = {"symbol": symbol.upper()}
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(f"{self.base_url}{endpoint}", params=params)
            response.raise_for_status()
            data = response.json()
            return float(data["price"])
            
    async def get_all_symbols(self) -> List[str]:
        """
        Tüm sembol adlarını liste olarak döndürür
        
        Returns:
            Sembol listesi (str)
        """
        exchange_info = await self.get_exchange_info()
        symbols = [symbol["symbol"] for symbol in exchange_info["symbols"]]
        return symbols 