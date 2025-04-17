import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trash, Archive } from 'lucide-react';

const messages = [
  {
    id: 1,
    sender: 'Sistem',
    subject: 'Hoş Geldiniz',
    content: 'Torypto platformuna hoş geldiniz! Kripto para analiz ve takip platformumuzu kullanmaya başlayabilirsiniz.',
    date: '2024-04-15',
    read: true,
  },
  {
    id: 2,
    sender: 'Destek Ekibi',
    subject: 'Hesabınız Onaylandı',
    content: 'Hesabınız başarıyla onaylandı. Tüm özelliklere erişebilirsiniz.',
    date: '2024-04-14',
    read: true,
  },
  {
    id: 3,
    sender: 'Bildirim',
    subject: 'Yeni Sinyal Eklendi',
    content: 'Takip ettiğiniz bir kripto para için yeni bir sinyal eklendi. Detaylar için sinyal sayfasını kontrol edin.',
    date: '2024-04-13',
    read: false,
  },
  {
    id: 4,
    sender: 'Torypto Ekibi',
    subject: 'Yeni Özellikler',
    content: 'Platformumuza yeni özellikler ekledik. Yeni analiz araçlarını ve gelişmiş sinyal takip sistemini keşfedin.',
    date: '2024-04-12',
    read: false,
  },
];

export default function MessagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Mesajlar</h2>
        <p className="text-gray-500 mt-1">Sistem mesajları ve bildirimler</p>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id} className={message.read ? 'bg-white' : 'bg-blue-50'}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{message.subject}</CardTitle>
                    {!message.read && (
                      <Badge variant="default" className="bg-blue-500">Yeni</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {message.sender} • {new Date(message.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{message.content}</p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  Detaylar <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 