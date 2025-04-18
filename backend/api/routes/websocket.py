from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.responses import JSONResponse
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
import pandas as pd

from data.binance_client import binance_client
from utils.technical_indicators import TechnicalIndicators

# Logger
logger = logging.getLogger("torypto")

router = APIRouter(
    prefix="/ws",
    tags=["WebSocket"],
)

# Aktif bağlantıları tutan değişkenler
connected_price_clients: Dict[str, List[WebSocket]] = {}  # symbol -> [websocket, websocket]
connected_indicator_clients: Dict[str, List[WebSocket]] = {}  # symbol_interval -> [websocket, websocket]

@router.websocket("/price/{symbol}")
async def websocket_price_endpoint(websocket: WebSocket, symbol: str):
    """
    Belirli bir sembol için gerçek zamanlı fiyat güncellemeleri sağlar.
    WebSocket bağlantısı kurulduğunda, sembol için Binance WebSocket akışına abone olur
    ve fiyat güncellemelerini istemciye iletir.
    
    Örnek bağlantı URL'i: ws://localhost:8002/ws/price/btcusdt
    """
    await websocket.accept()
    
    # Sembolü küçük harfe çevir
    symbol = symbol.lower()
    stream_name = f"{symbol}@ticker"
    
    # Bağlantıyı kaydet
    if symbol not in connected_price_clients:
        connected_price_clients[symbol] = []
    connected_price_clients[symbol].append(websocket)
    
    # Callback fonksiyonu
    async def on_message(message):
        data = json.loads(message)
        # Tüm bağlı istemcilere gönder
        for client in connected_price_clients.get(symbol, []):
            if client.client_state.CONNECTED:  # Sadece aktif bağlantılara gönder
                try:
                    await client.send_json({
                        "event": "price_update",
                        "symbol": symbol,
                        "data": {
                            "price": data.get("c"),  # Son fiyat
                            "priceChange": data.get("p"),  # 24 saat fiyat değişimi
                            "priceChangePercent": data.get("P"),  # 24 saat fiyat değişimi yüzdesi
                            "volume": data.get("v"),  # 24 saat hacim
                            "time": data.get("E")  # Olay zamanı
                        }
                    })
                except Exception as e:
                    logger.error(f"WebSocket veri gönderme hatası: {e}")
    
    # Binance WebSocket bağlantısını başlat
    try:
        logger.info(f"Binance WebSocket bağlantısı kuruluyor: {stream_name}")
        await binance_client.connect_websocket(stream_name, on_message)
        
        # Bağlantı kesilene kadar bekle
        try:
            while True:
                data = await websocket.receive_text()
                logger.debug(f"İstemciden alınan mesaj: {data}")
                # İstemci komutlarını buradan işleyebilirsiniz
        except WebSocketDisconnect:
            logger.info(f"İstemci bağlantısı kesildi: {symbol}")
            # Bağlantıyı listeden kaldır
            if symbol in connected_price_clients:
                connected_price_clients[symbol].remove(websocket)
                # Hiç istemci kalmadıysa, Binance WS bağlantısını da kapat
                if not connected_price_clients[symbol]:
                    await binance_client.disconnect_websocket(stream_name)
                    del connected_price_clients[symbol]
    except Exception as e:
        logger.error(f"WebSocket fiyat akışı hatası: {e}")
        await websocket.close(code=1011, reason=f"Sunucu hatası: {str(e)}")

