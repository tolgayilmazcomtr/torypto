# Torypto - Ürün Gereksinimleri Dokümanı (PRD)

## Ürün Vizyonu

Torypto, yapay zeka destekli kripto para analizi ve sinyal üretimi yapan, kullanıcılarına premium özellikler sunan bir SaaS platformudur. Platform, teknik analiz bilgisi olmayan kullanıcılara da profesyonel seviyede analizler sunarak kripto para yatırımlarında daha bilinçli kararlar almalarını sağlar.

## Hedef Kitle

- Orta düzey kripto yatırımcıları
- Teknik analiz bilmeyen kullanıcılar
- Sinyal grupları ve eğitmenler
- Platform yöneticileri ve moderatörler

## Temel Özellikler

### 1. Kullanıcı Yönetimi
- Kayıt ve giriş sistemi
- Profil yönetimi
- Abonelik durumu izleme
- WooCommerce entegrasyonu ile ödeme sistemi

### 2. Kripto Para Analizi
- Binance üzerinden tüm spot/futures pariteler için veri
- Çeşitli zaman dilimleri seçimi (5m, 15m, 1h, 4h, 1d vb.)
- Teknik gösterge hesaplamaları (RSI, MACD, Bollinger, EMA, Volume vb.)
- AI ile analiz yorumlama

### 3. Sinyal Üretimi
- Alım/satım sinyalleri
- TP/SL (Take Profit/Stop Loss) seviye önerileri
- Pozisyon büyüklüğü önerileri
- Risk analizi

### 4. Grafikler & Görselleştirme
- TradingView/Lightweight Charts entegrasyonu
- Göstergelerin grafikler üzerinde görselleştirilmesi
- Destek/direnç seviyelerinin çizilmesi
- Sinyal grafiği ve açıklaması

### 5. Premium Özellikler
- Freemium model (günde 3 analiz ücretsiz)
- Sınırsız analiz (premium)
- Özel sinyal bildirimleri (premium)
- Otomatik analiz raporları (premium)
- WooCommerce ile ödeme altyapısı

### 6. Admin Paneli
#### 6.1 Kullanıcı Yönetimi
- Kullanıcı listesi ve detaylı arama
- Kullanıcı profil düzenleme ve hesap durumu kontrolü
- Rol tabanlı yetkilendirme (admin, moderatör, kullanıcı)
- Manuel abonelik yönetimi
- Kullanıcı aktivite logları

#### 6.2 Abonelik ve Ödeme Yönetimi
- Abonelik planları yönetimi
- Ödeme geçmişi ve raporlama
- İade ve iptal işlemleri
- Gelir analizi ve grafikler
- WooCommerce entegrasyon ayarları

#### 6.3 İçerik ve Sinyal Yönetimi
- Sinyal onay/red mekanizması
- Manuel sinyal oluşturma
- Sinyal performans takibi
- Duyuru ve blog yönetimi
- Yardım dokümanları yönetimi

#### 6.4 Sistem Yönetimi
- API bağlantı durumu izleme
- Sistem performans metrikleri
- Hata logları takibi
- AI servis kullanım istatistikleri
- Güvenlik ayarları ve erişim logları

#### 6.5 Analitik ve Raporlama
- Kullanıcı büyüme metrikleri
- Sinyal başarı oranları
- Platform kullanım istatistikleri
- Gelir ve abonelik analizleri
- Özelleştirilebilir raporlar

## Teknoloji Yığını

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Veritabanı**: PostgreSQL + Redis
- **AI**: OpenAI GPT-4 API
- **Veri Kaynağı**: Binance REST API
- **Grafik Araçları**: TradingView / Lightweight Charts
- **Ödeme**: WooCommerce (WordPress) API entegrasyonu
- **Admin Panel**: Next.js (Dashboard UI) + Recharts (Grafikler)

## Yapılacaklar

### Faz 1: Temel Altyapı (Hedef: 3 Hafta)
- [ ] Proje yapısı ve mimari tasarımı
- [ ] Backend FastAPI kurulumu
- [ ] Frontend Next.js kurulumu
- [ ] Veritabanı şeması oluşturma
- [ ] Docker ortamının hazırlanması
- [ ] CI/CD pipeline kurulumu

