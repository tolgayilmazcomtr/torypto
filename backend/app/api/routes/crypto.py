from fastapi import APIRouter, Query, HTTPException, Depends, WebSocket, WebSocketDisconnect, Request, Path
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import json
from pydantic import BaseModel

from ...data.binance_client import BinanceClient
from ...dependencies import get_binance_client
from services.binance_service import BinanceService
from technical_analysis.indicators import TechnicalIndicators
from app.dependencies import get_current_user
from app.schemas.users import User
from app.schemas.crypto import SymbolPrice, KlineData

# Logger
logger = logging.getLogger("torypto")

# Router oluşturma
router = APIRouter(
    prefix="/api/crypto",
    tags=["Kripto"],
    responses={404: {"description": "Bulunamadı"}},
)

# Binance Service örneği
binance_service = BinanceService()

# WebSocket bağlantı yönetimi için aktif bağlantıları izle
active_connections: Dict[str, List[WebSocket]] = {}

class SymbolPrice(BaseModel):
    symbol: str
    price: float

class KlineData(BaseModel):
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: float

@router.get("/exchange-info", summary="Borsa bilgilerini getirir")
async def get_exchange_info(
    binance_client: BinanceClient = Depends(get_binance_client)
):
    """
    Binance borsasının temel bilgilerini döndürür.
    """
    try:
        exchange_info = await binance_client.get_exchange_info()
        return exchange_info
    except Exception as e:
        logger.error(f"Borsa bilgileri alınırken hata oluştu: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Borsa bilgileri alınırken hata oluştu: {str(e)}"
        )

@router.get("/symbols", response_model=List[str])
async def get_symbols():
    """
    Tüm kripto para sembollerini listeler.
    """
    try:
        symbols = binance_service.get_all_symbols()
        return symbols
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kripto sembolleri alınamadı: {str(e)}")

@router.get("/price/{symbol}", response_model=SymbolPrice)
async def get_symbol_price(symbol: str = Path(..., description="Kripto para sembolü, örn. BTCUSDT")):
    """
    Belirli bir kripto para sembolünün güncel fiyatını döndürür.
    """
    try:
        price = binance_service.get_price(symbol)
        return {"symbol": symbol, "price": price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{symbol} fiyatı alınamadı: {str(e)}")

@router.get("/prices", response_model=List[SymbolPrice])
async def get_all_prices():
    """
    Tüm kripto para birimlerinin fiyatlarını döndürür.
    """
    try:
        prices = binance_service.get_all_prices()
        return [{"symbol": symbol, "price": price} for symbol, price in prices.items()]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fiyatlar alınamadı: {str(e)}")

@router.get("/klines/{symbol}", response_model=List[KlineData])
async def get_klines(
    symbol: str = Path(..., description="Kripto para sembolü, örn. BTCUSDT"),
    interval: str = Query("1h", description="Mum aralığı (1m, 5m, 15m, 30m, 1h, 4h, 1d)"),
    limit: int = Query(100, description="Dönecek mum sayısı", gt=0, le=1000)
):
    """
    Belirli bir sembol için OHLCV (Açılış, Yüksek, Düşük, Kapanış, Hacim) verilerini döndürür.
    """
    try:
        klines = binance_service.get_klines(symbol, interval, limit)
        
        # Klines verilerini formatlama
        formatted_klines = []
        for k in klines:
            formatted_klines.append({
                "timestamp": k[0],  # Açılış zamanı
                "open": float(k[1]),
                "high": float(k[2]),
                "low": float(k[3]),
                "close": float(k[4]),
                "volume": float(k[5])
            })
        
        return formatted_klines
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{symbol} için OHLCV verileri alınamadı: {str(e)}")

@router.get("/analysis/{symbol}", response_model=Dict[str, Any])
async def get_analysis(
    symbol: str = Path(..., description="Kripto para sembolü, örn. BTCUSDT"),
    interval: str = Query("1h", description="Mum aralığı (1m, 5m, 15m, 30m, 1h, 4h, 1d)"),
    limit: int = Query(100, description="Analiz için kullanılacak mum sayısı", gt=0, le=1000)
):
    """
    Belirli bir sembol için teknik analiz verilerini döndürür.
    Trend analizi, sinyaller ve destek/direnç seviyelerini içerir.
    """
    try:
        # OHLCV verilerini al
        klines = binance_service.get_klines(symbol, interval, limit)
        
        # Pandas DataFrame'e dönüştür
        import pandas as pd
        import numpy as np
        
        df = pd.DataFrame(klines, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume', 'close_time', 
                                          'quote_asset_volume', 'number_of_trades', 'taker_buy_base_asset_volume', 
                                          'taker_buy_quote_asset_volume', 'ignore'])
        
        # String'den sayısal değerlere dönüştür
        df['open'] = pd.to_numeric(df['open'])
        df['high'] = pd.to_numeric(df['high'])
        df['low'] = pd.to_numeric(df['low'])
        df['close'] = pd.to_numeric(df['close'])
        df['volume'] = pd.to_numeric(df['volume'])
        
        # Teknik analiz yap
        analysis_result = TechnicalIndicators.analyze_market_data(df)
        
        # Sonuca sembol bilgisini ekle
        analysis_result["symbol"] = symbol
        analysis_result["interval"] = interval
        
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{symbol} için analiz verileri oluşturulamadı: {str(e)}")