@router.websocket("/kline/{symbol}")
async def websocket_kline_endpoint(
    websocket: WebSocket, 
    symbol: str, 
    interval: str = Query("1m", description="Mum aralığı: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M")
):
    """
    Belirli bir sembol ve zaman aralığı için gerçek zamanlı mum verisi ve teknik gösterge güncellemeleri sağlar.
    WebSocket bağlantısı kurulduğunda, sembol için Binance WebSocket akışına abone olur
    ve mum verisi güncellemelerini istemciye iletir.
    
    Örnek bağlantı URL'i: ws://localhost:8002/ws/kline/btcusdt?interval=1m
    """
    await websocket.accept()
    
    # Sembolü küçük harfe çevir
    symbol = symbol.lower()
    stream_name = f"{symbol}@kline_{interval}"
    key = f"{symbol}_{interval}"
    
    # Bağlantıyı kaydet
    if key not in connected_indicator_clients:
        connected_indicator_clients[key] = []
    connected_indicator_clients[key].append(websocket)
    
    # Mum verilerini saklamak için bir DataFrame
    # Her yeni mum geldiğinde güncellenir ve teknik göstergeler hesaplanır
    klines_df = None
    
    # İlk veriyi al
    try:
        # Geçmiş mum verilerini al
        klines = await binance_client.get_klines(
            symbol=symbol.upper(), 
            interval=interval, 
            limit=100
        )
        
        # DataFrame'e dönüştür
        klines_df = pd.DataFrame(klines, columns=[
            "timestamp", "open", "high", "low", "close", "volume",
            "close_time", "quote_asset_volume", "number_of_trades",
            "taker_buy_base_asset_volume", "taker_buy_quote_asset_volume", "ignore"
        ])
        
        # Veri tiplerini düzelt
        numeric_columns = ["open", "high", "low", "close", "volume"]
        for col in numeric_columns:
            klines_df[col] = pd.to_numeric(klines_df[col])
        
        # Zaman damgasını datetime'a dönüştür
        klines_df["timestamp"] = pd.to_datetime(klines_df["timestamp"], unit="ms")
        klines_df.set_index("timestamp", inplace=True)
        
        # Teknik göstergeleri hesapla
        klines_df = TechnicalIndicators.calculate_indicators(klines_df)
        
    except Exception as e:
        logger.error(f"Geçmiş mum verilerini alma hatası: {e}")
        await websocket.close(code=1011, reason=f"Veri alma hatası: {str(e)}")
        return
    
    # Callback fonksiyonu
    async def on_message(message):
        nonlocal klines_df
        
        try:
            data = json.loads(message)
            kline = data.get("k", {})
            
            # Mum tamamlandı mı kontrol et
            is_closed = kline.get("x", False)
            
            # Tamamlanmış mum ise DataFrame'i güncelle ve göstergeleri yeniden hesapla
            if is_closed:
                # Yeni satır oluştur
                timestamp = pd.to_datetime(kline.get("t"), unit="ms")
                new_row = pd.DataFrame([{
                    "open": float(kline.get("o")),
                    "high": float(kline.get("h")),
                    "low": float(kline.get("l")),
                    "close": float(kline.get("c")),
                    "volume": float(kline.get("v")),
                    "close_time": pd.to_datetime(kline.get("T"), unit="ms"),
                    "quote_asset_volume": float(kline.get("q")),
                    "number_of_trades": kline.get("n"),
                    "taker_buy_base_asset_volume": float(kline.get("V")),
                    "taker_buy_quote_asset_volume": float(kline.get("Q")),
                    "ignore": 0
                }], index=[timestamp])
                
                # DataFrame'e ekle ve en eski satırı kaldır
                klines_df = pd.concat([klines_df, new_row]).iloc[-100:]
                
                # Teknik göstergeleri yeniden hesapla
                klines_df = TechnicalIndicators.calculate_indicators(klines_df)
                
                # Son satırı al ve teknik göstergeleri çıkar
                last_row = klines_df.iloc[-1].to_dict()
                
                # Trend analizi yap
                trend = TechnicalIndicators.analyze_trend(klines_df)
                
                # Sinyalleri hesapla
                signals = TechnicalIndicators.get_signals(klines_df)
                
                # Tüm bağlı istemcilere gönder
                for client in connected_indicator_clients.get(key, []):
                    if client.client_state.CONNECTED:  # Sadece aktif bağlantılara gönder
                        try:
                            await client.send_json({
                                "event": "kline_update",
                                "symbol": symbol,
                                "interval": interval,
                                "data": {
                                    "kline": {
                                        "open_time": kline.get("t"),
                                        "open": kline.get("o"),
                                        "high": kline.get("h"),
                                        "low": kline.get("l"),
                                        "close": kline.get("c"),
                                        "volume": kline.get("v"),
                                        "close_time": kline.get("T"),
                                    },
                                    "indicators": {key: last_row[key] for key in last_row if key not in ['open', 'high', 'low', 'close', 'volume', 'close_time']},
                                    "trend": trend,
                                    "signals": signals
                                }
                            })
                        except Exception as e:
                            logger.error(f"WebSocket veri gönderme hatası: {e}")
            else:
                # Tamamlanmamış mum için sadece fiyat güncellemesi gönder
                for client in connected_indicator_clients.get(key, []):
                    if client.client_state.CONNECTED:
                        try:
                            await client.send_json({
                                "event": "kline_progress",
                                "symbol": symbol,
                                "interval": interval,
                                "data": {
                                    "time": kline.get("t"),
                                    "open": kline.get("o"),
                                    "high": kline.get("h"),
                                    "low": kline.get("l"),
                                    "close": kline.get("c"),
                                    "volume": kline.get("v")
                                }
                            })
                        except Exception as e:
                            logger.error(f"WebSocket veri gönderme hatası: {e}")
        except Exception as e:
            logger.error(f"WebSocket kline işleme hatası: {e}")
    
    # Binance WebSocket bağlantısını başlat
    try:
        logger.info(f"Binance WebSocket kline bağlantısı kuruluyor: {stream_name}")
        await binance_client.connect_websocket(stream_name, on_message)
        
        # İlk verileri gönder
        if klines_df is not None:
            last_indicators = klines_df.iloc[-1].to_dict()
            trend = TechnicalIndicators.analyze_trend(klines_df)
            signals = TechnicalIndicators.get_signals(klines_df)
            
            await websocket.send_json({
                "event": "initial_data",
                "symbol": symbol,
                "interval": interval,
                "data": {
                    "indicators": {key: last_indicators[key] for key in last_indicators if key not in ['open', 'high', 'low', 'close', 'volume', 'close_time']},
                    "trend": trend,
                    "signals": signals,
                    "klines": klines_df.reset_index().to_dict(orient="records")
                }
            })
        
        # Bağlantı kesilene kadar bekle
        try:
            while True:
                data = await websocket.receive_text()
                logger.debug(f"İstemciden alınan mesaj: {data}")
                # İstemci komutlarını buradan işleyebilirsiniz
        except WebSocketDisconnect:
            logger.info(f"İstemci bağlantısı kesildi: {key}")
            # Bağlantıyı listeden kaldır
            if key in connected_indicator_clients:
                connected_indicator_clients[key].remove(websocket)
                # Hiç istemci kalmadıysa, Binance WS bağlantısını da kapat
                if not connected_indicator_clients[key]:
                    await binance_client.disconnect_websocket(stream_name)
                    del connected_indicator_clients[key]
    except Exception as e:
        logger.error(f"WebSocket kline akışı hatası: {e}")
        await websocket.close(code=1011, reason=f"Sunucu hatası: {str(e)}")

@router.get("/status")
async def websocket_status():
    """
    Aktif WebSocket bağlantılarını görüntüler
    """
    price_connections = {symbol: len(clients) for symbol, clients in connected_price_clients.items()}
    indicator_connections = {key: len(clients) for key, clients in connected_indicator_clients.items()}
    
    return {
        "price_connections": price_connections,
        "indicator_connections": indicator_connections,
        "total_price_clients": sum(len(clients) for clients in connected_price_clients.values()),
        "total_indicator_clients": sum(len(clients) for clients in connected_indicator_clients.values()),
    } 