import React from 'react';
import { SymbolPriceCard } from './SymbolPriceCard';
import useSymbolPrices from '../hooks/useSymbolPrices';
import { Skeleton } from './ui/skeleton';

interface SymbolPriceListProps {
  symbols?: string[];
  refreshInterval?: number;
  className?: string;
}

export function SymbolPriceList({
  symbols,
  refreshInterval = 5000,
  className,
}: SymbolPriceListProps) {
  const [prices, loading, error] = useSymbolPrices(refreshInterval);
  
  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p>Hata: {error}</p>
      </div>
    );
  }

  const filteredPrices = symbols && symbols.length > 0
    ? prices.filter(price => symbols.includes(price.symbol))
    : prices;

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">Kripto Para Fiyatları</h2>
      
      {loading && prices.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrices.map((price) => (
            <SymbolPriceCard
              key={price.symbol}
              symbol={price.symbol}
              price={price.price}
              priceChangePercent={price.priceChangePercent}
              lastUpdate={new Date()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SymbolPriceList; 