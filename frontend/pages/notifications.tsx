import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Clock, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

// Örnek bildirim verileri
const notifications = [
  {
    id: '1',
    type: 'PRICE_ALERT',
    title: 'Bitcoin %5 yükseldi',
    description: 'BTC son 24 saatte %5\'den fazla yükseldi.',
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    date: '2023-04-20T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'SYSTEM',
    title: 'Profil bilgilerinizi güncelleyin',
    description: 'Güvenliğiniz için hesap bilgilerinizi güncellemenizi öneririz.',
    icon: <Bell className="h-5 w-5 text-blue-500" />,
    date: '2023-04-19T14:45:00Z',
    read: true,
  },
  {
    id: '3',
    type: 'PRICE_ALERT',
    title: 'Ethereum %3 düştü',
    description: 'ETH son 24 saatte %3\'ten fazla düştü.',
    icon: <TrendingDown className="h-5 w-5 text-red-500" />,
    date: '2023-04-18T08:15:00Z',
    read: false,
  },
  {
    id: '4',
    type: 'TRADE',
    title: 'Alım emriniz gerçekleşti',
    description: '0.5 ETH alım emriniz başarıyla gerçekleşti.',
    icon: <Check className="h-5 w-5 text-green-500" />,
    date: '2023-04-15T16:20:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'SYSTEM',
    title: 'Bakım duyurusu',
    description: 'Yarın 03:00-05:00 saatleri arasında planlı bakım çalışması yapılacaktır.',
    icon: <Clock className="h-5 w-5 text-orange-500" />,
    date: '2023-04-10T11:10:00Z',
    read: true,
  },
];

const NotificationsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [notificationsList, setNotificationsList] = useState(notifications);
  
  // Bildirimleri filtrele
  const filteredNotifications = notificationsList.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type.toLowerCase() === activeTab.toLowerCase();
  });

  // Okundu olarak işaretle
  const markAsRead = (id: string) => {
    setNotificationsList(
      notificationsList.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Bildirimi sil
  const deleteNotification = (id: string) => {
    setNotificationsList(
      notificationsList.filter(notification => notification.id !== id)
    );
  };
  
  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = () => {
    setNotificationsList(
      notificationsList.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <>
      <Head>
        <title>Bildirimler - Torypto</title>
        <meta name="description" content="Bildirimlerinizi takip edin" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              Bildirimler
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Hesabınızla ilgili güncellemeleri ve bildirimleri takip edin
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tümünü Okundu İşaretle
            </Button>
          </div>
        </div>

        {/* Ana İçerik Kartı */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Bildirimleriniz</CardTitle>
              
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="all">Tümü</TabsTrigger>
                  <TabsTrigger value="unread">Okunmamış</TabsTrigger>
                  <TabsTrigger value="price_alert">Fiyat Uyarıları</TabsTrigger>
                  <TabsTrigger value="system">Sistem</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Bildirim Yok</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
                  Bu kategoride bildiriminiz bulunmamaktadır. Yeni bildirimler geldiğinde burada görünecektir.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`px-4 py-4 flex items-start ${
                      notification.read ? 'opacity-70' : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${notification.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(notification.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.description}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                          >
                            Okundu Olarak İşaretle
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NotificationsPage; 