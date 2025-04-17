import React from 'react';
import { useSymbolPrice } from '../../hooks/useCrypto';

interface PriceCardProps {
  symbol: string;
  refreshInterval?: number;
  showTitle?: boolean;
}

const PriceCard: React.FC<PriceCardProps> = ({
  symbol,
  refreshInterval = 10000,
  showTitle = true,
}) => {
  const { price, loading, error, refetch } = useSymbolPrice(symbol, refreshInterval);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px]">
        <div className="animate-pulse w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 mx-auto"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !price) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <p className="text-red-500 text-center">
          {error || `${symbol} fiyatı alınamadı`}
        </p>
        <button
          onClick={refetch}
          className="mt-2 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
        >
          Yeniden Dene
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 relative">
      {/* Yenile butonu - sağ üst köşede */}
      <button
        onClick={refetch}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        title="Yenile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Sembol adı */}
      {showTitle && (
        <h3 className="text-center text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {price.symbol}
        </h3>
      )}

      {/* Fiyat değeri */}
      <p className="text-center text-2xl font-bold text-gray-900 dark:text-white">
        {typeof price.price === 'number'
          ? price.price.toLocaleString('tr-TR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })
          : price.price}
      </p>

      {/* Son güncelleme zamanı */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
        {new Date().toLocaleTimeString('tr-TR')}
      </p>
    </div>
  );
};

export default PriceCard; 