import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  logoUrl?: string;
}

interface CryptoListProps {
  cryptos: Crypto[];
  title?: string;
}

const CryptoItem: React.FC<{ crypto: Crypto }> = ({ crypto }) => {
  const isPositive = crypto.change24h >= 0;
  
  return (
    <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent/20">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
          {crypto.logoUrl ? (
            <img src={crypto.logoUrl} alt={crypto.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
          )}
        </div>
        <div>
          <div className="font-medium">{crypto.symbol}</div>
          <div className="text-xs text-muted-foreground">{crypto.name}</div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-medium">${crypto.price.toLocaleString('tr-TR')}</div>
        <div className={`flex items-center text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? (
            <ArrowUpIcon className="mr-1 h-3 w-3" />
          ) : (
            <ArrowDownIcon className="mr-1 h-3 w-3" />
          )}
          {Math.abs(crypto.change24h).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

const CryptoList: React.FC<CryptoListProps> = ({ cryptos, title = "Popüler Kripto Paralar" }) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="p-2">
        {cryptos.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Kripto para bulunamadı.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {cryptos.map((crypto) => (
              <CryptoItem key={crypto.id} crypto={crypto} />
            ))}
          </div>
        )}
      </div>
      
      {cryptos.length > 0 && (
        <div className="border-t p-4 text-center">
          <button className="text-sm font-medium text-primary hover:underline">
            Tüm Kripto Paraları Gör
          </button>
        </div>
      )}
    </div>
  );
};

export default CryptoList; 