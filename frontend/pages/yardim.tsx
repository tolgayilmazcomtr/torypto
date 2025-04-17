import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Search, MessageSquare, Mail, Phone } from 'lucide-react';

// SSS (Sık Sorulan Sorular) verileri
const faqData = [
  {
    question: 'Torypto nedir?',
    answer: 'Torypto, kripto para piyasasını takip etmenize, analiz etmenize ve yatırım kararları almanıza yardımcı olan bir analiz platformudur. Güncel veriler, grafikler, teknik analizler ve sinyal hizmetleri sunmaktadır.'
  },
  {
    question: 'Ücretlendirme nasıl çalışır?',
    answer: 'Torypto, farklı ihtiyaçlara ve bütçelere uygun çeşitli abonelik planları sunmaktadır. Temel, Pro ve Premium olmak üzere üç farklı plan bulunmaktadır. Her plan farklı özellikler ve hizmetler içermektedir. Ödeme sayfasından detaylı bilgilere ulaşabilirsiniz.'
  },
  {
    question: 'Sinyaller nasıl çalışır?',
    answer: 'Sinyaller, algoritma ve uzman analistlerimiz tarafından belirlenen alım-satım fırsatlarıdır. Her sinyal, giriş fiyatı, hedef fiyat ve stop-loss seviyelerini içerir. Sinyaller, e-posta veya uygulama bildirimleri aracılığıyla iletilir.'
  },
  {
    question: 'Aboneliğimi nasıl iptal edebilirim?',
    answer: 'Aboneliğinizi istediğiniz zaman Ayarlar sayfasından veya Destek ekibimizle iletişime geçerek iptal edebilirsiniz. İptal işlemi, mevcut fatura döneminin sonunda gerçekleşecektir.'
  },
  {
    question: 'Hangi kripto paraları destekliyorsunuz?',
    answer: 'Platformumuzda Bitcoin, Ethereum, Binance Coin, Solana, Cardano, Ripple ve daha birçok popüler kripto para birimini destekliyoruz. Düzenli olarak yeni kripto para birimleri eklenmektedir.'
  },
  {
    question: 'Verileriniz ne kadar güvenilir?',
    answer: 'Verilerimizi güvenilir kripto para borsaları ve veri sağlayıcılarından alıyoruz. Gerçek zamanlı veri sağlamak için sürekli olarak sistemlerimizi güncelliyoruz.'
  }
];

export default function HelpPage() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // SSS'yi aç/kapa
  const toggleFaq = (index: number) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(i => i !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };

  // SSS'leri filtrele
  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Yardım ve Destek</h2>
        <p className="text-gray-500 mt-1">Sık sorulan sorular ve destek</p>
      </div>

      {/* Arama */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Soru veya anahtar kelime ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {/* SSS Bölümü */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium mb-4">Sık Sorulan Sorular</h3>
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer p-4 flex flex-row items-center justify-between"
                  onClick={() => toggleFaq(index)}
                >
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                  {openFaqs.includes(index) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </CardHeader>
                {openFaqs.includes(index) && (
                  <CardContent className="p-4 pt-0 bg-gray-50">
                    <p className="text-sm text-gray-700">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}

            {filteredFaqs.length === 0 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-gray-500">Aramanızla eşleşen soru bulunamadı.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* İletişim ve Destek Formları */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>İletişim</CardTitle>
              <CardDescription>Bizimle iletişime geçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                <span>destek@torypto.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                <span>+90 212 123 4567</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
                <span>Canlı Destek (09:00-18:00)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destek Talebi</CardTitle>
              <CardDescription>Sorununuzu bize iletin</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Konu
                  </label>
                  <Input id="subject" placeholder="Konu başlığı" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj
                  </label>
                  <Textarea id="message" placeholder="Sorununuzu detaylı olarak açıklayın..." className="min-h-[100px]" />
                </div>
                <Button className="w-full">Gönder</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 