import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [saved, setSaved] = useState(false);

  // Örnek site ayarları
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Torypto',
    siteDescription: 'Kripto Analiz Platformu',
    contactEmail: 'info@torypto.com',
    supportEmail: 'destek@torypto.com',
    phoneNumber: '+90 212 123 4567',
    address: 'İstanbul, Türkiye',
    socialLinks: {
      twitter: 'https://twitter.com/torypto',
      facebook: 'https://facebook.com/torypto',
      instagram: 'https://instagram.com/torypto',
      linkedin: 'https://linkedin.com/company/torypto'
    }
  });

  // Örnek API ayarları
  const [apiSettings, setApiSettings] = useState({
    apiEnabled: true,
    rateLimit: 100,
    allowedOrigins: 'localhost, torypto.com',
    apiTimeout: 30,
    enableDocumentation: true,
    logRequests: true
  });

  // Örnek e-posta ayarları
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'notifications@torypto.com',
    smtpPass: '••••••••',
    senderName: 'Torypto Bildirim',
    senderEmail: 'notifications@torypto.com',
    useTLS: true,
    testEmail: ''
  });

  // Örnek analitik ayarları
  const [analyticsSettings, setAnalyticsSettings] = useState({
    googleAnalyticsId: 'UA-123456789-1',
    enableTracking: true,
    trackLoggedInUsers: false,
    enableHeatmaps: true,
    dataRetentionDays: 90
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleApiSwitchChange = (name: string, checked: boolean) => {
    setApiSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyticsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnalyticsSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyticsSwitchChange = (name: string, checked: boolean) => {
    setAnalyticsSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada gerçek bir API çağrısı yapılacak
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sendTestEmail = () => {
    // Burada test e-postası gönderme işlemi yapılacak
    alert(`Test e-postası ${emailSettings.testEmail} adresine gönderildi.`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sistem Ayarları</h1>
          <p className="text-gray-500">Platform ayarlarını yönetin</p>
        </div>
      </div>

      {saved && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">
            Ayarlar başarıyla kaydedildi.
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
                defaultValue="general" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto space-y-1">
                  <TabsTrigger value="general" className="justify-start">Genel</TabsTrigger>
                  <TabsTrigger value="api" className="justify-start">API</TabsTrigger>
                  <TabsTrigger value="email" className="justify-start">E-posta</TabsTrigger>
                  <TabsTrigger value="analytics" className="justify-start">Analitik</TabsTrigger>
                  <TabsTrigger value="backup" className="justify-start">Yedekleme</TabsTrigger>
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
                {activeTab === 'general' && 'Genel Ayarlar'}
                {activeTab === 'api' && 'API Ayarları'}
                {activeTab === 'email' && 'E-posta Ayarları'}
                {activeTab === 'analytics' && 'Analitik Ayarları'}
                {activeTab === 'backup' && 'Yedekleme ve Kurtarma'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'general' && 'Temel site bilgilerini düzenleyin'}
                {activeTab === 'api' && 'API erişim ve güvenlik ayarlarını yönetin'}
                {activeTab === 'email' && 'E-posta gönderim ayarlarını yapılandırın'}
                {activeTab === 'analytics' && 'Analitik ve izleme ayarlarını düzenleyin'}
                {activeTab === 'backup' && 'Veri yedekleme ve kurtarma işlemlerini yönetin'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Genel Ayarlar */}
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Adı</Label>
                        <Input 
                          id="siteName" 
                          name="siteName" 
                          value={generalSettings.siteName}
                          onChange={handleGeneralChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siteDescription">Site Açıklaması</Label>
                        <Input 
                          id="siteDescription" 
                          name="siteDescription" 
                          value={generalSettings.siteDescription}
                          onChange={handleGeneralChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">İletişim E-postası</Label>
                        <Input 
                          id="contactEmail" 
                          name="contactEmail" 
                          type="email" 
                          value={generalSettings.contactEmail}
                          onChange={handleGeneralChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Destek E-postası</Label>
                        <Input 
                          id="supportEmail" 
                          name="supportEmail" 
                          type="email" 
                          value={generalSettings.supportEmail}
                          onChange={handleGeneralChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Telefon Numarası</Label>
                        <Input 
                          id="phoneNumber" 
                          name="phoneNumber" 
                          value={generalSettings.phoneNumber}
                          onChange={handleGeneralChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Adres</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={generalSettings.address}
                          onChange={handleGeneralChange}
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium pt-4">Sosyal Medya Bağlantıları</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          name="twitter" 
                          value={generalSettings.socialLinks.twitter}
                          onChange={handleSocialChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input 
                          id="facebook" 
                          name="facebook" 
                          value={generalSettings.socialLinks.facebook}
                          onChange={handleSocialChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input 
                          id="instagram" 
                          name="instagram" 
                          value={generalSettings.socialLinks.instagram}
                          onChange={handleSocialChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          name="linkedin" 
                          value={generalSettings.socialLinks.linkedin}
                          onChange={handleSocialChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* API Ayarları */}
                {activeTab === 'api' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="apiEnabled">API Erişimi</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          API uç noktalarına erişimi etkinleştir
                        </p>
                      </div>
                      <Switch 
                        id="apiEnabled"
                        checked={apiSettings.apiEnabled}
                        onCheckedChange={(checked) => handleApiSwitchChange('apiEnabled', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rateLimit">İstek Limiti (dakika başına)</Label>
                      <Input 
                        id="rateLimit" 
                        name="rateLimit" 
                        type="number" 
                        value={apiSettings.rateLimit}
                        onChange={handleApiChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowedOrigins">İzin Verilen Kaynaklar (virgülle ayrılmış)</Label>
                      <Input 
                        id="allowedOrigins" 
                        name="allowedOrigins" 
                        value={apiSettings.allowedOrigins}
                        onChange={handleApiChange}
                        placeholder="örn. example.com, localhost:3000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiTimeout">İstek Zaman Aşımı (saniye)</Label>
                      <Input 
                        id="apiTimeout" 
                        name="apiTimeout" 
                        type="number" 
                        value={apiSettings.apiTimeout}
                        onChange={handleApiChange}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableDocumentation">API Dokümantasyonu</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Genel API dokümantasyonunu etkinleştir
                        </p>
                      </div>
                      <Switch 
                        id="enableDocumentation"
                        checked={apiSettings.enableDocumentation}
                        onCheckedChange={(checked) => handleApiSwitchChange('enableDocumentation', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="logRequests">İstek Günlükleri</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tüm API isteklerini kaydet
                        </p>
                      </div>
                      <Switch 
                        id="logRequests"
                        checked={apiSettings.logRequests}
                        onCheckedChange={(checked) => handleApiSwitchChange('logRequests', checked)}
                      />
                    </div>
                  </div>
                )}

                {/* E-posta Ayarları */}
                {activeTab === 'email' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpServer">SMTP Sunucusu</Label>
                        <Input 
                          id="smtpServer" 
                          name="smtpServer" 
                          value={emailSettings.smtpServer}
                          onChange={handleEmailChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input 
                          id="smtpPort" 
                          name="smtpPort" 
                          value={emailSettings.smtpPort}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpUser">SMTP Kullanıcı Adı</Label>
                        <Input 
                          id="smtpUser" 
                          name="smtpUser" 
                          value={emailSettings.smtpUser}
                          onChange={handleEmailChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPass">SMTP Şifre</Label>
                        <Input 
                          id="smtpPass" 
                          name="smtpPass" 
                          type="password" 
                          value={emailSettings.smtpPass}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderName">Gönderen Adı</Label>
                        <Input 
                          id="senderName" 
                          name="senderName" 
                          value={emailSettings.senderName}
                          onChange={handleEmailChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senderEmail">Gönderen E-posta</Label>
                        <Input 
                          id="senderEmail" 
                          name="senderEmail" 
                          type="email" 
                          value={emailSettings.senderEmail}
                          onChange={handleEmailChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="useTLS">Güvenli Bağlantı (TLS)</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          SMTP sunucusu için TLS kullan
                        </p>
                      </div>
                      <Switch 
                        id="useTLS"
                        checked={emailSettings.useTLS}
                        onCheckedChange={(checked) => 
                          setEmailSettings(prev => ({ ...prev, useTLS: checked }))
                        }
                      />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">E-posta Testi</h3>
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Test e-posta adresi"
                          name="testEmail"
                          value={emailSettings.testEmail}
                          onChange={handleEmailChange}
                        />
                        <Button 
                          type="button" 
                          onClick={sendTestEmail}
                          disabled={!emailSettings.testEmail}
                        >
                          Test Gönder
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analitik Ayarları */}
                {activeTab === 'analytics' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                      <Input 
                        id="googleAnalyticsId" 
                        name="googleAnalyticsId" 
                        value={analyticsSettings.googleAnalyticsId}
                        onChange={handleAnalyticsChange}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableTracking">Kullanıcı Takibi</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Kullanıcı davranışlarını takip et
                        </p>
                      </div>
                      <Switch 
                        id="enableTracking"
                        checked={analyticsSettings.enableTracking}
                        onCheckedChange={(checked) => handleAnalyticsSwitchChange('enableTracking', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="trackLoggedInUsers">Giriş Yapmış Kullanıcıları Takip Et</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Oturum açmış kullanıcıları da takip et
                        </p>
                      </div>
                      <Switch 
                        id="trackLoggedInUsers"
                        checked={analyticsSettings.trackLoggedInUsers}
                        onCheckedChange={(checked) => handleAnalyticsSwitchChange('trackLoggedInUsers', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableHeatmaps">Isı Haritaları</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Kullanıcı etkileşim ısı haritalarını etkinleştir
                        </p>
                      </div>
                      <Switch 
                        id="enableHeatmaps"
                        checked={analyticsSettings.enableHeatmaps}
                        onCheckedChange={(checked) => handleAnalyticsSwitchChange('enableHeatmaps', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataRetentionDays">Veri Saklama Süresi (gün)</Label>
                      <Input 
                        id="dataRetentionDays" 
                        name="dataRetentionDays" 
                        type="number" 
                        value={analyticsSettings.dataRetentionDays}
                        onChange={handleAnalyticsChange}
                      />
                    </div>
                  </div>
                )}

                {/* Yedekleme Ayarları */}
                {activeTab === 'backup' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-md mb-6">
                      <p className="text-blue-800 text-sm">
                        Burada veritabanı yedekleme ve kurtarma işlemlerini gerçekleştirebilirsiniz. Düzenli yedekleme planlaması yapmanız önerilir.
                      </p>
                    </div>
                    
                    <h3 className="text-lg font-medium">Manuel Yedekleme</h3>
                    <p className="text-sm text-gray-500 mb-4">Mevcut veritabanının anlık bir yedeğini oluşturun</p>
                    
                    <div className="flex space-x-2">
                      <Button type="button">Tam Yedek Oluştur</Button>
                      <Button type="button" variant="outline">Kullanıcı Verilerini Yedekle</Button>
                    </div>
                    
                    <div className="border-t pt-4 mt-6">
                      <h3 className="text-lg font-medium mb-2">Otomatik Yedekleme</h3>
                      <p className="text-sm text-gray-500 mb-4">Düzenli yedekleme zamanlaması ayarlayın</p>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Yedekleme Sıklığı</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger>
                              <SelectValue placeholder="Sıklık Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Saatlik</SelectItem>
                              <SelectItem value="daily">Günlük</SelectItem>
                              <SelectItem value="weekly">Haftalık</SelectItem>
                              <SelectItem value="monthly">Aylık</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="backupRetention">Yedek Saklama Süresi</Label>
                          <Select defaultValue="30">
                            <SelectTrigger>
                              <SelectValue placeholder="Süre Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">7 gün</SelectItem>
                              <SelectItem value="14">14 gün</SelectItem>
                              <SelectItem value="30">30 gün</SelectItem>
                              <SelectItem value="90">90 gün</SelectItem>
                              <SelectItem value="365">1 yıl</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-6">
                      <h3 className="text-lg font-medium mb-2">Yedekten Kurtarma</h3>
                      <p className="text-sm text-gray-500 mb-4">Önceki bir yedekten verileri geri yükleyin</p>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="backupFile">Yedek Dosyası Yükle</Label>
                          <Input id="backupFile" type="file" />
                        </div>
                        
                        <div className="flex items-center bg-yellow-50 p-4 rounded-md">
                          <p className="text-yellow-800 text-sm">
                            <strong>Uyarı:</strong> Yedekten kurtarma işlemi, mevcut verilerin üzerine yazacaktır. Bu işlem geri alınamaz.
                          </p>
                        </div>
                        
                        <Button type="button" variant="outline">Yedekten Geri Yükle</Button>
                      </div>
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
  );
} 