### Faz 2: Veri Akışı ve Temel Analizler (Hedef: 4 Hafta)
- [ ] Binance API entegrasyonu
- [ ] Teknik gösterge hesaplama modülleri
- [ ] Veritabanı modelleri oluşturma
- [ ] Temel API endpoint'leri
- [ ] Kullanıcı yönetimi API'ları

### Faz 3: AI Entegrasyonu (Hedef: 3 Hafta)
- [ ] OpenAI GPT-4 entegrasyonu
- [ ] Analiz şablonları ve prompt tasarımı
- [ ] Sinyal üretimi algoritmaları
- [ ] Analizlerin veritabanında saklanması
- [ ] AI yanıtlarının işlenmesi ve formatlanması

### Faz 4: Frontend Geliştirme (Hedef: 5 Hafta)
- [ ] UI/UX tasarımı
- [ ] TradingView/Lightweight Charts entegrasyonu
- [ ] Dashboard ve analiz sayfaları
- [ ] Kullanıcı profil ve ayarlar sayfaları
- [ ] Responsive tasarım

### Faz 5: Premium Özellikler ve WooCommerce Entegrasyonu (Hedef: 3 Hafta)
- [ ] WooCommerce API entegrasyonu
- [ ] Ödeme akışı
- [ ] Premium özelliklerin kodlanması
- [ ] Freemium limit kontrolü
- [ ] Bildirim sistemi

### Faz 6: Admin Paneli Geliştirme (Hedef: 4 Hafta)
- [ ] Admin dashboard tasarımı
- [ ] Kullanıcı yönetim modülü
- [ ] Abonelik ve ödeme yönetimi
- [ ] İçerik ve sinyal yönetimi
- [ ] Analitik ve raporlama sistemi
- [ ] Sistem izleme araçları

### Faz 7: Test ve Optimizasyon (Hedef: 2 Hafta)
- [ ] Performans testleri
- [ ] Güvenlik testleri
- [ ] Yük testleri
- [ ] UI/UX testleri
- [ ] Hata düzeltmeleri

### Faz 8: Lansman Hazırlıkları (Hedef: 2 Hafta)
- [ ] Dokümantasyon tamamlama
- [ ] Kullanıcı kılavuzu
- [ ] Beta testleri
- [ ] Üretim ortamı hazırlığı
- [ ] Lansman stratejisi

## Yapılanlar

### Faz 1: Temel Altyapı
- [x] Proje başlatıldı
- [x] RULES.md oluşturuldu
- [x] PRD.md oluşturuldu

## Kilometre Taşları

| Kilometre Taşı | Hedef Tarih | Durum |
|----------------|-------------|-------|
| Proje Başlangıcı | Hafta 0 | Tamamlandı |
| Temel Altyapı | Hafta 3 | Devam Ediyor |
| Veri Akışı ve Temel Analizler | Hafta 7 | Planlandı |
| AI Entegrasyonu | Hafta 10 | Planlandı |
| Frontend MVP | Hafta 15 | Planlandı |
| Premium Özellikler | Hafta 18 | Planlandı |
| Admin Paneli | Hafta 22 | Planlandı |
| Beta Sürüm | Hafta 24 | Planlandı |
| Ürün Lansmanı | Hafta 26 | Planlandı |

## Risk Analizi

| Risk | Etki | Olasılık | Azaltma Stratejisi |
|------|------|----------|---------------------|
| API kısıtlamaları | Yüksek | Orta | Önbellek kullanımı ve yedek veri kaynakları |
| OpenAI maliyetleri | Orta | Yüksek | Token optimizasyonu ve bütçe kontrolü |
| Piyasa değişkenliği | Orta | Yüksek | Algoritma ayarlamaları ve uyarı sistemi |
| Ölçeklenebilirlik sorunları | Yüksek | Düşük | Mikroservis mimarisi ve yük testi |
| Güvenlik ihlalleri | Çok Yüksek | Düşük | Güvenlik taramaları ve audit |
| Admin yetki suistimali | Yüksek | Düşük | Detaylı log tutma ve yetki sınırlaması |

## Gelecek Geliştirmeler (v2.0)

- Mobil uygulama
- Toplu sinyal analizi
- Sosyal paylaşım özellikleri
- Otomatik trade botları ile entegrasyon
- Daha fazla borsa desteği
- Gelişmiş admin analitik araçları
- Multi-dil desteği
- API marketplace

Bu doküman, proje ilerledikçe güncellenecektir. 