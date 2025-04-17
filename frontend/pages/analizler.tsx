import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalizlerPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Kripto Para Analizleri</h1>
        <p className="text-gray-500 mt-2">
          Güncel piyasa durumu ve teknik analizler
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Piyasa Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Toplam Piyasa Değeri:</span>
                <span className="font-medium">$1.85T</span>
              </div>
              <div className="flex justify-between">
                <span>24s Hacim:</span>
                <span className="font-medium">$78.5B</span>
              </div>
              <div className="flex justify-between">
                <span>BTC Dominance:</span>
                <span className="font-medium">48.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popüler Kriptolar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bitcoin (BTC):</span>
                <span className="text-green-500">+2.4%</span>
              </div>
              <div className="flex justify-between">
                <span>Ethereum (ETH):</span>
                <span className="text-green-500">+3.1%</span>
              </div>
              <div className="flex justify-between">
                <span>Binance Coin (BNB):</span>
                <span className="text-red-500">-0.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend Analizleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Korku/Açgözlülük Endeksi:</span>
                <span className="font-medium">62 (Açgözlülük)</span>
              </div>
              <div className="flex justify-between">
                <span>Trend Yönü:</span>
                <span className="text-green-500">Yükseliş</span>
              </div>
              <div className="flex justify-between">
                <span>Destek/Direnç:</span>
                <span className="font-medium">$57,200 / $61,500</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diğer analiz bileşenleri buraya eklenebilir */}
    </div>
  );
} 