@router.get("/top-gainers", response_model=List[Dict[str, Any]])
async def get_top_gainers(limit: int = Query(10, description="Listelenecek kripto sayısı", gt=0, le=100)):
    """
    En çok değer kazanan kripto para birimlerini döndürür.
    """
    try:
        tickers = binance_service.get_24h_ticker()
        
        # USDT çiftlerini filtrele ve değişim yüzdesine göre sırala
        usdt_pairs = [ticker for ticker in tickers if ticker['symbol'].endswith('USDT')]
        sorted_pairs = sorted(usdt_pairs, key=lambda x: float(x['priceChangePercent']), reverse=True)
        
        top_gainers = []
        for pair in sorted_pairs[:limit]:
            top_gainers.append({
                "symbol": pair['symbol'],
                "price": float(pair['lastPrice']),
                "price_change": float(pair['priceChange']),
                "price_change_percent": float(pair['priceChangePercent']),
                "volume": float(pair['volume'])
            })
        
        return top_gainers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Top gainers alınamadı: {str(e)}")

@router.get("/top-losers", response_model=List[Dict[str, Any]])
async def get_top_losers(limit: int = Query(10, description="Listelenecek kripto sayısı", gt=0, le=100)):
    """
    En çok değer kaybeden kripto para birimlerini döndürür.
    """
    try:
        tickers = binance_service.get_24h_ticker()
        
        # USDT çiftlerini filtrele ve değişim yüzdesine göre sırala (artan)
        usdt_pairs = [ticker for ticker in tickers if ticker['symbol'].endswith('USDT')]
        sorted_pairs = sorted(usdt_pairs, key=lambda x: float(x['priceChangePercent']))
        
        top_losers = []
        for pair in sorted_pairs[:limit]:
            top_losers.append({
                "symbol": pair['symbol'],
                "price": float(pair['lastPrice']),
                "price_change": float(pair['priceChange']),
                "price_change_percent": float(pair['priceChangePercent']),
                "volume": float(pair['volume'])
            })
        
        return top_losers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Top losers alınamadı: {str(e)}")

@router.get("/top-volume")
async def get_top_volume(
    quote_asset: str = Query("USDT", description="Baz para birimi (USDT, BTC, ETH vb.)"),
    limit: int = Query(10, ge=1, le=100, description="Kaç adet sembol getirileceği")
):
    """
    En yüksek işlem hacmine sahip kripto paraları döndürür
    """
    try:
        all_tickers = await binance_service.get_24h_ticker()
        
        # Quote asset ile biten sembolleri filtrele
        filtered_tickers = [
            ticker for ticker in all_tickers 
            if ticker["symbol"].endswith(quote_asset)
        ]
        
        # Hacme göre sırala
        sorted_tickers = sorted(
            filtered_tickers, 
            key=lambda x: float(x["volume"]) * float(x["lastPrice"]), 
            reverse=True
        )
        
        # İstenilen sayıda döndür
        top_tickers = sorted_tickers[:limit]
        
        # Sonucu formatlama
        result = []
        for ticker in top_tickers:
            symbol = ticker["symbol"]
            base_asset = symbol.replace(quote_asset, "")
            
            result.append({
                "symbol": symbol,
                "base_asset": base_asset,
                "quote_asset": quote_asset,
                "price": float(ticker["lastPrice"]),
                "volume_24h": float(ticker["volume"]),
                "quote_volume_24h": float(ticker["volume"]) * float(ticker["lastPrice"]),
                "price_change_24h": float(ticker["priceChange"]),
                "price_change_percent_24h": float(ticker["priceChangePercent"])
            })
        
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Hacim bilgisi alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Hacim bilgisi alınamadı: {str(e)}")

