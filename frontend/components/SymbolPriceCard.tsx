import React from 'react';
import { Card, CardContent } from './ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface SymbolPriceCardProps {
  symbol: string;
  price: string;
  priceChangePercent: string;
  lastUpdate?: Date;
  className?: string;
}

export function SymbolPriceCard({
  symbol,
  price,
  priceChangePercent,
  lastUpdate,
  className,
}: SymbolPriceCardProps) {
  const isPositive = !priceChangePercent.startsWith('-');
  const changePercent = parseFloat(priceChangePercent);
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg">{symbol}</div>
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium rounded-full px-2 py-0.5',
            isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                         'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          )}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(changePercent).toFixed(2)}%
          </div>
        </div>
        
        <div className="mt-2 text-2xl font-bold">
          {parseFloat(price).toLocaleString('tr-TR', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
          })}
        </div>
        
        {lastUpdate && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SymbolPriceCard; 