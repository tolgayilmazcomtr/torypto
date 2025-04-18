import axios from 'axios';
import { ApiResponse, SymbolPrice, KlineData, Symbol, MarketData, GetKlinesParams, GetPricesParams, GetSymbolsParams } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Zaman aralığını milisaniyeye çevir
function getIntervalInMs(interval: string = '1h'): number {
  const value = parseInt(interval.slice(0, -1));
  const unit = interval.slice(-1);
  
  switch (unit) {
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'w': return value * 7 * 24 * 60 * 60 * 1000;
    case 'M': return value * 30 * 24 * 60 * 60 * 1000;
    default: return 60 * 60 * 1000; // Varsayılan olarak 1 saat
  }
}

export type CryptoSymbol = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  iconUrl: string;
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
    const response = await axios.get<Symbol[]>(`${API_URL}/api/crypto/symbols`, {
      params
    });
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
    console.log("Klines API isteği:", `${API_URL}/api/crypto/klines/${symbol}?interval=${params?.interval}&limit=${params?.limit}&add_indicators=${params?.add_indicators}`);
    
    try {
      const response = await axios.get<KlineData[]>(`${API_URL}/api/crypto/klines/${symbol}`, {
        params
      });
      console.log("Klines API yanıtı:", response);
      
      // API yanıt formatı değiştiği için farklı yapıları kontrol ediyoruz
      if (response.data && response.data.result && response.data.result.data) {
        return response.data.result.data;
      } else if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error("Beklenmeyen API yanıt formatı:", response.data);
        throw new Error("API yanıt formatı beklendiği gibi değil");
      }
    } catch (apiError) {
      console.error("API çağrısı başarısız, mock veri kullanılıyor:", apiError);
      
      // Mock veri oluştur
      const mockData: KlineData[] = [];
      const basePrice = symbol.includes("BTC") ? 65000 : symbol.includes("ETH") ? 3500 : 100;
      const now = new Date().getTime();
      
      for (let i = 0; i < params?.limit || 100; i++) {
        const time = now - (params?.limit - i - 1) * getIntervalInMs(params?.interval || '1h');
        const volatility = (Math.random() * 2 - 1) * 0.02;
        const close = basePrice * (1 + volatility);
        const open = close * (1 + (Math.random() * 0.01 - 0.005));
        const high = Math.max(open, close) * (1 + Math.random() * 0.005);
        const low = Math.min(open, close) * (1 - Math.random() * 0.005);
        const volume = basePrice * 10 * (1 + Math.random());
        
        mockData.push({
          open_time: time,
          open: open,
          high: high,
          low: low,
          close: close,
          volume: volume,
          close_time: time + getIntervalInMs(params?.interval || '1h') - 1,
          quote_volume: volume * close,
          trades: Math.floor(Math.random() * 1000) + 100,
          taker_buy_base: volume * 0.6,
          taker_buy_quote: volume * close * 0.6
        });
      }
      
      return mockData;
    }
  } catch (error) {
    console.error(`${symbol} OHLCV verileri getirilemedi:`, error);
    throw error;
  }
}

