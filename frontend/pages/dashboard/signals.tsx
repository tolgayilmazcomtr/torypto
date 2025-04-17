import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SignalsPage = () => {
  const signals = [
    {
      id: 1,
      crypto: 'Bitcoin (BTC)',
      type: 'Alım',
      price: '$61,250',
      target: '$65,000',
      stopLoss: '$58,500',
      date: '18 Nisan 2024',
      status: 'active'
    },
    {
      id: 2,
      crypto: 'Ethereum (ETH)',
      type: 'Alım',
      price: '$3,050',
      target: '$3,300',
      stopLoss: '$2,900',
      date: '17 Nisan 2024',
      status: 'active'
    },
    {
      id: 3,
      crypto: 'Solana (SOL)',
      type: 'Satım',
      price: '$145',
      target: '$130',
      stopLoss: '$155',
      date: '16 Nisan 2024',
      status: 'closed'
    }
  ];
  
  return (
    <Layout title="Sinyal Takibi - Torypto">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Sinyal Takibi</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Aktif Sinyaller</CardTitle>
            <CardDescription>
              Şu anda aktif olan kripto para sinyalleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kripto Para
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlem Tipi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giriş Fiyatı
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hedef
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stop Loss
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {signals.map((signal) => (
                    <tr key={signal.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{signal.crypto}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${signal.type === 'Alım' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {signal.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {signal.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {signal.target}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {signal.stopLoss}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {signal.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${signal.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {signal.status === 'active' ? 'Aktif' : 'Kapandı'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SignalsPage; 