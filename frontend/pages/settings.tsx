import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SettingsPage: NextPage = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [saved, setSaved] = useState(false);

  // Örnek kullanıcı verileri
  const [formData, setFormData] = useState({
    fullName: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    username: 'ahmetyilmaz',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'tr',
    currency: 'TRY',
    notifications: {
      email: true,
      price: true,
      security: true,
      marketing: false,
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada gerçek bir API çağrısı yapılacak
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Head>
        <title>Ayarlar - Torypto</title>
        <meta name="description" content="Hesap ayarlarınızı yönetin" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              Ayarlar
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Hesap ayarlarınızı ve tercihlerinizi yönetin
            </p>
          </div>
        </div>

        {saved && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-200">
              Ayarlarınız başarıyla kaydedildi.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <Tabs 
                  orientation="vertical"
                  defaultValue="profile" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto space-y-1">
                    <TabsTrigger value="profile" className="justify-start">Profil</TabsTrigger>
                    <TabsTrigger value="security" className="justify-start">Güvenlik</TabsTrigger>
                    <TabsTrigger value="preferences" className="justify-start">Tercihler</TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start">Bildirimler</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'profile' && 'Profil Bilgileri'}
                  {activeTab === 'security' && 'Güvenlik Ayarları'}
                  {activeTab === 'preferences' && 'Uygulama Tercihleri'}
                  {activeTab === 'notifications' && 'Bildirim Ayarları'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'profile' && 'Kişisel bilgilerinizi güncelleyin'}
                  {activeTab === 'security' && 'Hesap güvenliğinizi yönetin'}
                  {activeTab === 'preferences' && 'Görünüm ve dil tercihlerinizi değiştirin'}
                  {activeTab === 'notifications' && 'Bildirim tercihlerinizi ayarlayın'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {/* Profil Ayarları */}
                  {activeTab === 'profile' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Ad Soyad</Label>
                          <Input 
                            id="fullName" 
                            name="fullName" 
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-posta</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <Input 
                          id="username" 
                          name="username" 
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Güvenlik Ayarları */}
                  {activeTab === 'security' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                        <Input 
                          id="currentPassword" 
                          name="currentPassword" 
                          type="password" 
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Yeni Şifre</Label>
                          <Input 
                            id="newPassword" 
                            name="newPassword" 
                            type="password" 
                            value={formData.newPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                          <Input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Uygulama Tercihleri */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Dil</Label>
                          <Select 
                            value={formData.language} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                          >
                            <SelectTrigger id="language">
                              <SelectValue placeholder="Dil seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tr">Türkçe</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Para Birimi</Label>
                          <Select 
                            value={formData.currency} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                          >
                            <SelectTrigger id="currency">
                              <SelectValue placeholder="Para birimi seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                              <SelectItem value="USD">US Dollar ($)</SelectItem>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                              <SelectItem value="GBP">British Pound (£)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="theme">Tema</Label>
                        <Select 
                          value={theme || 'system'} 
                          onValueChange={(value) => setTheme(value)}
                        >
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="Tema seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Açık</SelectItem>
                            <SelectItem value="dark">Koyu</SelectItem>
                            <SelectItem value="system">Sistem</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Bildirim Ayarları */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>E-posta Bildirimleri</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Önemli hesap bilgilendirmelerini e-posta ile alın
                          </p>
                        </div>
                        <Switch 
                          checked={formData.notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Fiyat Uyarıları</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Belirlediğiniz kripto paraların fiyat değişimleri hakkında bildirim alın
                          </p>
                        </div>
                        <Switch 
                          checked={formData.notifications.price}
                          onCheckedChange={(checked) => handleNotificationChange('price', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Güvenlik Bildirimleri</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Hesabınızla ilgili güvenlik uyarılarını alın
                          </p>
                        </div>
                        <Switch 
                          checked={formData.notifications.security}
                          onCheckedChange={(checked) => handleNotificationChange('security', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Pazarlama E-postaları</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Yeni özellikler ve kampanyalar hakkında bilgi alın
                          </p>
                        </div>
                        <Switch 
                          checked={formData.notifications.marketing}
                          onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button type="button" variant="outline">
                      İptal
                    </Button>
                    <Button type="submit">
                      Kaydet
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage; 