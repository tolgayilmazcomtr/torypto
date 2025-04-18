# Torypto Backend - Temiz Yapı Planı

## Klasör Yapısı

```
backend/
├── main.py             # FastAPI uygulamasının ana giriş noktası
├── run.py              # Uygulamayı çalıştırmak için yardımcı script
├── requirements.txt    # Bağımlılıklar
├── .env                # Ortam değişkenleri
├── api/                # API tanımları ve endpoint'ler
│   └── routes/         # FastAPI router'ları
│       ├── auth.py     # Kimlik doğrulama
│       ├── users.py    # Kullanıcı işlemleri  
│       ├── crypto.py   # Kripto para işlemleri
│       ├── symbols.py  # Sembol işlemleri
│       └── signals.py  # Sinyal işlemleri (gelecekte eklenecek)
├── data/               # Veri katmanı
│   └── binance_client.py # Binance API istemcisi
├── services/           # İş mantığı
│   ├── binance_service.py   # Binance servisi
│   ├── user_service.py      # Kullanıcı servisi
│   └── crypto.py            # Kripto servisi
├── models/             # Veritabanı modelleri
│   ├── user.py
│   └── crypto.py
├── schemas/            # Pydantic modelleri
│   ├── user.py
│   └── crypto.py
├── database/           # Veritabanı bağlantısı
│   └── base.py
├── auth/               # Kimlik doğrulama
│   └── deps.py         # Bağımlılık enjeksiyonu
├── utils/              # Yardımcı fonksiyonlar
└── technical_analysis/ # Teknik analiz 
    └── indicators.py   # Teknik göstergeler
```

## Değişiklik Planı

1. **Birleştirme İşlemi**:
   - `backend/app` ve `backend/backend` klasörlerindeki en iyi parçaları birleştireceğiz

2. **Değişiklikler**:
   - `binance_client.py`: WebSocket desteği olan `app/data/binance_client.py` versiyonunu kullanacağız
   - `crypto.py` router: Tüm endpoint'leri içeren birleştirilmiş versiyonu kullanacağız
   - `main.py`: Tüm router'ları içeren güncellemiş versiyonu kullanacağız

3. **İsim Alanı Düzenlemesi**:
   - `backend` modülü içe aktarmaları yerine doğrudan modül adını (örn. `from data.binance_client import...`) kullanacağız

## İleriye Dönük Plan

1. **Belgeleme**: Tüm API endpoint'lerini ve veri modellerini belgeleyeceğiz
2. **Test**: Birim testleri ekleyeceğiz
3. **Entegrasyon**: Frontend ile daha iyi entegrasyon için WebSocket güncellemeleri yapacağız 