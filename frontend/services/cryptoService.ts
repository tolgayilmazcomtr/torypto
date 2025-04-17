import axios from 'axios';
import { ApiResponse, SymbolPrice, KlineData, Symbol, MarketData, GetKlinesParams, GetPricesParams, GetSymbolsParams } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type CryptoSymbol = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
};

export type AnalysisResult = {
  symbol: string;
  interval: string;
  last_price: number;
  price_change: number;
  price_change_percent: number;
  trend: {
    overall: string;
    ma_trend: string;
    ema_trend: string;
    rsi_status: string;
    macd_trend: string;
    macd_cross: string;
    bb_status: string;
    stoch_status: string;
    adx_strength: string;
    cci_status: string;
    ichimoku_cloud: string;
    bullish_score: number;
    bearish_score: number;
  };
  signals: {
    [key: string]: string;
  };
  support_resistance: {
    support: number[];
    resistance: number[];
  };
  indicators: {
    [key: string]: number;
  };
};

export type TopSymbol = {
  symbol: string;
  base_asset: string;
  quote_asset: string;
  price: number;
  volume_24h: number;
  quote_volume_24h: number;
  price_change_24h: number;
  price_change_percent_24h: number;
};

/**
 * Tüm kripto para sembollerini getirir
 */
export async function getSymbols(params?: GetSymbolsParams): Promise<Symbol[]> {
  try {
    const response = await axios.get<Symbol[]>(`${API_URL}/api/crypto/symbols`, params);
    if (!response.data) {
      throw new Error('Sembol verileri alınamadı');
    }
    return response.data;
  } catch (error) {
    console.error('Semboller alınırken hata oluştu:', error);
    throw error;
  }
}

/**
 * Seçilen kripto paraların fiyatlarını getirir
 */
export async function getSymbolPrices(symbols: string[] | string): Promise<SymbolPrice[]> {
  try {
    const symbolParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const response = await axios.get<SymbolPrice[]>(`${API_URL}/api/crypto/prices`, { params: { symbols: symbolParam } });
    if (!response.data) {
      throw new Error('Fiyat verileri alınamadı');
    }
    return response.data;
  } catch (error) {
    console.error('Fiyatlar alınırken hata oluştu:', error);
    throw error;
  }
}

/**
 * Piyasadaki tüm kripto para fiyatlarını gruplandırılmış olarak getirir
 */
export async function getMarkets(): Promise<MarketData> {
  try {
    const response = await axios.get<MarketData>(`${API_URL}/api/crypto/markets`);
    if (!response.data) {
      throw new Error('Piyasa verileri alınamadı');
    }
    return response.data;
  } catch (error) {
    console.error('Piyasa verileri alınırken hata oluştu:', error);
    throw error;
  }
}

/**
 * Belirli bir sembolün mum (kline) verilerini getirir
 */
export async function getKlines(symbol: string, params?: GetKlinesParams): Promise<KlineData[]> {
  try {
    const response = await axios.get<KlineData[]>(`${API_URL}/api/crypto/klines/${symbol}`, params);
    if (!response.data) {
      throw new Error('Grafik verileri alınamadı');
    }
    return response.data;
  } catch (error) {
    console.error('Grafik verileri alınırken hata oluştu:', error);
    throw error;
  }
}

const cryptoService = {
  // Tüm sembolleri getir
  getSymbols: async (): Promise<CryptoSymbol[]> => {
    try {
      const response = await axios.get<CryptoSymbol[]>(`${API_URL}/api/crypto/symbols`);
      return response.data.data;
    } catch (error) {
      console.error('Semboller getirilemedi:', error);
      throw error;
    }
  },

  // Bir sembolün fiyatını getir
  getPrice: async (symbol: string): Promise<SymbolPrice> => {
    try {
      const response = await axios.get<SymbolPrice>(`${API_URL}/api/crypto/price/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`${symbol} fiyatı getirilemedi:`, error);
      throw error;
    }
  },

  // Tüm fiyatları getir
  getAllPrices: async (): Promise<SymbolPrice[]> => {
    try {
      const response = await axios.get<SymbolPrice[]>(`${API_URL}/api/crypto/prices`);
      return response.data;
    } catch (error) {
      console.error('Fiyatlar getirilemedi:', error);
      throw error;
    }
  },

  // Belirli sembollerin fiyatlarını getir
  getPricesForSymbols: async (symbols: string[]): Promise<SymbolPrice[]> => {
    try {
      const symbolsParam = symbols.join(',');
      const response = await axios.get<SymbolPrice[]>(`${API_URL}/api/crypto/prices?symbols=${symbolsParam}`);
      return response.data;
    } catch (error) {
      console.error('Sembol fiyatları getirilemedi:', error);
      throw error;
    }
  },

  // OHLCV verileri getir
  getKlines: async (
    symbol: string,
    interval: string = '1h',
    limit: number = 100,
    addIndicators: boolean = false
  ): Promise<KlineData[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/api/crypto/klines/${symbol}?interval=${interval}&limit=${limit}&add_indicators=${addIndicators}`
      );
      return response.data.result.data;
    } catch (error) {
      console.error(`${symbol} OHLCV verileri getirilemedi:`, error);
      throw error;
    }
  },

  // Teknik analiz verileri getir
  getAnalysis: async (
    symbol: string,
    interval: string = '1h',
    limit: number = 100
  ): Promise<AnalysisResult> => {
    try {
      const response = await axios.get(
        `${API_URL}/api/crypto/analysis/${symbol}?interval=${interval}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error(`${symbol} analiz verileri getirilemedi:`, error);
      throw error;
    }
  },

  // En çok yükselen kripto paraları getir
  getTopGainers: async (limit: number = 10): Promise<TopSymbol[]> => {
    try {
      const response = await axios.get<TopSymbol[]>(`${API_URL}/api/crypto/top-gainers?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('En çok yükselenler getirilemedi:', error);
      throw error;
    }
  },

  // En çok düşen kripto paraları getir
  getTopLosers: async (limit: number = 10): Promise<TopSymbol[]> => {
    try {
      const response = await axios.get<TopSymbol[]>(`${API_URL}/api/crypto/top-losers?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('En çok düşenler getirilemedi:', error);
      throw error;
    }
  },

  // En yüksek hacimli kripto paraları getir
  getTopVolume: async (quoteAsset: string = 'USDT', limit: number = 10): Promise<TopSymbol[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/api/crypto/top-volume?quote_asset=${quoteAsset}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('En yüksek hacimli kripto paralar getirilemedi:', error);
      throw error;
    }
  },

  // Premium kullanıcılar için detaylı analiz
  getPremiumAnalysis: async (symbol: string, interval: string = '1h'): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum açmanız gerekiyor');
      }

      const response = await axios.get(
        `${API_URL}/api/crypto/premium/detailed-analysis/${symbol}?interval=${interval}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`${symbol} premium analiz verileri getirilemedi:`, error);
      throw error;
    }
  },
};

export default cryptoService; 