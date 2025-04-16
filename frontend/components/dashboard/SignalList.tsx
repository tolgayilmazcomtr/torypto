import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  takeProfit: number;
  stopLoss: number;
  timestamp: string;
  confidence: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface SignalListProps {
  signals: Signal[];
  title?: string;
}

const SignalCard: React.FC<{ signal: Signal }> = ({ signal }) => {
  const isBuy = signal.type === 'BUY';
  const statusClass = 
    signal.status === 'COMPLETED' 
      ? 'bg-success/10 text-success'
      : signal.status === 'CANCELLED'
      ? 'bg-destructive/10 text-destructive' 
      : 'bg-warning/10 text-warning';
  
  const profitPercentage = isBuy 
    ? ((signal.takeProfit - signal.price) / signal.price) * 100
    : ((signal.price - signal.takeProfit) / signal.price) * 100;
  
  const lossPercentage = isBuy
    ? ((signal.price - signal.stopLoss) / signal.price) * 100
    : ((signal.stopLoss - signal.price) / signal.price) * 100;
  
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isBuy ? 'bg-success/20' : 'bg-destructive/20'}`}>
            {isBuy ? (
              <ArrowUpIcon className="h-4 w-4 text-success" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-destructive" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{signal.symbol}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(signal.timestamp).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
        <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
          {signal.status === 'ACTIVE' ? 'Aktif' : signal.status === 'COMPLETED' ? 'Tamamlandı' : 'İptal'}
        </div>
      </div>
      
      <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Giriş Fiyatı</p>
          <p className="font-medium">${signal.price.toLocaleString('tr-TR')}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Hedef</p>
          <p className="font-medium text-success">
            ${signal.takeProfit.toLocaleString('tr-TR')}
            <span className="ml-1 text-xs">+{profitPercentage.toFixed(2)}%</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Stop</p>
          <p className="font-medium text-destructive">
            ${signal.stopLoss.toLocaleString('tr-TR')}
            <span className="ml-1 text-xs">-{lossPercentage.toFixed(2)}%</span>
          </p>
        </div>
      </div>
      
      <div className="mt-2 flex items-center">
        <div className="mr-2 h-2.5 w-2.5 rounded-full bg-primary"></div>
        <div className="text-xs text-muted-foreground">
          Güven: <span className="font-medium">{signal.confidence}%</span>
        </div>
      </div>
    </div>
  );
};

const SignalList: React.FC<SignalListProps> = ({ signals, title = "Son Sinyaller" }) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="p-4">
        {signals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Henüz sinyal bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </div>
      
      {signals.length > 0 && (
        <div className="border-t p-4 text-center">
          <button className="text-sm font-medium text-primary hover:underline">
            Tüm Sinyalleri Gör
          </button>
        </div>
      )}
    </div>
  );
};

export default SignalList; 