@router.get("/premium/detailed-analysis/{symbol}", response_model=Dict[str, Any])
async def get_detailed_analysis(
    symbol: str = Path(..., description="Kripto para sembolü, örn. BTCUSDT"),
    interval: str = Query("1h", description="Mum aralığı"),
    user: User = Depends(get_current_user)
):
    """
    Premium kullanıcılar için detaylı teknik analiz sağlar.
    Daha fazla indikatör ve tahminlere erişim içerir.
    """
    # Kullanıcının premium erişimi olup olmadığını kontrol et
    if not user.is_premium:
        raise HTTPException(status_code=403, detail="Bu özellik sadece premium kullanıcılar için erişilebilir")
    
    try:
        # OHLCV verilerini al
        klines = binance_service.get_klines(symbol, interval, 200)  # Daha uzun geçmiş
        
        # Pandas DataFrame'e dönüştür
        import pandas as pd
        
        df = pd.DataFrame(klines, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume', 'close_time', 
                                          'quote_asset_volume', 'number_of_trades', 'taker_buy_base_asset_volume', 
                                          'taker_buy_quote_asset_volume', 'ignore'])
        
        # String'den sayısal değerlere dönüştür
        df['open'] = pd.to_numeric(df['open'])
        df['high'] = pd.to_numeric(df['high'])
        df['low'] = pd.to_numeric(df['low'])
        df['close'] = pd.to_numeric(df['close'])
        df['volume'] = pd.to_numeric(df['volume'])
        
        # Temel analizi yap
        basic_analysis = TechnicalIndicators.analyze_market_data(df)
        
        # Ek premium indikatörler
        sma_20 = TechnicalIndicators.calculate_sma(df, 20).iloc[-1]
        sma_50 = TechnicalIndicators.calculate_sma(df, 50).iloc[-1]
        sma_200 = TechnicalIndicators.calculate_sma(df, 200).iloc[-1]
        
        # Ek indikatörleri ekle
        detailed_analysis = {
            **basic_analysis,
            "premium_indicators": {
                "sma_20": sma_20,
                "sma_50": sma_50,
                "sma_200": sma_200,
                "golden_cross": sma_50 > sma_200 and sma_50 > sma_20,
                "death_cross": sma_50 < sma_200 and sma_50 < sma_20
            },
            "prediction": {
                "short_term": "yükseliş" if basic_analysis["signals"]["genel"] == "al" else 
                             "düşüş" if basic_analysis["signals"]["genel"] == "sat" else "yatay",
                "confidence": 0.75  # Bu değer gerçek bir tahmin algoritmasından gelecek
            }
        }
        
        return detailed_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detaylı analiz oluşturulamadı: {str(e)}")

@router.get("/ticker/price")
async def get_ticker_price(
    symbol: Optional[str] = None,
    client: BinanceClient = Depends(get_binance_client)
):
    """
    Anlık fiyat bilgisini al.
    Symbol belirtilmezse tüm sembollerin fiyatları döner.
    """
    try:
        prices = await client.get_ticker_price(symbol)
        return {
            "status": "success",
            "data": prices
        }
    except Exception as e:
        logger.error(f"Fiyat bilgisi alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Binance API hatası: {str(e)}")

@router.get("/klines")
async def get_klines(
    symbol: str = Query(..., description="Kripto para sembolü, örn: BTCUSDT"),
    interval: str = Query("1h", description="Mum aralığı: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M"),
    limit: int = Query(100, description="Alınacak mum sayısı", ge=1, le=1000),
    start_time: Optional[int] = Query(None, description="Başlangıç zamanı (milisaniye olarak Unix timestamp)"),
    end_time: Optional[int] = Query(None, description="Bitiş zamanı (milisaniye olarak Unix timestamp)"),
    client: BinanceClient = Depends(get_binance_client)
):
    """
    Kripto para için OHLCV verilerini al
    """
    try:
        klines = await client.get_klines(
            symbol=symbol,
            interval=interval,
            limit=limit,
            start_time=start_time,
            end_time=end_time
        )
        
        # Veri dönüşümü
        formatted_data = []
        for k in klines:
            formatted_data.append({
                "open_time": k[0],
                "open": float(k[1]),
                "high": float(k[2]),
                "low": float(k[3]),
                "close": float(k[4]),
                "volume": float(k[5]),
                "close_time": k[6],
                "quote_asset_volume": float(k[7]),
                "number_of_trades": k[8],
                "taker_buy_base_asset_volume": float(k[9]),
                "taker_buy_quote_asset_volume": float(k[10])
            })
            
        return {
            "status": "success",
            "symbol": symbol,
            "interval": interval,
            "count": len(formatted_data),
            "data": formatted_data
        }
    except Exception as e:
        logger.error(f"OHLCV verileri alınırken hata: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Binance API hatası: {str(e)}")

