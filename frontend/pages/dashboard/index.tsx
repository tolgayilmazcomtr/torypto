import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuthContext();
  
  return (
    <Layout title="Dashboard - Torypto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Hoş Geldiniz</CardTitle>
            <CardDescription>
              Torypto Dashboard'a hoş geldiniz, {user?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Kripto analiz platformunuzun yönetim paneline giriş yaptınız.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
            <CardDescription>
              Hesap detaylarınız
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">İsim:</span>
                <span>{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">E-posta:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Rol:</span>
                <span className="capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Durum:</span>
                <span className="capitalize">{user?.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
            <CardDescription>
              Sık kullanılan işlevler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Profil Ayarları
            </button>
            <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Piyasa Durumu
            </button>
            <button className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
              Sinyaller
            </button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage; 