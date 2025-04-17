import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useSymbolPrices } from '@/hooks/useCrypto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatNumber } from '@/lib/utils';

const MarketPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Bu listeyi gerçek uygulama için genişletin
  const popularCoins = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'AVAXUSDT'];
  const { prices, loading, error } = useSymbolPrices(popularCoins, 10000);

  // Filtrele ve sırala
  const filteredPrices = prices
    ? prices.filter(coin => {
        // Arama filtresi
        const matchesSearch = searchQuery.trim() === '' || 
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Tab filtresi
        const matchesTab = activeTab === 'all' || 
          (activeTab === 'gainers' && parseFloat(coin.priceChangePercent) > 0) ||
          (activeTab === 'losers' && parseFloat(coin.priceChangePercent) < 0);
        
        return matchesSearch && matchesTab;
      })
    : [];
  
  return (
    <>
      <Head>
        <title>Kripto Para Piyasası - Torypto</title>
        <meta name="description" content="En güncel kripto para fiyatları ve piyasa bilgileri" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              Kripto Para Piyasası
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              En güncel kripto para fiyatları ve piyasa bilgileri
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Kripto para ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Kripto Para Listesi</CardTitle>
              
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="all">Tümü</TabsTrigger>
                  <TabsTrigger value="gainers">Yükselenler</TabsTrigger>
                  <TabsTrigger value="losers">Düşenler</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" text="Veriler yükleniyor..." />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Kripto para verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-4 px-4 font-medium">#</th>
                      <th className="text-left py-4 px-4 font-medium">Kripto</th>
                      <th className="text-right py-4 px-4 font-medium">Fiyat</th>
                      <th className="text-right py-4 px-4 font-medium">24s Değişim</th>
                      <th className="text-right py-4 px-4 font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrices.length > 0 ? (
                      filteredPrices.map((coin, index) => {
                        const price = parseFloat(coin.price);
                        const changePercent = parseFloat(coin.priceChangePercent);
                        const isPositive = changePercent >= 0;
                        
                        return (
                          <tr key={coin.symbol} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{index + 1}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-xs font-bold">{coin.symbol.substring(0, 2)}</span>
                                </div>
                                <div>
                                  <div className="font-medium">{coin.symbol.replace('USDT', '')}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{coin.symbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              ${formatNumber(price, 2)}
                            </td>
                            <td className={`py-4 px-4 text-right font-medium ${
                              isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                            }`}>
                              {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Button size="sm" variant="outline">Detay</Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          Kripto para bulunamadı. Arama kriterlerinizi değiştirmeyi deneyin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MarketPage; 