import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MessagesPage = () => {
  const messages = [
    {
      id: 1,
      from: 'Sistem',
      subject: 'Hoş Geldiniz',
      content: 'Torypto platformuna hoş geldiniz. Platformumuzda kripto para analiz ve sinyallerimizden faydalanabilirsiniz.',
      date: '18 Nisan 2024, 10:30',
      read: true
    },
    {
      id: 2,
      from: 'Destek Ekibi',
      subject: 'Premium Üyelik Bilgisi',
      content: 'Premium üyelik avantajları hakkında bilgi almak ister misiniz? Size özel fırsatlarımız var.',
      date: '17 Nisan 2024, 14:45',
      read: false
    },
    {
      id: 3,
      from: 'Analiz Ekibi',
      subject: 'Bitcoin Analizi',
      content: 'Son Bitcoin analizimiz yayınlandı. Detaylı teknik ve temel analiz için kontrol edebilirsiniz.',
      date: '16 Nisan 2024, 09:15',
      read: false
    }
  ];
  
  return (
    <Layout title="Mesajlar - Torypto">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mesajlar</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Gelen Kutusu</CardTitle>
            <CardDescription>
              Platform mesajlarınız ve duyurular
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 border rounded-lg ${message.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{message.subject}</h3>
                      <p className="text-sm text-gray-500">
                        <span>Gönderen: {message.from}</span> · <span>{message.date}</span>
                      </p>
                    </div>
                    {!message.read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Yeni
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      Arşivle
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Yanıtla
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MessagesPage; 