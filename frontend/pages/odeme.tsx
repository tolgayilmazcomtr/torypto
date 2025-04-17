import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Clock, Download } from 'lucide-react';

const subscriptionPlans = [
  {
    id: 1,
    name: 'Temel',
    price: 99.90,
    interval: 'ay',
    description: 'Temel kripto analiz özellikleri',
    features: [
      'Temel kripto para analizleri',
      'Günlük 5 sinyal',
      'Piyasa takibi',
      'E-posta bildirimleri',
    ],
    buttonLabel: 'Seç',
    popular: false,
  },
  {
    id: 2,
    name: 'Pro',
    price: 199.90,
    interval: 'ay',
    description: 'Gelişmiş analizler ve sinyaller',
    features: [
      'Gelişmiş teknik analizler',
      'Sınırsız sinyal erişimi',
      'Özel grafik araçları',
      'Telegram bildirimleri',
      'Öncelikli destek',
    ],
    buttonLabel: 'Seç',
    popular: true,
  },
  {
    id: 3,
    name: 'Premium',
    price: 499.90,
    interval: 'ay',
    description: 'En kapsamlı kripto deneyimi',
    features: [
      'VIP sinyal erişimi',
      'Erken uyarı sistemi',
      'Yapay zeka destekli öngörüler',
      'Profesyonel portföy yönetimi',
      'Video eğitimler ve webinarlar',
      '7/24 özel destek',
    ],
    buttonLabel: 'Seç',
    popular: false,
  },
];

const transactions = [
  {
    id: 1,
    date: '2024-04-15',
    amount: 199.90,
    status: 'completed',
    method: 'Kredi Kartı',
    description: 'Pro Aboneliği - Aylık',
  },
  {
    id: 2,
    date: '2024-03-15',
    amount: 199.90,
    status: 'completed',
    method: 'Kredi Kartı',
    description: 'Pro Aboneliği - Aylık',
  },
  {
    id: 3,
    date: '2024-02-15',
    amount: 199.90,
    status: 'completed',
    method: 'Kredi Kartı',
    description: 'Pro Aboneliği - Aylık',
  },
];

export default function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Abonelik & Ödemeler</h2>
        <p className="text-gray-500 mt-1">Abonelik planları ve ödeme geçmişi</p>
      </div>

      {/* Abonelik Planları */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Abonelik Planları</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={plan.popular ? 'border-blue-500 relative' : ''}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md">
                  Popüler
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-2xl font-bold">₺{plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={plan.popular ? 'w-full bg-blue-500 hover:bg-blue-600' : 'w-full'} 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.buttonLabel}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* İşlem Geçmişi */}
      <div>
        <h3 className="text-lg font-medium mb-4">Ödeme Geçmişi</h3>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Tarih</th>
                    <th className="text-left p-4 font-medium">Açıklama</th>
                    <th className="text-left p-4 font-medium">Tutar</th>
                    <th className="text-left p-4 font-medium">Ödeme Yöntemi</th>
                    <th className="text-left p-4 font-medium">Durum</th>
                    <th className="text-left p-4 font-medium">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="p-4">{new Date(transaction.date).toLocaleDateString('tr-TR')}</td>
                      <td className="p-4">{transaction.description}</td>
                      <td className="p-4">₺{transaction.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          {transaction.method}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Tamamlandı
                        </span>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Download className="h-4 w-4 mr-1" />
                          Fatura
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 