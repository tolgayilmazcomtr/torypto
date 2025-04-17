import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Plus, PieChart } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';

// Örnek portföy verileri
const portfolioData = {
  totalValue: 15420.58,
  changePercent: 8.3,
  holdings: [
    { id: '1', symbol: 'BTC', name: 'Bitcoin', amount: 0.125, value: 8250.45, changePercent: 12.5 },
    { id: '2', symbol: 'ETH', name: 'Ethereum', amount: 2.35, value: 4960.80, changePercent: 5.7 },
    { id: '3', symbol: 'SOL', name: 'Solana', amount: 15.5, value: 1280.50, changePercent: -3.2 },
    { id: '4', symbol: 'AVAX', name: 'Avalanche', amount: 10.25, value: 368.45, changePercent: 9.8 },
    { id: '5', symbol: 'DOT', name: 'Polkadot', amount: 45.8, value: 560.38, changePercent: -1.5 },
  ],
  transactions: [
    { id: '1', type: 'BUY', symbol: 'BTC', amount: 0.05, price: 65800, value: 3290, date: '2023-04-15T10:30:00Z' },
    { id: '2', type: 'SELL', symbol: 'ETH', amount: 1.2, price: 3450, value: 4140, date: '2023-04-12T14:45:00Z' },
    { id: '3', type: 'BUY', symbol: 'SOL', amount: 10, price: 125, value: 1250, date: '2023-04-10T08:15:00Z' },
    { id: '4', type: 'BUY', symbol: 'ETH', amount: 0.5, price: 3350, value: 1675, date: '2023-04-05T16:20:00Z' },
    { id: '5', type: 'SELL', symbol: 'DOT', amount: 15, price: 12.35, value: 185.25, date: '2023-04-01T11:10:00Z' },
  ]
};

const PortfolioPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<string>('holdings');
  
  return (
    <>
      <Head>
        <title>Portföyüm - Torypto</title>
        <meta name="description" content="Kripto para portföyünüzü takip edin" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              Portföyüm
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kripto para varlıklarınızı ve işlemlerinizi takip edin
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline">
              <PieChart className="h-4 w-4 mr-2" />
              Analiz
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Varlık Ekle
            </Button>
          </div>
        </div>

        {/* Portföy Özeti Kartı */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Toplam Portföy Değeri
                </h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">
                    {formatCurrency(portfolioData.totalValue, 'USD')}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  24 Saatlik Değişim
                </h3>
                <div className="mt-2 flex items-center">
                  <span className={`text-2xl font-bold ${
                    portfolioData.changePercent >= 0 
                      ? 'text-green-600 dark:text-green-500' 
                      : 'text-red-600 dark:text-red-500'
                  }`}>
                    {portfolioData.changePercent > 0 ? '+' : ''}
                    {formatPercent(portfolioData.changePercent / 100)}
                  </span>
                  {portfolioData.changePercent >= 0 
                    ? <ArrowUpRight className="ml-2 h-5 w-5 text-green-600 dark:text-green-500" /> 
                    : <ArrowDownRight className="ml-2 h-5 w-5 text-red-600 dark:text-red-500" />
                  }
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Toplam Varlık Sayısı
                </h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold">
                    {portfolioData.holdings.length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ana İçerik Kartı */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Portföy Detayları</CardTitle>
              
              <Tabs 
                defaultValue="holdings" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-2 w-full sm:w-auto">
                  <TabsTrigger value="holdings">Varlıklar</TabsTrigger>
                  <TabsTrigger value="transactions">İşlemler</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            {activeTab === 'holdings' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-4 px-4 font-medium">Varlık</th>
                      <th className="text-right py-4 px-4 font-medium">Miktar</th>
                      <th className="text-right py-4 px-4 font-medium">Değer</th>
                      <th className="text-right py-4 px-4 font-medium">Değişim</th>
                      <th className="text-right py-4 px-4 font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.holdings.map((asset) => {
                      const isPositive = asset.changePercent >= 0;
                      
                      return (
                        <tr key={asset.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-bold">{asset.symbol}</span>
                              </div>
                              <div>
                                <div className="font-medium">{asset.symbol}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{asset.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {asset.amount.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {formatCurrency(asset.value, 'USD')}
                          </td>
                          <td className={`py-4 px-4 text-right font-medium ${
                            isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                          }`}>
                            {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button size="sm" variant="outline">İşlem</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-4 px-4 font-medium">Tarih</th>
                      <th className="text-left py-4 px-4 font-medium">İşlem</th>
                      <th className="text-left py-4 px-4 font-medium">Varlık</th>
                      <th className="text-right py-4 px-4 font-medium">Miktar</th>
                      <th className="text-right py-4 px-4 font-medium">Fiyat</th>
                      <th className="text-right py-4 px-4 font-medium">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.transactions.map((tx) => {
                      const txDate = new Date(tx.date);
                      const isBuy = tx.type === 'BUY';
                      
                      return (
                        <tr key={tx.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                            {txDate.toLocaleDateString('tr-TR')}
                          </td>
                          <td className={`py-4 px-4 font-medium ${
                            isBuy ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                          }`}>
                            {tx.type}
                          </td>
                          <td className="py-4 px-4 font-medium">
                            {tx.symbol}
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {tx.amount.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {formatCurrency(tx.price, 'USD')}
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {formatCurrency(tx.value, 'USD')}
                          </td>
                        </tr>
                      );
                    })}
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

export default PortfolioPage; 