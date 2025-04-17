import React, { useState, useEffect } from 'react';
import { useSymbolPrices } from '../../hooks/useCrypto';
import { SymbolPrice } from '../../types/api';

interface PriceListProps {
  symbols?: string[];
  title?: string;
  refreshInterval?: number;
}

const PriceList: React.FC<PriceListProps> = ({
  symbols,
  title = 'Kripto Para Fiyatları',
  refreshInterval = 10000,
}) => {
  const { prices, loading, error, refetch } = useSymbolPrices(symbols, refreshInterval);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'symbol',
    direction: 'asc',
  });

  // Sıralama fonksiyonu
  const sortedPrices = React.useMemo(() => {
    const sortablePrices = [...prices];
    if (sortConfig.key) {
      sortablePrices.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePrices;
  }, [prices, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        <button
          onClick={() => refetch()}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Yenile
        </button>
      </div>

      {loading && <p className="text-center py-4">Yükleniyor...</p>}
      
      {error && (
        <p className="text-red-500 text-center py-4">
          Hata: {error}
        </p>
      )}

      {!loading && !error && prices.length === 0 && (
        <p className="text-center py-4">Veri bulunamadı</p>
      )}

      {!loading && !error && prices.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('symbol')}
                >
                  Sembol
                  {sortConfig.key === 'symbol' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('price')}
                >
                  Fiyat
                  {sortConfig.key === 'price' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedPrices.map((item: SymbolPrice) => (
                <tr key={item.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">
                    {typeof item.price === 'number' 
                      ? item.price.toLocaleString('tr-TR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })
                      : item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PriceList; 