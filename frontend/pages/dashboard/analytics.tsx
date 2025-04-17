import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsPage = () => {
  return (
    <Layout title="Analizler - Torypto">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Kripto Para Analizleri</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Piyasa Durumu</CardTitle>
              <CardDescription>Güncel piyasa istatistikleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Toplam Piyasa Değeri:</span>
                  <span>$1.85T</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">24s Hacim:</span>
                  <span>$78.5B</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">BTC Dominance:</span>
                  <span>48.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Popüler Kriptolar</CardTitle>
              <CardDescription>Son 24 saat değişim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Bitcoin (BTC):</span>
                  <span className="text-green-600">+2.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ethereum (ETH):</span>
                  <span className="text-green-600">+3.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Binance Coin (BNB):</span>
                  <span className="text-red-600">-0.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trend Analizleri</CardTitle>
              <CardDescription>Piyasa trendleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Korku/Açgözlülük Endeksi:</span>
                  <span>62 (Açgözlülük)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Trend Yönü:</span>
                  <span className="text-green-600">Yükseliş</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Destek/Direnç:</span>
                  <span>$57,200 / $61,500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage; 