@router.get("/markets", summary="Mevcut piyasaları getirir")
async def get_markets(
    quote_asset: Optional[str] = Query(None, description="İsteğe bağlı filtreleme için quote asset (USDT, BTC, vb.)"),
    binance_client: BinanceClient = Depends(get_binance_client)
):
    """
    Mevcut piyasaların listesini döndürür.
    İsteğe bağlı olarak quote_asset ile filtrelenebilir.
    """
    try:
        ticker_prices = await binance_client.get_ticker_price()
        
        if quote_asset:
            # Belirli bir quote asset'e göre filtreleme
            markets = [
                ticker for ticker in ticker_prices
                if ticker["symbol"].endswith(quote_asset)
            ]
            return {
                quote_asset: markets
            }
        else:
            # Yaygın quote asset'lere göre gruplandırma
            common_quotes = ["USDT", "BTC", "ETH", "BNB", "BUSD"]
            result = {}
            
            for quote in common_quotes:
                result[quote] = [
                    ticker for ticker in ticker_prices
                    if ticker["symbol"].endswith(quote)
                ]
            
            # Diğer tüm quote asset'ler için
            others = [
                ticker for ticker in ticker_prices
                if not any(ticker["symbol"].endswith(q) for q in common_quotes)
            ]
            
            if others:
                result["OTHER"] = others
                
            return result
    except Exception as e:
        logger.error(f"Piyasa bilgileri alınırken hata oluştu: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Piyasa bilgileri alınırken hata oluştu: {str(e)}"
        )

@router.get("/price/{symbol}", summary="Belirli bir sembolün fiyatını getirir")
async def get_single_price(
    symbol: str,
    binance_client: BinanceClient = Depends(get_binance_client)
):
    """
    Belirli bir sembolün güncel fiyatını döndürür.
    Sembol formatı: BTCUSDT, ETHUSDT vb.
    """
    try:
        # Sembolü büyük harfe çevir
        symbol = symbol.upper()
        
        price_data = await binance_client.get_ticker_price(symbol=symbol)
        return price_data
    except Exception as e:
        logger.error(f"{symbol} fiyatı alınırken hata oluştu: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"{symbol} fiyatı alınırken hata oluştu: {str(e)}"
        )

@router.get("/prices", summary="Tüm sembol fiyatlarını getirir")
async def get_multiple_prices(
    symbols: Optional[str] = Query(None, description="Virgülle ayrılmış sembol listesi (örn: BTCUSDT,ETHUSDT)"),
    binance_client: BinanceClient = Depends(get_binance_client)
):
    """
    Tüm sembol fiyatlarını veya belirli sembollerin fiyatlarını döndürür.
    İsteğe bağlı olarak symbols parametresi ile filtrelenebilir.
    """
    try:
        if symbols:
            # Belirli sembolleri al
            symbol_list = [s.strip().upper() for s in symbols.split(",")]
            
            # Tüm fiyatları bir kez al
            all_prices = await binance_client.get_ticker_price()
            
            # Listeyi dönüştür
            if isinstance(all_prices, list):
                # Eşleşen sembolleri filtrele
                return [
                    item for item in all_prices 
                    if item["symbol"] in symbol_list
                ]
            else:
                # Tek bir sembol için yanıt
                return [all_prices]
        else:
            # Tüm fiyatları al
            all_prices = await binance_client.get_ticker_price()
            
            # Listeyi dönüştür
            if isinstance(all_prices, list):
                return all_prices
            else:
                # Tek bir sembol için yanıt - bu durumla karşılaşılmamalı ama güvenlik için
                return [all_prices]
    except Exception as e:
        logger.error(f"Fiyatlar alınırken hata oluştu: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Fiyatlar alınırken hata oluştu: {str(e)}"
        )

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