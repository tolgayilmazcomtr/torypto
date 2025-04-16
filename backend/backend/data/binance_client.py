import aiohttp
import requests
import logging
import time
from typing import Dict, List, Optional, Any, Union
from urllib.parse import urlencode
import hmac
import hashlib
import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Logger
logger = logging.getLogger("torypto")

class BinanceClient:
    """
    Binance API istemcisi
    """
    
    BASE_URL = "https://api.binance.com"
    
    def __init__(self):
        """
        API anahtarlarını çevre değişkenlerinden yükle
        """
        self.api_key = os.getenv("BINANCE_API_KEY", "")
        self.api_secret = os.getenv("BINANCE_API_SECRET", "")
        self.session = None
        
        # API anahtarları mevcut mu kontrol et
        if not self.api_key or not self.api_secret:
            logger.warning("Binance API anahtarları bulunamadı. Yalnızca genel API endpointleri çalışacak.")
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
            
    def _get_headers(self) -> Dict[str, str]:
        """
        İstek başlıklarını oluştur
        """
        headers = {
            "Accept": "application/json",
            "User-Agent": "Torypto/1.0"
        }
        
        if self.api_key:
            headers["X-MBX-APIKEY"] = self.api_key
            
        return headers
    
    def _generate_signature(self, params: Dict[str, Any]) -> str:
        """
        İmzalı istekler için HMAC SHA256 imzası oluştur
        """
        query_string = urlencode(params)
        signature = hmac.new(
            self.api_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    async def _handle_response(self, response: aiohttp.ClientResponse) -> Any:
        """
        API yanıtını işle
        """
        if response.status == 200:
            return await response.json()
        else:
            try:
                error_data = await response.json()
            except:
                error_data = {"code": response.status, "msg": response.reason}
            error_msg = f"Binance API hatası: {error_data.get('code', 'Bilinmeyen')} - {error_data.get('msg', 'Bilinmeyen hata')}"
            logger.error(error_msg)
            raise Exception(error_msg)
    
    async def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None, signed: bool = False) -> Any:
        """
        GET isteği gönder
        """
        if params is None:
            params = {}
            
        url = f"{self.BASE_URL}{endpoint}"
        
        if signed:
            if not self.api_key or not self.api_secret:
                raise Exception("İmzalı istek için API anahtarları gerekli")
            
            # Zaman damgası ekle
            params['timestamp'] = int(time.time() * 1000)
            
            # İmza oluştur ve ekle
            params['signature'] = self._generate_signature(params)
        
        if not self.session:
            self.session = aiohttp.ClientSession()
            
        try:
            async with self.session.get(url, params=params, headers=self._get_headers()) as response:
                return await self._handle_response(response)
        except Exception as e:
            logger.error(f"Binance API isteği başarısız: {str(e)}")
            raise Exception(f"Binance API isteği başarısız: {str(e)}")
    
    def _post(self, endpoint: str, params: Optional[Dict[str, Any]] = None, signed: bool = False) -> Any:
        """
        POST isteği gönder
        """
        if params is None:
            params = {}
            
        url = f"{self.BASE_URL}{endpoint}"
        
        if signed:
            if not self.api_key or not self.api_secret:
                raise Exception("İmzalı istek için API anahtarları gerekli")
            
            # Zaman damgası ekle
            params['timestamp'] = int(time.time() * 1000)
            
            # İmza oluştur ve ekle
            params['signature'] = self._generate_signature(params)
        
        try:
            response = requests.post(
                url,
                params=params,
                headers=self._get_headers(),
                timeout=30
            )
            
            return self._handle_response(response)
        except requests.RequestException as e:
            logger.error(f"Binance API isteği başarısız: {str(e)}")
            raise Exception(f"Binance API isteği başarısız: {str(e)}")
    
    def _delete(self, endpoint: str, params: Optional[Dict[str, Any]] = None, signed: bool = False) -> Any:
        """
        DELETE isteği gönder
        """
        if params is None:
            params = {}
            
        url = f"{self.BASE_URL}{endpoint}"
        
        if signed:
            if not self.api_key or not self.api_secret:
                raise Exception("İmzalı istek için API anahtarları gerekli")
            
            # Zaman damgası ekle
            params['timestamp'] = int(time.time() * 1000)
            
            # İmza oluştur ve ekle
            params['signature'] = self._generate_signature(params)
        
        try:
            response = requests.delete(
                url,
                params=params,
                headers=self._get_headers(),
                timeout=30
            )
            
            return self._handle_response(response)
        except requests.RequestException as e:
            logger.error(f"Binance API isteği başarısız: {str(e)}")
            raise Exception(f"Binance API isteği başarısız: {str(e)}")
    
    # ----- Genel endpointler -----
    
    async def get_exchange_info(self) -> Dict[str, Any]:
        """
        Borsa bilgisini al
        """
        return await self._get("/api/v3/exchangeInfo")
    
    async def get_symbols(self) -> List[str]:
        """
        Tüm sembolleri al
        """
        exchange_info = await self.get_exchange_info()
        return [symbol["symbol"] for symbol in exchange_info.get("symbols", [])]
    
    async def get_ticker_price(self, symbol: Optional[str] = None) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
        """
        Anlık fiyat bilgisini al
        """
        params = {}
        if symbol:
            params["symbol"] = symbol
            
        return await self._get("/api/v3/ticker/price", params)
    
    async def get_ticker_prices(self, symbols: Optional[List[str]] = None) -> Dict[str, float]:
        """
        Birden fazla sembol için anlık fiyat bilgilerini al
        
        Args:
            symbols: Fiyat bilgisi alınacak sembollerin listesi. None ise tüm sembollerin fiyatları alınır.
            
        Returns:
            Dict[str, float]: Sembol-fiyat çiftlerini içeren sözlük
        """
        response = await self.get_ticker_price()
        
        # Response'u dict'e çevir
        if isinstance(response, dict):
            prices = {response["symbol"]: float(response["price"])}
        else:
            prices = {item["symbol"]: float(item["price"]) for item in response}
        
        # Eğer belirli semboller istendiyse, sadece onları döndür
        if symbols:
            return {symbol: prices[symbol] for symbol in symbols if symbol in prices}
        
        return prices
    
    async def get_klines(
        self,
        symbol: str,
        interval: str,
        limit: int = 500,
        start_time: Optional[int] = None,
        end_time: Optional[int] = None
    ) -> List[List[Any]]:
        """
        Kline/Candlestick verilerini al
        """
        params = {
            "symbol": symbol,
            "interval": interval,
            "limit": limit
        }
        
        if start_time:
            params["startTime"] = start_time
            
        if end_time:
            params["endTime"] = end_time
            
        return await self._get("/api/v3/klines", params)
    
    # ----- Hesap endpointleri (imzalı) -----
    
    def get_account(self) -> Dict[str, Any]:
        """
        Hesap bilgilerini al (imzalı)
        """
        return self._get("/api/v3/account", signed=True)
    
    def get_open_orders(self, symbol: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Açık emirleri al (imzalı)
        """
        params = {}
        if symbol:
            params["symbol"] = symbol
            
        return self._get("/api/v3/openOrders", params, signed=True)
        
    def create_order(
        self,
        symbol: str,
        side: str,  # "BUY" veya "SELL"
        order_type: str,  # "LIMIT", "MARKET", vb.
        quantity: float,
        price: Optional[float] = None,
        time_in_force: Optional[str] = "GTC",  # "GTC", "IOC", "FOK"
        **kwargs
    ) -> Dict[str, Any]:
        """
        Yeni emir oluştur (imzalı)
        """
        params = {
            "symbol": symbol,
            "side": side,
            "type": order_type,
            "quantity": quantity,
        }
        
        if order_type == "LIMIT":
            if not price:
                raise ValueError("LIMIT emirleri için fiyat gerekli")
            params["price"] = price
            params["timeInForce"] = time_in_force
            
        # Ek parametreleri ekle
        params.update(kwargs)
        
        return self._post("/api/v3/order", params, signed=True)
    
    def cancel_order(self, symbol: str, order_id: Optional[int] = None, orig_client_order_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Emir iptal et (imzalı)
        """
        params = {
            "symbol": symbol
        }
        
        if order_id:
            params["orderId"] = order_id
        elif orig_client_order_id:
            params["origClientOrderId"] = orig_client_order_id
        else:
            raise ValueError("order_id veya orig_client_order_id gerekli")
            
        return self._delete("/api/v3/order", params, signed=True) 