from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, Query
from typing import List, Optional, Dict, Any
from ..data.binance_client import BinanceClient
from ..schemas.crypto import SymbolPrice, KlineData
from datetime import datetime
import logging
import json

from ..dependencies import get_binance_client

router = APIRouter(
    prefix="/crypto",
    tags=["Kripto"],
    responses={404: {"description": "Not found"}},
)

# Singleton olarak bir istemci oluştur
binance_client = BinanceClient()
logger = logging.getLogger(__name__)

# WebSocket bağlantı yönetimi için aktif bağlantıları izle
active_connections: Dict[str, List[WebSocket]] = {}

@router.get("/price/{symbol}", response_model=SymbolPrice)
async def get_symbol_price(symbol: str, client: BinanceClient = Depends(get_binance_client)):
    """
    Belirli bir kripto para çiftinin anlık fiyatını getirir.
    Örnek: /crypto/price/BTCUSDT
    """
    try:
        response = await client.get_ticker_price(symbol.upper())
        if isinstance(response, dict):  # Tek bir sembol için yanıt
            return {"symbol": response["symbol"], "price": float(response["price"])}
        else:  # Liste yanıtı - ilk elemanı al
            for item in response:
                if item["symbol"].upper() == symbol.upper():
                    return {"symbol": item["symbol"], "price": float(item["price"])}
            raise HTTPException(status_code=404, detail=f"Sembol bulunamadı: {symbol}")
    except Exception as e:
        logger.error(f"Fiyat alınırken hata: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/prices", response_model=List[SymbolPrice])
async def get_all_prices(
    symbols: Optional[str] = Query(None, description="Virgülle ayrılmış sembol listesi (örn: BTCUSDT,ETHUSDT)"),
    client: BinanceClient = Depends(get_binance_client)
):
    """
    Birden fazla kripto para çiftinin fiyatını getirir.
    Örnek: /crypto/prices?symbols=BTCUSDT,ETHUSDT,BNBUSDT
    """
    try:
        if symbols:
            # Belirli sembolleri al
            symbol_list = [s.strip().upper() for s in symbols.split(",")]
            
            # Tüm fiyatları bir kez al
            all_prices = await client.get_ticker_price()
            
            # Listeyi dönüştür
            if isinstance(all_prices, list):
                # Eşleşen sembolleri filtrele
                return [
                    {"symbol": item["symbol"], "price": float(item["price"])}
                    for item in all_prices
                    if item["symbol"] in symbol_list
                ]
            else:
                # Tek bir sembol için yanıt
                return [{"symbol": all_prices["symbol"], "price": float(all_prices["price"])}]
        else:
            # Tüm fiyatları al
            all_prices = await client.get_ticker_price()
            
            # Listeyi dönüştür
            if isinstance(all_prices, list):
                return [{"symbol": item["symbol"], "price": float(item["price"])} for item in all_prices]
            else:
                # Tek bir sembol için yanıt - bu durumla karşılaşılmamalı ama güvenlik için
                return [{"symbol": all_prices["symbol"], "price": float(all_prices["price"])}]
    except Exception as e:
        logger.error(f"Fiyatlar alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Fiyatlar alınırken hata: {str(e)}")

@router.get("/klines/{symbol}", response_model=List[KlineData])
async def get_symbol_klines(
    symbol: str,
    interval: str = "1h",
    limit: int = 100,
    client: BinanceClient = Depends(get_binance_client)
):
    """
    Belirli bir kripto para çifti için Kline/Candlestick verilerini getirir.
    Örnek: /crypto/klines/BTCUSDT?interval=1h&limit=100
    
    Geçerli aralıklar: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
    """
    try:
        klines = await client.get_klines(
            symbol.upper(),
            interval=interval,
            limit=limit
        )
        
        # Binance'den gelen veriyi KlineData formatına dönüştür
        formatted_klines = []
        for kline in klines:
            formatted_klines.append({
                "open_time": datetime.fromtimestamp(kline[0] / 1000),  # Binance milisaniye cinsinden timestamp döndürür
                "open": float(kline[1]),
                "high": float(kline[2]),
                "low": float(kline[3]),
                "close": float(kline[4]),
                "volume": float(kline[5]),
                "close_time": datetime.fromtimestamp(kline[6] / 1000),
                "quote_volume": float(kline[7]),
                "trades": int(kline[8]),
                "taker_buy_base": float(kline[9]),
                "taker_buy_quote": float(kline[10])
            })
            
        return formatted_klines
    except Exception as e:
        logger.error(f"Kline verisi alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sunucu hatası: {str(e)}")

@router.websocket("/ws/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    """
    Belirtilen sembol için gerçek zamanlı fiyat akışı sağlar
    
    - symbol: Sembol adı (örn. BTCUSDT)
    """
    await websocket.accept()
    
    # Sembol adını küçük harfe çevir (WebSocket stream adı için gerekli)
    stream_name = symbol.lower() + "@ticker"
    
    # İlgili sembol için aktif bağlantı listesini oluştur veya ekle
    if stream_name not in active_connections:
        active_connections[stream_name] = []
    active_connections[stream_name].append(websocket)
    
    # Bağlanan istemci sayısını güncelle
    connection_count = len(active_connections[stream_name])
    logger.info(f"{stream_name} için yeni WebSocket bağlantısı. Toplam: {connection_count}")
    
    try:
        # Binance client'ı al
        client = get_binance_client()
        
        # WebSocket callback fonksiyonu - gelen verileri tüm aktif bağlantılara ilet
        async def message_handler(data: str):
            # Stream'deki tüm bağlantılara veriyi ilet
            disconnected = []
            for conn in active_connections[stream_name]:
                try:
                    await conn.send_text(data)
                except Exception:
                    # Bağlantı kopmuşsa, listeden çıkar
                    disconnected.append(conn)
            
            # Kopan bağlantıları listeden çıkar
            for conn in disconnected:
                if conn in active_connections[stream_name]:
                    active_connections[stream_name].remove(conn)
        
        # İlk bağlantı ise, WebSocket stream'ini başlat
        if connection_count == 1:
            await client.connect_websocket(stream_name, message_handler)
        
        # İstemci bağlantısı kopana kadar bekle
        while True:
            try:
                data = await websocket.receive_text()
                logger.debug(f"İstemciden alınan veri: {data}")
            except WebSocketDisconnect:
                # Bağlantı koptuğunda WebSocket listesinden çıkar
                if websocket in active_connections[stream_name]:
                    active_connections[stream_name].remove(websocket)
                
                # Eğer sembol için bağlantı kalmadıysa, WebSocket stream'ini kapat
                if not active_connections[stream_name]:
                    await client.disconnect_websocket(stream_name)
                    active_connections.pop(stream_name, None)
                
                conn_count = len(active_connections.get(stream_name, []))
                logger.info(f"{stream_name} için WebSocket bağlantısı kapatıldı. Kalan: {conn_count}")
                break
    
    except Exception as e:
        logger.error(f"WebSocket hatası ({stream_name}): {e}")
        # Hata durumunda istemciye bilgi gönder
        await websocket.send_text(json.dumps({"error": str(e)}))
        
        # Bağlantıyı kapat
        await websocket.close()
        
        # WebSocket listesinden çıkar
        if websocket in active_connections.get(stream_name, []):
            active_connections[stream_name].remove(websocket)
            
        # Eğer sembol için bağlantı kalmadıysa, WebSocket stream'ini kapat
        if stream_name in active_connections and not active_connections[stream_name]:
            client = get_binance_client()
            await client.disconnect_websocket(stream_name)
            active_connections.pop(stream_name, None) 