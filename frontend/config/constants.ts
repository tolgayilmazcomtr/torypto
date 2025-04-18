// API ve diğer sabitler

// API URL'si - geliştirme ve prodüksiyon ortamlarına göre değişebilir
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Diğer sabitler
export const DEFAULT_INTERVAL = '1h';
export const DEFAULT_SYMBOL = 'BTCUSDT';
export const AVAILABLE_INTERVALS = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];

// WebSocket yeniden bağlanma ayarları
export const WS_RECONNECT_DELAY = 5000; // 5 saniye
export const WS_MAX_RECONNECT_ATTEMPTS = 5; 