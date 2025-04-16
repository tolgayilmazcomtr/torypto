# Torypto - AI Destekli Kripto Teknik Analiz Platformu

<div align="center">
  <h3>Yapay Zeka ile Kripto Para Analizleri ve Sinyaller</h3>
</div>

## 📋 Proje Hakkında

Torypto, yapay zeka teknolojisi kullanarak kripto paralarda teknik analiz yapan ve yatırımcılara alım-satım sinyalleri üreten premium bir SaaS platformudur. Temel ve teknik analizi bilmeyen kullanıcılar da dahil olmak üzere, herkes için anlaşılır yorumlar ve öneriler sunar.

## ✨ Özellikler

- 📊 RSI, MACD, Bollinger, EMA, Volume gibi teknik göstergelerin otomatik hesaplanması
- 🤖 GPT-4 ile göstergelerin yorumlanması ve sinyal üretimi
- 📈 TradingView / Lightweight Charts ile grafiksel görselleştirme
- 💰 TP/SL (Take Profit/Stop Loss) seviye önerileri
- 🔔 Premium üyelere özel bildirimler ve detaylı analizler
- 🌐 Binance API entegrasyonu ile binlerce parite desteği
- 🕒 Farklı zaman dilimlerinde analiz imkanı (5m'den 1d'ye)

## 🚀 Başlarken

### Gereksinimler

- Python 3.9+
- Node.js 16+
- PostgreSQL
- Redis

### Kurulum

1. Repoyu klonlayın
```bash
git clone https://github.com/yourusername/torypto.git
cd torypto
```

2. Backend için gerekli bağımlılıkları yükleyin
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Frontend için gerekli bağımlılıkları yükleyin
```bash
cd ../frontend
npm install
```

4. Geliştirme modunda çalıştırın
```bash
# Backend
cd ../backend
uvicorn app.main:app --reload

# Frontend
cd ../frontend
npm run dev
```

## 📝 Dokümantasyon

Daha fazla bilgi için aşağıdaki dokümanlara göz atın:

- [Kurulum Kılavuzu](docs/installation.md)
- [API Dokümantasyonu](docs/api.md)
- [Geliştirici Rehberi](docs/development.md)
- [Ürün Gereksinimleri (PRD)](PRD.md)
- [Proje Kuralları](RULES.md)

## 📊 Proje Durumu

Bu proje aktif geliştirme aşamasındadır. Katkıda bulunmak isteyenler için [CONTRIBUTING.md](docs/CONTRIBUTING.md) dosyasını inceleyebilirsiniz.

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 👥 Ekip

- [Ekip Üyesi 1] - [Rol]
- [Ekip Üyesi 2] - [Rol]
- [Ekip Üyesi 3] - [Rol]

## 🤝 İletişim

Sorularınız ve önerileriniz için [info@torypto.com](mailto:info@torypto.com) adresine e-posta gönderebilirsiniz. 