import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  LineChart, 
  Wallet, 
  Settings, 
  Bell, 
  MessageSquare,
  Coins
} from 'lucide-react';

const AdminDashboard = () => {
  const menuItems = [
    {
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları görüntüle, düzenle ve yönet',
      icon: <Users className="h-8 w-8" />,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Sembol Yönetimi',
      description: 'Kripto, forex ve hisse sembollerini yönet',
      icon: <Coins className="h-8 w-8" />,
      href: '/admin/symbols',
      color: 'bg-purple-500'
    },
    {
      title: 'Analiz Yönetimi',
      description: 'Piyasa analizlerini görüntüle ve yönet',
      icon: <LineChart className="h-8 w-8" />,
      href: '/admin/analytics',
      color: 'bg-green-500'
    },
    {
      title: 'Ödeme Yönetimi',
      description: 'Ödemeleri ve abonelikleri yönet',
      icon: <Wallet className="h-8 w-8" />,
      href: '/admin/payments',
      color: 'bg-yellow-500'
    },
    {
      title: 'Bildirim Yönetimi',
      description: 'Bildirimleri görüntüle ve yönet',
      icon: <Bell className="h-8 w-8" />,
      href: '/admin/notifications',
      color: 'bg-red-500'
    },
    {
      title: 'Mesaj Yönetimi',
      description: 'Kullanıcı mesajlarını yönet',
      icon: <MessageSquare className="h-8 w-8" />,
      href: '/admin/messages',
      color: 'bg-indigo-500'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Sistem ayarlarını yapılandır',
      icon: <Settings className="h-8 w-8" />,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <p className="text-gray-500 mt-2">
          Tüm sistem yönetimi için gerekli araçlar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                  {item.icon}
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Yönet
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 