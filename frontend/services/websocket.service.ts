import { API_URL, WS_RECONNECT_DELAY, WS_MAX_RECONNECT_ATTEMPTS } from '@/config/constants';

class WebSocketService {
  private priceSocket: WebSocket | null = null;
  private klineSocket: WebSocket | null = null;
  private symbol: string = '';
  private interval: string = '1h';
  
  // WebSocket durumları
  private isConnected: boolean = false;
  private priceReconnectAttempts: number = 0;
  private klineReconnectAttempts: number = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  // Callback fonksiyonları
  private onPriceUpdateCallback: ((data: any) => void) | null = null;
  private onKlineUpdateCallback: ((data: any) => void) | null = null;
  private onIndicatorUpdateCallback: ((data: any) => void) | null = null;
  private onSignalUpdateCallback: ((data: any) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private onErrorCallback: ((error: any) => void) | null = null;

  // Fiyat bağlantısını başlat
  connectPrice(symbol: string): void {
    this.symbol = symbol;
    
    if (this.priceSocket) {
      this.priceSocket.close();
    }
    
    const wsUrl = `${API_URL.replace('http', 'ws')}/ws/price/${symbol}`;
    this.priceSocket = new WebSocket(wsUrl);
    
    this.priceSocket.onopen = () => {
      console.log(`Fiyat WebSocket bağlantısı açıldı: ${symbol}`);
      this.isConnected = true;
      this.priceReconnectAttempts = 0;
      if (this.onConnectCallback) this.onConnectCallback();
    };
    
    this.priceSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onPriceUpdateCallback) this.onPriceUpdateCallback(data);
      } catch (error) {
        console.error('WebSocket mesajı işlenirken hata:', error);
        if (this.onErrorCallback) this.onErrorCallback(error);
      }
    };
    
    this.priceSocket.onclose = () => {
      console.log(`Fiyat WebSocket bağlantısı kapandı: ${symbol}`);
      this.isConnected = false;
      if (this.onDisconnectCallback) this.onDisconnectCallback();
      this.tryReconnectPrice();
    };
    
    this.priceSocket.onerror = (error) => {
      console.error('WebSocket hatası:', error);
      if (this.onErrorCallback) this.onErrorCallback(error);
    };
  }
  
  // Kline bağlantısını başlat
  connectKline(symbol: string, interval: string = '1h'): void {
    this.symbol = symbol;
    this.interval = interval;
    
    if (this.klineSocket) {
      this.klineSocket.close();
    }
    
    const wsUrl = `${API_URL.replace('http', 'ws')}/ws/kline/${symbol}?interval=${interval}`;
    this.klineSocket = new WebSocket(wsUrl);
    
    this.klineSocket.onopen = () => {
      console.log(`Kline WebSocket bağlantısı açıldı: ${symbol} - ${interval}`);
      this.isConnected = true;
      this.klineReconnectAttempts = 0;
      if (this.onConnectCallback) this.onConnectCallback();
    };
    
    this.klineSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Kline verisi
        if (data.type === 'kline' && this.onKlineUpdateCallback) {
          this.onKlineUpdateCallback(data.data);
        }
        
        // Gösterge verisi
        if (data.type === 'indicators' && this.onIndicatorUpdateCallback) {
          this.onIndicatorUpdateCallback(data.data);
        }
        
        // Sinyal verisi
        if (data.type === 'signals' && this.onSignalUpdateCallback) {
          this.onSignalUpdateCallback(data.data);
        }
        
      } catch (error) {
        console.error('WebSocket mesajı işlenirken hata:', error);
        if (this.onErrorCallback) this.onErrorCallback(error);
      }
    };
    
    this.klineSocket.onclose = () => {
      console.log(`Kline WebSocket bağlantısı kapandı: ${symbol}`);
      this.isConnected = false;
      if (this.onDisconnectCallback) this.onDisconnectCallback();
      this.tryReconnectKline();
    };
    
    this.klineSocket.onerror = (error) => {
      console.error('WebSocket hatası:', error);
      if (this.onErrorCallback) this.onErrorCallback(error);
    };
  }
  
  // Yeniden bağlanma denemeleri
  private async tryReconnectPrice() {
    if (this.priceReconnectAttempts >= WS_MAX_RECONNECT_ATTEMPTS) {
      console.error('Maximum reconnect attempts reached for price websocket');
      this.onErrorCallback?.('Maximum reconnect attempts reached for price websocket');
      return;
    }

    this.priceReconnectAttempts++;
    console.log(`Attempting to reconnect price websocket (${this.priceReconnectAttempts}/${WS_MAX_RECONNECT_ATTEMPTS})`);
    
    // Wait before reconnecting
    await new Promise(resolve => setTimeout(resolve, WS_RECONNECT_DELAY));
    this.connectPrice(this.symbol);
  }
  
  private async tryReconnectKline() {
    if (this.klineReconnectAttempts >= WS_MAX_RECONNECT_ATTEMPTS) {
      console.error('Maximum reconnect attempts reached for kline websocket');
      this.onErrorCallback?.('Maximum reconnect attempts reached for kline websocket');
      return;
    }

    this.klineReconnectAttempts++;
    console.log(`Attempting to reconnect kline websocket (${this.klineReconnectAttempts}/${WS_MAX_RECONNECT_ATTEMPTS})`);
    
    // Wait before reconnecting
    await new Promise(resolve => setTimeout(resolve, WS_RECONNECT_DELAY));
    this.connectKline(this.symbol, this.interval);
  }
  
  // Bağlantıyı kapat
  disconnectPrice(): void {
    if (this.priceSocket) {
      this.priceSocket.close();
      this.priceSocket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  
  disconnectKline(): void {
    if (this.klineSocket) {
      this.klineSocket.close();
      this.klineSocket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  
  // Event listener'ları
  onPriceUpdate(callback: (data: any) => void): void {
    this.onPriceUpdateCallback = callback;
  }
  
  onKlineUpdate(callback: (data: any) => void): void {
    this.onKlineUpdateCallback = callback;
  }
  
  onIndicatorUpdate(callback: (data: any) => void): void {
    this.onIndicatorUpdateCallback = callback;
  }
  
  onSignalUpdate(callback: (data: any) => void): void {
    this.onSignalUpdateCallback = callback;
  }
  
  onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
  }
  
  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }
  
  onError(callback: (error: any) => void): void {
    this.onErrorCallback = callback;
  }
  
  // WebSocket durumunu kontrol et
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}

export const websocketService = new WebSocketService(); 