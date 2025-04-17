import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SymbolPrice } from '@/types/api';

interface CryptoItemProps {
  crypto: {
    symbol: string;
    name?: string;
    price: number;
    change24h?: number;
    logoUrl?: string;
  };
}

interface CryptoListProps {
  cryptos: SymbolPrice[];
  loading: boolean;
  error?: Error | null;
  title?: string;
  onViewAll?: () => void;
}

const CryptoItem: React.FC<CryptoItemProps> = ({ crypto }) => {
  // İsim ve symbol ayrıştırma
  const symbol = crypto.symbol;
  const name = crypto.name || symbol;
  const baseAsset = symbol.replace(/USDT|BTC|ETH|BNB|BUSD/g, '');
  const isPositive = (crypto.change24h || 0) >= 0;
  
  return (
    <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent/20">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
          {crypto.logoUrl ? (
            <img src={crypto.logoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold">{baseAsset.substring(0, 2)}</span>
          )}
        </div>
        <div>
          <div className="font-medium">{baseAsset}</div>
          <div className="text-xs text-muted-foreground">{name}</div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-medium">${crypto.price.toLocaleString('tr-TR')}</div>
        {crypto.change24h !== undefined && (
          <div className={`flex items-center text-xs ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
            {isPositive ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3" />
            )}
            {Math.abs(crypto.change24h).toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
};

const CryptoList: React.FC<CryptoListProps> = ({ 
  cryptos, 
  loading, 
  error, 
  title = "Popüler Kripto Paralar",
  onViewAll
}) => {
  // Loading durumu
  if (loading) {
    return (
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex h-48 items-center justify-center">
          <Spinner size="md" text="Kripto paralar yükleniyor..." />
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>
              {error.message || 'Kripto para bilgileri yüklenirken bir hata oluştu.'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Veri yoksa
  if (cryptos.length === 0) {
    return (
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="py-8 text-center text-muted-foreground">
          <p>Kripto para bulunamadı.</p>
        </div>
      </div>
    );
  }

  // Veri varsa
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="p-2">
        <div className="divide-y divide-border">
          {cryptos.map((crypto) => (
            <CryptoItem 
              key={crypto.symbol} 
              crypto={{
                symbol: crypto.symbol,
                name: crypto.symbol.replace(/USDT|BTC|ETH|BNB|BUSD/g, ''),
                price: typeof crypto.price === 'string' ? parseFloat(crypto.price) : crypto.price,
                // TODO: change24h API'den alınmalı
                change24h: Math.random() * 10 - 3 // Geçici olarak rastgele değer
              }} 
            />
          ))}
        </div>
      </div>
      
      {onViewAll && (
        <div className="border-t p-4 text-center">
          <button 
            className="text-sm font-medium text-primary hover:underline"
            onClick={onViewAll}
          >
            Tüm Kripto Paraları Gör
          </button>
        </div>
      )}
    </div>
  );
};

export default CryptoList; 