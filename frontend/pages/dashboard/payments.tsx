import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentsPage = () => {
  const plans = [
    {
      id: 1,
      name: 'Temel Plan',
      price: 'Ücretsiz',
      features: [
        'Temel piyasa verilerine erişim',
        'Sınırlı haber akışı',
        'Günlük 5 kripto izleme',
        'Reklamlı deneyim',
      ],
      cta: 'Mevcut Plan'
    },
    {
      id: 2,
      name: 'Premium Plan',
      price: '₺199/ay',
      features: [
        'Gelişmiş piyasa verilerine erişim',
        'Tüm haber akışına erişim',
        'Sınırsız kripto izleme',
        'Özel sinyal ve analizler',
        'Reklamsız deneyim',
        '7/24 öncelikli destek'
      ],
      cta: 'Yükselt'
    },
    {
      id: 3,
      name: 'Profesyonel Plan',
      price: '₺499/ay',
      features: [
        'Tüm Premium özellikleri',
        'API erişimi',
        'Kişiselleştirilmiş danışmanlık',
        'Özel analiz raporları',
        'VIP içerikler',
        'Erken erişim fırsatları'
      ],
      cta: 'Yükselt'
    }
  ];
  
  const transactions = [
    {
      id: 1,
      date: '15 Nisan 2024',
      description: 'Premium Plan Abonelik',
      amount: '₺199',
      status: 'Başarılı'
    },
    {
      id: 2,
      date: '15 Mart 2024',
      description: 'Premium Plan Abonelik',
      amount: '₺199',
      status: 'Başarılı'
    },
    {
      id: 3,
      date: '15 Şubat 2024',
      description: 'Premium Plan Abonelik',
      amount: '₺199',
      status: 'Başarılı'
    }
  ];
  
  return (
    <Layout title="Ödemeler - Torypto">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Abonelik ve Ödemeler</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Mevcut Abonelik</CardTitle>
            <CardDescription>
              Şu anki abonelik planınız ve detayları
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-blue-800">Temel Plan</h3>
                  <p className="text-sm text-blue-600">Sonraki yenileme: -</p>
                </div>
                <span className="text-xl font-bold text-blue-800">Ücretsiz</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-semibold">Abonelik Planları</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.id === 2 ? "border-blue-400 shadow-lg" : ""}>
              <CardHeader className={plan.id === 2 ? "bg-blue-50" : ""}>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-xl font-bold">{plan.price}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-2 rounded ${
                    plan.cta === 'Mevcut Plan' 
                      ? 'bg-gray-200 text-gray-800 cursor-default' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>İşlem Geçmişi</CardTitle>
            <CardDescription>
              Son ödeme işlemleriniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {transaction.status}
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

export default PaymentsPage; 