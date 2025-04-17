import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, RefreshCw, Trash, Reply, Eye, ArrowDown, ArrowUp } from 'lucide-react';

// Örnek mesaj verileri
const messagesData = [
  {
    id: 1,
    sender: {
      id: 'USR12345',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
    },
    subject: 'Ödeme Sorunu',
    content: 'Merhaba, son ödeme işlemimde bir sorun yaşadım ve iki kere ücret çekildi. Bu konuda yardımcı olabilir misiniz?',
    date: '2024-04-20',
    status: 'Yeni',
    priority: 'Yüksek',
    category: 'Ödeme',
  },
  {
    id: 2,
    sender: {
      id: 'USR12346',
      name: 'Mehmet Demir',
      email: 'mehmet@example.com',
    },
    subject: 'Hesap Erişimi',
    content: 'Şifremi unuttum ve hesabıma erişemiyorum. Şifre sıfırlama e-postası alamıyorum. Lütfen yardımcı olabilir misiniz?',
    date: '2024-04-19',
    status: 'Yanıtlandı',
    priority: 'Normal',
    category: 'Hesap',
  },
  {
    id: 3,
    sender: {
      id: 'USR12347',
      name: 'Ayşe Kaya',
      email: 'ayse@example.com',
    },
    subject: 'Premium Özellikler Hakkında',
    content: 'Premium planınızda yer alan yapay zeka destekli öngörülerin nasıl çalıştığını daha detaylı öğrenebilir miyim?',
    date: '2024-04-18',
    status: 'Yeni',
    priority: 'Normal',
    category: 'Bilgi',
  },
  {
    id: 4,
    sender: {
      id: 'USR12348',
      name: 'Can Öztürk',
      email: 'can@example.com',
    },
    subject: 'Uygulamanızı Beğendim',
    content: 'Merhaba, kripto para takibi için geliştirdiğiniz uygulama gerçekten çok başarılı. Özellikle sinyal sisteminiz çok yardımcı oluyor. Teşekkürler!',
    date: '2024-04-17',
    status: 'Yanıtlandı',
    priority: 'Düşük',
    category: 'Geribildirim',
  },
  {
    id: 5,
    sender: {
      id: 'USR12349',
      name: 'Zeynep Şahin',
      email: 'zeynep@example.com',
    },
    subject: 'API Entegrasyonu',
    content: 'Merhaba, platformunuzu kendi sistemimize entegre etmek istiyoruz. API hizmetiniz var mı? Varsa, dokümanları nerede bulabilirim?',
    date: '2024-04-16',
    status: 'Beklemede',
    priority: 'Yüksek',
    category: 'Teknik',
  },
];

// Örnek bildirimler
const announcementsData = [
  {
    id: 1,
    title: 'Bakım Duyurusu',
    content: 'Sistemimizde planlı bir bakım çalışması gerçekleştirilecektir. 25 Nisan 2024 tarihinde 02:00-04:00 saatleri arasında sistem kısa süreli kesintiler yaşayabilir.',
    date: '2024-04-20',
    status: 'Yayında',
    audience: 'Tüm Kullanıcılar',
  },
  {
    id: 2,
    title: 'Yeni Özellik: Gelişmiş Portföy Takibi',
    content: 'Platformumuza eklenen yeni portföy takip özelliği ile kripto varlıklarınızı daha detaylı analiz edebileceksiniz. Yeni grafikler ve raporlama araçları ile yatırımlarınızı daha iyi yönetin.',
    date: '2024-04-15',
    status: 'Yayında',
    audience: 'Premium Kullanıcılar',
  },
  {
    id: 3,
    title: 'Özel Kampanya Duyurusu',
    content: 'Nisan ayına özel kampanyamızda tüm yıllık abonelikler %25 indirimli! Bu fırsatı kaçırmayın, 30 Nisan\'a kadar geçerlidir.',
    date: '2024-04-10',
    status: 'Taslak',
    audience: 'Temel Kullanıcılar',
  },
];

