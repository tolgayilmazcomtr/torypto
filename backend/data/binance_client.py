from typing import Dict, List, Optional, Any, Union
import logging
import time
from datetime import datetime

import pandas as pd
from binance.client import Client
from binance.exceptions import BinanceAPIException, BinanceRequestException

from app.core.config import settings

logger = logging.getLogger(__name__)

class BinanceClient:
    """Binance API ile etkileşim için istemci sınıfı"""
    
    def __init__(self, api_key: Optional[str] = None, api_secret: Optional[str] = None):
        """
        BinanceClient sınıfını başlatır.
        
        Args:
            api_key: Binance API anahtarı (opsiyonel)
            api_secret: Binance API gizli anahtarı (opsiyonel)
        """
        self.api_key = api_key
        self.api_secret = api_secret
        
        # API anahtarları varsa özel istemci, yoksa genel istemci oluştur
        if api_key and api_secret:
            self.client = Client(api_key, api_secret)
            self.has_private_access = True
        else:
            self.client = Client("", "")  # Genel API için boş anahtarlar yeterli
            self.has_private_access = False
        
        logger.info("Binance istemcisi başlatıldı. Özel erişim: %s", self.has_private_access)
    
    def get_exchange_info(self) -> Dict[str, Any]:
        """
        Borsa bilgilerini alır.
        
        Returns:
            Borsa bilgilerini içeren sözlük
        """
        try:
            return self.client.get_exchange_info()
        except (BinanceAPIException, BinanceRequestException) as e:
            logger.error("Borsa bilgileri alınamadı: %s", str(e))
            return {}
    
    def get_all_symbols(self) -> List[str]:
        """
        Tüm sembolleri listeler.
        
        Returns:
            Sembol listesi
        """
        try:
            info = self.client.get_exchange_info()
            return [s['symbol'] for s in info['symbols'] if s['status'] == 'TRADING']
        except (BinanceAPIException, BinanceRequestException) as e:
            logger.error("Semboller alınamadı: %s", str(e))
            return []
    
    def get_ticker_price(self, symbol: Optional[str] = None) -> Union[Dict[str, float], float]:
        """
        Belirtilen sembol(ler) için güncel fiyat(ları) alır.
        
        Args:
            symbol: Fiyatı alınacak sembol (belirtilmezse tüm fiyatlar alınır)
            
        Returns:
            Belirtilen sembol için fiyat veya tüm sembollerin fiyatlarını içeren sözlük
        """
        try:
            if symbol:
                return float(self.client.get_symbol_ticker(symbol=symbol)['price'])
            else:
                tickers = self.client.get_all_tickers()
                return {t['symbol']: float(t['price']) for t in tickers}
        except (BinanceAPIException, BinanceRequestException) as e:
            logger.error("Fiyat bilgisi alınamadı: %s", str(e))
            return {} if symbol is None else 0.0
    
    def get_klines(
        self, 
        symbol: str, 
        interval: str, 
        limit: int = 500, 
        start_time: Optional[int] = None, 
        end_time: Optional[int] = None
    ) -> pd.DataFrame:
        """
        Belirtilen sembol ve aralık için OHLCV verisi alır.
        
        Args:
            symbol: Veri alınacak sembol (örn. 'BTCUSDT')
            interval: Zaman aralığı (örn. '1m', '5m', '1h', '1d')
            limit: Alınacak veri sayısı (maksimum 1000)
            start_time: Başlangıç zamanı (milisaniye cinsinden Unix timestamp)
            end_time: Bitiş zamanı (milisaniye cinsinden Unix timestamp)
            
        Returns:
            OHLCV verilerini içeren DataFrame
        """
        try:
            klines = self.client.get_klines(
                symbol=symbol,
                interval=interval,
                limit=limit,
                startTime=start_time,
                endTime=end_time
            )
            
            # DataFrame'e dönüştür
            df = pd.DataFrame(klines, columns=[
                'timestamp', 'open', 'high', 'low', 'close', 'volume',
                'close_time', 'quote_asset_volume', 'number_of_trades',
                'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'ignore'
            ])
            
            # Veri tiplerini dönüştür
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            for col in ['open', 'high', 'low', 'close', 'volume', 'quote_asset_volume',
                        'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume']:
                df[col] = df[col].astype(float)
            
            # Gereksiz sütunları kaldır
            df = df.drop(['close_time', 'ignore'], axis=1)
            
            # timestamp'i indeks olarak ayarla
            df.set_index('timestamp', inplace=True)
            
            return df
        
        except (BinanceAPIException, BinanceRequestException) as e:
            logger.error("OHLCV verisi alınamadı: %s", str(e))
            return pd.DataFrame()
    
    def get_recent_trades(self, symbol: str, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Belirtilen sembol için son işlemleri alır.
        
        Args:
            symbol: İşlemleri alınacak sembol
            limit: Alınacak işlem sayısı (maksimum 1000)
            
        Returns:
            Son işlemleri içeren liste
        """
        try:
            return self.client.get_recent_trades(symbol=symbol, limit=limit)
        except (BinanceAPIException, BinanceRequestException) as e:
            logger.error("Son işlemler alınamadı: %s", str(e))
            return []
    
    def get_top_symbols_by_volume(self, quote_asset: str = 'USDT', limit: int = 10) -> List[Dict[str, Any]]:
        """
        Belirtilen temel para birimi için en yüksek hacimli sembolleri döndürür.
        
        Args:
            quote_asset: Temel para birimi (örn. 'USDT', 'BTC')
            limit: Döndürülecek sembol sayısı
            
        Returns:
            Hacme göre sıralanmış sembollerin listesi
        """
        try:
            # 24 saatlik istatistikleri al
            tickers = self.client.get_ticker()
            
            # Belirtilen temel para birimini içeren sembolleri filtrele
            filtered_tickers = [t for t in tickers if t['symbol'].endswith(quote_asset)]
            
            # Hacme göre sırala
            sorted_tickers = sorted(
                filtered_tickers, 
                key=lambda x: float(x['quoteVolume']), 
                reverse=True
            )
            
            # Belirtilen sayıda sembolü döndür
            return sorted_tickers[:limit]
        
        except (BinanceAPIException, BinanceRequestException) as e:
            logger.error("Hacim sıralaması alınamadı: %s", str(e))
            return []

# Singleton instance
binance_client = BinanceClient() 