const cryptoService = {
  // Tüm sembolleri getir (ikonlarla birlikte)
  getSymbols: async (): Promise<CryptoSymbol[]> => {
    try {
      const response = await axios.get<any>(`${API_URL}/api/symbols?limit=1000`);
      if (response.data && response.data.items) {
        return response.data.items.map((item: any) => ({
          symbol: item.symbol,
          baseAsset: item.base_asset,
          quoteAsset: item.quote_asset,
          status: item.status || "TRADING",
          iconUrl: item.icon_url || `https://cryptoicons.org/api/icon/${item.base_asset.toLowerCase()}/64`
        }));
      }
      return [];
    } catch (error) {
      console.error('Semboller getirilemedi:', error);
      // Hata durumunda varsayılan semboller döndür
      const defaultSymbols = ["BTC", "ETH", "BNB", "XRP", "ADA", "SOL", "DOT", "DOGE", "MATIC"];
      return defaultSymbols.map(symbol => ({
        symbol: `${symbol}USDT`,
        baseAsset: symbol,
        quoteAsset: "USDT",
        status: "TRADING",
        iconUrl: `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/64`
      }));
    }
  },

  // Sembolleri ikonlarla birlikte al
  getSymbolsWithIcons: async (): Promise<CryptoSymbol[]> => {
    try {
      const response = await axios.get<any[]>(`${API_URL}/api/crypto/symbols-with-icons`);
      return response.data.map((item: any) => ({
        symbol: item.symbol,
        baseAsset: item.baseAsset,
        quoteAsset: item.quoteAsset,
        status: item.status,
        iconUrl: item.iconUrl
      }));
    } catch (error) {
      console.error('İkonlu semboller getirilemedi:', error);
      // Hata durumunda varsayılan semboller döndür
      const defaultSymbols = ["BTC", "ETH", "BNB", "XRP", "ADA", "SOL", "DOT", "DOGE", "MATIC"];
      return defaultSymbols.map(symbol => ({
        symbol: `${symbol}USDT`,
        baseAsset: symbol,
        quoteAsset: "USDT",
        status: "TRADING",
        iconUrl: `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/64`
      }));
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

  // Teknik analiz verileri getir
  getAnalysis: async (
    symbol: string,
    interval: string = '1h',
    limit: number = 100
  ): Promise<AnalysisResult> => {
    try {
      console.log("Analiz API isteği:", `${API_URL}/api/crypto/analysis/${symbol}?interval=${interval}&limit=${limit}`);
      
      try {
        const response = await axios.get(
          `${API_URL}/api/crypto/analysis/${symbol}?interval=${interval}&limit=${limit}`
        );
        
        console.log("Analiz API yanıtı:", response.data);
        
        // API doğrudan analiz sonucunu döndürüyor mu kontrol et
        if (response.data && typeof response.data === 'object') {
          return response.data;
        } else {
          console.error("Beklenmeyen API yanıt formatı:", response.data);
          throw new Error("API yanıt formatı beklendiği gibi değil");
        }
      } catch (apiError) {
        console.error("API çağrısı başarısız, mock veri kullanılıyor:", apiError);
        
        // Mock veri kullan
        return {
          symbol: symbol,
          interval: interval,
          last_price: 65432.10,
          price_change: 1250.75,
          price_change_percent: 1.95,
          trend: {
            overall: "yükseliş",
            ma_trend: "yükseliş",
            ema_trend: "yükseliş",
            rsi_status: "normal",
            macd_trend: "AL",
            macd_cross: "yakın",
            bb_status: "yükseliş",
            stoch_status: "aşırı alım",
            adx_strength: "güçlü",
            cci_status: "pozitif",
            ichimoku_cloud: "bulutun üzerinde",
            bullish_score: 7,
            bearish_score: 3
          },
          signals: {
            rsi: "AL",
            macd: "AL",
            bollinger: "AL",
            stochastic: "BEKLETİN",
            ma_cross: "AL",
            combined: "AL"
          },
          support_resistance: {
            support: [64100, 63500, 62800],
            resistance: [66000, 66800, 67500]
          },
          indicators: {
            rsi: 58.5,
            macd: 125.5,
            ma7: 65100,
            ma25: 64200,
            bb_upper: 66500,
            bb_middle: 65200,
            bb_lower: 63900,
            stoch_k: 75.2,
            stoch_d: 68.5
          }
        };
      }
    } catch (error) {
      console.error(`${symbol} analiz verileri getirilemedi:`, error);
      throw error;
    }
  },

  // En çok yükselen kripto paraları getir
  getTopGainers: async (limit: number = 10): Promise<TopSymbol[]> => {
    try {
      const response = await axios.get<{data: TopSymbol[]}>(`${API_URL}/api/crypto/top-gainers?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('En çok yükselenler getirilemedi:', error);
      throw error;
    }
  },

  // En çok düşen kripto paraları getir
  getTopLosers: async (limit: number = 10): Promise<TopSymbol[]> => {
    try {
      const response = await axios.get<{data: TopSymbol[]}>(`${API_URL}/api/crypto/top-losers?limit=${limit}`);
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

  // OHLCV verileri getir
  getKlines: async (
    symbol: string,
    interval: string = '1h',
    limit: number = 100,
    addIndicators: boolean = false
  ): Promise<KlineData[]> => {
    try {
      console.log("Klines API isteği:", `${API_URL}/api/crypto/klines/${symbol}?interval=${interval}&limit=${limit}&add_indicators=${addIndicators}`);
      
      try {
        const response = await axios.get(
          `${API_URL}/api/crypto/klines/${symbol}?interval=${interval}&limit=${limit}&add_indicators=${addIndicators}`
        );
        console.log("Klines API yanıtı:", response);
        
        // API yanıt formatı değiştiği için farklı yapıları kontrol ediyoruz
        if (response.data && response.data.result && response.data.result.data) {
          return response.data.result.data;
        } else if (response.data && response.data.data) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        } else {
          console.error("Beklenmeyen API yanıt formatı:", response.data);
          throw new Error("API yanıt formatı beklendiği gibi değil");
        }
      } catch (apiError) {
        console.error("API çağrısı başarısız, mock veri kullanılıyor:", apiError);
        
        // Mock veri oluştur
        const mockData: KlineData[] = [];
        const basePrice = symbol.includes("BTC") ? 65000 : symbol.includes("ETH") ? 3500 : 100;
        const now = new Date().getTime();
        
        for (let i = 0; i < limit; i++) {
          const time = now - (limit - i - 1) * getIntervalInMs(interval);
          const volatility = (Math.random() * 2 - 1) * 0.02;
          const close = basePrice * (1 + volatility);
          const open = close * (1 + (Math.random() * 0.01 - 0.005));
          const high = Math.max(open, close) * (1 + Math.random() * 0.005);
          const low = Math.min(open, close) * (1 - Math.random() * 0.005);
          const volume = basePrice * 10 * (1 + Math.random());
          
          mockData.push({
            open_time: time,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume,
            close_time: time + getIntervalInMs(interval) - 1,
            quote_volume: volume * close,
            trades: Math.floor(Math.random() * 1000) + 100,
            taker_buy_base: volume * 0.6,
            taker_buy_quote: volume * close * 0.6
          });
        }
        
        return mockData;
      }
    } catch (error) {
      console.error(`${symbol} OHLCV verileri getirilemedi:`, error);
      throw error;
    }
  },
};

export default cryptoService; 