export default function AdminMessagesPage() {
  const [currentTab, setCurrentTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('hepsi');
  const [priorityFilter, setPriorityFilter] = useState<string>('hepsi');
  const [categoryFilter, setCategoryFilter] = useState<string>('hepsi');
  
  // Filtreleme işlemleri - Mesajlar
  const filteredMessages = messagesData.filter(message => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'hepsi' ? true : message.status === statusFilter;
    const matchesPriority = priorityFilter === 'hepsi' ? true : message.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'hepsi' ? true : message.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Filtreleme işlemleri - Bildirimler
  const filteredAnnouncements = announcementsData.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'hepsi' ? true : announcement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mesaj Yönetimi</h1>
          <p className="text-gray-500">Kullanıcı mesajları ve sistem bildirimleri</p>
        </div>
        {currentTab === 'announcements' && (
          <Button>
            Yeni Bildirim Oluştur
          </Button>
        )}
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="messages">Kullanıcı Mesajları</TabsTrigger>
          <TabsTrigger value="announcements">Sistem Bildirimleri</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Kullanıcı Mesajları Tabı */}
      {currentTab === 'messages' && (
        <>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Konu, gönderen veya içerik ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{statusFilter === 'hepsi' ? 'Durum' : statusFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hepsi">Tüm Durumlar</SelectItem>
                  <SelectItem value="Yeni">Yeni</SelectItem>
                  <SelectItem value="Yanıtlandı">Yanıtlandı</SelectItem>
                  <SelectItem value="Beklemede">Beklemede</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{priorityFilter === 'hepsi' ? 'Öncelik' : priorityFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hepsi">Tüm Öncelikler</SelectItem>
                  <SelectItem value="Yüksek">Yüksek</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Düşük">Düşük</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{categoryFilter === 'hepsi' ? 'Kategori' : categoryFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hepsi">Tüm Kategoriler</SelectItem>
                  <SelectItem value="Ödeme">Ödeme</SelectItem>
                  <SelectItem value="Hesap">Hesap</SelectItem>
                  <SelectItem value="Teknik">Teknik</SelectItem>
                  <SelectItem value="Bilgi">Bilgi</SelectItem>
                  <SelectItem value="Geribildirim">Geribildirim</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => {
                setSearchTerm('');
                setStatusFilter('hepsi');
                setPriorityFilter('hepsi');
                setCategoryFilter('hepsi');
              }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Mesajlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-4 font-medium">KONU</th>
                      <th className="p-4 font-medium">GÖNDEREN</th>
                      <th className="p-4 font-medium">KATEGORİ</th>
                      <th className="p-4 font-medium">TARİH</th>
                      <th className="p-4 font-medium">DURUM</th>
                      <th className="p-4 font-medium">ÖNCELİK</th>
                      <th className="p-4 font-medium">İŞLEMLER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((message) => (
                      <tr key={message.id} className="border-b">
                        <td className="p-4 font-medium">{message.subject}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{message.sender.name}</p>
                            <p className="text-sm text-gray-500">{message.sender.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-gray-100 text-gray-800">
                            {message.category}
                          </Badge>
                        </td>
                        <td className="p-4">{message.date}</td>
                        <td className="p-4">
                          <Badge 
                            className={
                              message.status === 'Yeni' 
                                ? 'bg-blue-100 text-blue-800' 
                                : message.status === 'Yanıtlandı' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {message.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            {message.priority === 'Yüksek' && <ArrowUp className="h-4 w-4 text-red-500 mr-1" />}
                            {message.priority === 'Düşük' && <ArrowDown className="h-4 w-4 text-green-500 mr-1" />}
                            {message.priority}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredMessages.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">
                          Arama kriteriyle eşleşen mesaj bulunamadı.
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

      {/* Sistem Bildirimleri Tabı */}
      {currentTab === 'announcements' && (
        <>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Bildirim başlığı veya içeriği ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{statusFilter === 'hepsi' ? 'Durum' : statusFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hepsi">Tüm Durumlar</SelectItem>
                  <SelectItem value="Yayında">Yayında</SelectItem>
                  <SelectItem value="Taslak">Taslak</SelectItem>
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

          <div className="grid gap-4">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{announcement.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {announcement.date} • {announcement.audience}
                      </p>
                    </div>
                    <Badge 
                      className={
                        announcement.status === 'Yayında' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {announcement.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{announcement.content}</p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">Düzenle</Button>
                    {announcement.status === 'Taslak' ? (
                      <Button size="sm">Yayınla</Button>
                    ) : (
                      <Button variant="outline" size="sm">Yayından Kaldır</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAnnouncements.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Arama kriteriyle eşleşen bildirim bulunamadı.
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
} 