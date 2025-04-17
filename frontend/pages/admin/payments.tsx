import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Search, Filter, Eye, RefreshCw, Plus } from 'lucide-react';

// Örnek ödeme verileri
const transactionsData = [
  {
    id: 'TRX123456',
    date: '2024-04-20',
    user: {
      id: 'USR12345',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
    },
    amount: 199.90,
    method: 'Kredi Kartı',
    planName: 'Pro Plan',
    status: 'Başarılı',
  },
  {
    id: 'TRX123457',
    date: '2024-04-19',
    user: {
      id: 'USR12346',
      name: 'Mehmet Demir',
      email: 'mehmet@example.com',
    },
    amount: 99.90,
    method: 'Havale',
    planName: 'Temel Plan',
    status: 'Başarılı',
  },
  {
    id: 'TRX123458',
    date: '2024-04-18',
    user: {
      id: 'USR12347',
      name: 'Ayşe Kaya',
      email: 'ayse@example.com',
    },
    amount: 499.90,
    method: 'Kredi Kartı',
    planName: 'Premium Plan',
    status: 'Başarılı',
  },
  {
    id: 'TRX123459',
    date: '2024-04-17',
    user: {
      id: 'USR12348',
      name: 'Can Öztürk',
      email: 'can@example.com',
    },
    amount: 199.90,
    method: 'Kredi Kartı',
    planName: 'Pro Plan',
    status: 'Başarısız',
  },
  {
    id: 'TRX123460',
    date: '2024-04-16',
    user: {
      id: 'USR12349',
      name: 'Zeynep Şahin',
      email: 'zeynep@example.com',
    },
    amount: 199.90,
    method: 'Kredi Kartı',
    planName: 'Pro Plan',
    status: 'İade Edildi',
  },
];

// Örnek abonelik planları
const subscriptionPlans = [
  {
    id: 1,
    name: 'Temel Plan',
    price: 99.90,
    interval: 'Aylık',
    features: [
      'Temel kripto para analizleri',
      'Günlük 5 sinyal',
      'Piyasa takibi',
    ],
    subscribers: 234,
    revenue: 23375.6,
  },
  {
    id: 2,
    name: 'Pro Plan',
    price: 199.90,
    interval: 'Aylık',
    features: [
      'Gelişmiş teknik analizler',
      'Sınırsız sinyal erişimi',
      'Özel grafik araçları',
      'Telegram bildirimleri',
    ],
    subscribers: 456,
    revenue: 91154.4,
    popular: true,
  },
  {
    id: 3,
    name: 'Premium Plan',
    price: 499.90,
    interval: 'Aylık',
    features: [
      'VIP sinyal erişimi',
      'Yapay zeka destekli öngörüler',
      'Profesyonel portföy yönetimi',
      '7/24 özel destek',
    ],
    subscribers: 127,
    revenue: 63487.3,
  },
];

export default function AdminPaymentsPage() {
  const [currentTab, setCurrentTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('hepsi');
  
  // Filtreleme işlemleri
  const filteredTransactions = transactionsData.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'hepsi' ? true : tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ödeme Yönetimi</h1>
          <p className="text-gray-500">Ödemeleri ve abonelik planlarını yönetin</p>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="transactions">İşlemler</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonelik Planları</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* İşlemler Tabı */}
      {currentTab === 'transactions' && (
        <>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="ID, kullanıcı adı veya e-posta ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{statusFilter === 'hepsi' ? 'Durum Filtresi' : statusFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hepsi">Tüm Durumlar</SelectItem>
                  <SelectItem value="Başarılı">Başarılı</SelectItem>
                  <SelectItem value="Başarısız">Başarısız</SelectItem>
                  <SelectItem value="İade Edildi">İade Edildi</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => {
                setSearchTerm('');
                setStatusFilter('hepsi');
              }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>İşlem Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-4 font-medium">İŞLEM ID</th>
                      <th className="p-4 font-medium">TARİH</th>
                      <th className="p-4 font-medium">KULLANICI</th>
                      <th className="p-4 font-medium">TUTAR</th>
                      <th className="p-4 font-medium">ÖDEME YÖNTEMİ</th>
                      <th className="p-4 font-medium">PLAN</th>
                      <th className="p-4 font-medium">DURUM</th>
                      <th className="p-4 font-medium">İŞLEMLER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b">
                        <td className="p-4 font-medium">{tx.id}</td>
                        <td className="p-4">{tx.date}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{tx.user.name}</p>
                            <p className="text-sm text-gray-500">{tx.user.email}</p>
                          </div>
                        </td>
                        <td className="p-4">₺{tx.amount.toFixed(2)}</td>
                        <td className="p-4">{tx.method}</td>
                        <td className="p-4">{tx.planName}</td>
                        <td className="p-4">
                          <Badge 
                            className={
                              tx.status === 'Başarılı' 
                                ? 'bg-green-100 text-green-800' 
                                : tx.status === 'Başarısız' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-gray-500">
                          Arama kriteriyle eşleşen işlem bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Abonelik Planları Tabı */}
      {currentTab === 'subscriptions' && (
        <>
          <div className="flex justify-end mb-6">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Yeni Plan Ekle
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map(plan => (
              <Card key={plan.id} className={plan.popular ? "border-blue-500" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-2xl font-semibold">₺{plan.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/{plan.interval}</span>
                      </div>
                    </div>
                    {plan.popular && (
                      <Badge className="bg-blue-500">Popüler</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Aboneler:</span>
                      <span className="font-medium">{plan.subscribers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Aylık Gelir:</span>
                      <span className="font-medium">₺{plan.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-x-2 flex">
                    <Button variant="outline" className="flex-1">Düzenle</Button>
                    <Button variant="outline" className="flex-1">İstatistikler</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 