import { useState, useEffect } from 'react';
import { SymbolPrice, KlineData, Symbol, MarketData } from '@/types/api';
import cryptoService from '@/services/cryptoService';

/**
 * Kripto para sembollerini getirir
 */
export function useSymbols(activeOnly: boolean = true) {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSymbols = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cryptoService.getSymbols({ active_only: activeOnly });
        if (mounted) {
          setSymbols(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Semboller yüklenirken bir hata oluştu'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSymbols();

    return () => {
      mounted = false;
    };
  }, [activeOnly]);

  return { symbols, loading, error };
}

/**
 * Kripto para fiyatlarını getirir ve belirli aralıklarla günceller
 */
export function useSymbolPrices(symbols: string[] | string, refreshInterval: number = 0) {
  const [prices, setPrices] = useState<SymbolPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cryptoService.getSymbolPrices(symbols);
        if (mounted) {
          setPrices(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Fiyatlar yüklenirken bir hata oluştu'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // İlk veri çekme
    fetchPrices();

    // Düzenli güncelleme için interval ayarla
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchPrices, refreshInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [symbols, refreshInterval]);

  return { prices, loading, error };
}

/**
 * Piyasa verilerini getirir
 */
export function useMarkets(refreshInterval: number = 0) {
  const [markets, setMarkets] = useState<MarketData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchMarkets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cryptoService.getMarkets();
        if (mounted) {
          setMarkets(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Piyasa verileri yüklenirken bir hata oluştu'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // İlk veri çekme
    fetchMarkets();

    // Düzenli güncelleme için interval ayarla
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchMarkets, refreshInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refreshInterval]);

  return { markets, loading, error };
}

/**
 * Grafik verilerini getirir
 */
export function useKlines(symbol: string, interval: string = '1h', limit: number = 100) {
  const [klines, setKlines] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchKlines = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cryptoService.getKlines(symbol, { interval, limit });
        if (mounted) {
          setKlines(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Grafik verileri yüklenirken bir hata oluştu'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchKlines();

    return () => {
      mounted = false;
    };
  }, [symbol, interval, limit]);

  return { klines, loading, error };
} 