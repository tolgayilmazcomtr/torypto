import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const HelpPage = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };
  
  const faqItems = [
    {
      question: 'Torypto nedir?',
      answer: 'Torypto, kripto para analiz ve takip platformudur. Kullanıcılarımıza güncel piyasa verileri, teknik analizler ve alım-satım sinyalleri sunarak yatırım kararlarınızda size yardımcı olmayı amaçlıyoruz.'
    },
    {
      question: 'Premium üyelik ne gibi avantajlar sağlar?',
      answer: 'Premium üyelik ile gelişmiş analiz araçlarına erişim, özel sinyal bildirimleri, reklamsız deneyim ve 7/24 öncelikli destek hizmetimizden yararlanabilirsiniz.'
    },
    {
      question: 'Platformda hangi kripto paralar takip edilebilir?',
      answer: 'Platformumuzda Bitcoin, Ethereum, Binance Coin gibi popüler kripto paraların yanı sıra binlerce altcoin de takip edilebilmektedir.'
    },
    {
      question: 'Sinyaller nasıl üretiliyor?',
      answer: 'Sinyallerimiz, yapay zeka algoritmalarımız ve uzman analistlerimizin teknik analiz çalışmalarının bir kombinasyonu sonucunda üretilmektedir. Teknik göstergeler, fiyat formasyonları ve piyasa dinamikleri göz önünde bulundurularak en doğru sinyaller oluşturulmaktadır.'
    },
    {
      question: 'Şifremi unuttum, ne yapmalıyım?',
      answer: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz. E-postanızı kontrol edip bağlantıya tıklayarak yeni bir şifre oluşturabilirsiniz.'
    },
    {
      question: 'Aboneliğimi nasıl iptal edebilirim?',
      answer: 'Aboneliğinizi Ayarlar > Abonelik sayfasından iptal edebilirsiniz. İptal işleminden sonra mevcut dönem sonuna kadar premium özelliklerden yararlanmaya devam edebilirsiniz.'
    }
  ];
  
  return (
    <Layout title="Yardım - Torypto">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Yardım ve Destek</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Sıkça Sorulan Sorular</CardTitle>
            <CardDescription>
              Platformumuzla ilgili en çok sorulan sorular ve cevapları
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Destek Talebi Oluştur</CardTitle>
            <CardDescription>
              Sorularınız için bizimle iletişime geçin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Adınız</Label>
                  <Input
                    id="name"
                    name="name"
                    value={contactData.name}
                    onChange={handleChange}
                    placeholder="Adınız"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresiniz</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactData.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={contactData.subject}
                  onChange={handleChange}
                  placeholder="Sorunuzun konusu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mesajınız</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={contactData.message}
                  onChange={handleChange}
                  placeholder="Bize sorunuzu açıklayın"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <Button className="w-full md:w-auto">Gönder</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>İletişim Bilgileri</CardTitle>
            <CardDescription>
              Bize ulaşabileceğiniz alternatif kanallar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium text-lg mb-2">E-posta</h3>
                  <p className="text-blue-600">destek@torypto.com</p>
                </div>
                <div className="flex-1 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium text-lg mb-2">Telefon</h3>
                  <p>+90 (212) 123 45 67</p>
                </div>
                <div className="flex-1 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium text-lg mb-2">Çalışma Saatleri</h3>
                  <p>Hafta içi 09:00 - 18:00</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-lg mb-2 text-blue-800">Sosyal Medya</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">Telegram</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">Instagram</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HelpPage; 