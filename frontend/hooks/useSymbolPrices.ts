import { useState, useEffect } from 'react';
import axios from 'axios';

interface SymbolPrice {
  symbol: string;
  price: string;
  priceChangePercent: string;
  lastUpdate: Date;
}

export function useSymbolPrices(symbols: string[] = [], interval = 5000) {
  const [prices, setPrices] = useState<SymbolPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchPrices = async () => {
      if (!symbols.length) return;
      
      try {
        setLoading(true);
        const response = await axios.get('/api/crypto/prices', {
          params: { symbols: symbols.join(',') }
        });
        
        if (isMounted) {
          setPrices(response.data.map((item: any) => ({
            symbol: item.symbol,
            price: item.price,
            priceChangePercent: item.priceChangePercent || '0.00',
            lastUpdate: new Date()
          })));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fiyat bilgisi alınırken hata oluştu:', err);
          setError('Fiyat bilgisi alınamadı');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          timeoutId = setTimeout(fetchPrices, interval);
        }
      }
    };

    fetchPrices();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [symbols, interval]);

  return { prices, loading, error };
}

export default useSymbolPrices; 