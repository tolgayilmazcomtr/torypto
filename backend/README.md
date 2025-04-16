# Torypto Backend

Torypto kripto para analiz platformunun backend API servisi.

## Kurulum

1. Python 3.9+ yüklenmiş olmalıdır
2. Sanal ortam oluşturun:
   ```bash
   python -m venv venv
   ```
3. Sanal ortamı etkinleştirin:
   - Windows: `venv\Scripts\activate`
   - Linux/macOS: `source venv/bin/activate`
4. Bağımlılıkları yükleyin:
   ```bash
   pip install -e .
   ```
5. Geliştirici bağımlılıklarını yüklemek için:
   ```bash
   pip install -e ".[dev]"
   ```

## Ortam Değişkenleri

`.env` dosyası oluşturun:

```
# Veritabanı
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=torypto

# Güvenlik
SECRET_KEY=gizli_anahtar_buraya
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Binance API
BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret
```

## Çalıştırma

```bash
python run.py
```

API `http://localhost:8000` adresinde çalışacaktır. Swagger dokümantasyonuna `http://localhost:8000/docs` adresinden erişebilirsiniz.

## Veritabanı Tabloları Oluşturma

İlk çalıştırma öncesinde veritabanı tablolarını oluşturmak için:

```bash
curl -X GET http://localhost:8000/db/create-tables
```

veya Swagger dokümantasyonundan `/db/create-tables` endpointini çağırabilirsiniz.

## Proje Yapısı

```
backend/
├── alembic/               # Veritabanı migrasyon dosyaları
├── backend/               # Ana modül
│   ├── api/               # API endpointleri
│   ├── auth/              # Kimlik doğrulama
│   ├── data/              # Veri erişim katmanı
│   ├── database/          # Veritabanı yapılandırması
│   ├── models/            # Veritabanı modelleri
│   ├── routers/           # API rotaları
│   ├── schemas/           # Veri şemaları
│   ├── services/          # İş mantığı
│   └── utils/             # Yardımcı fonksiyonlar
├── run.py                 # Uygulamayı çalıştırmak için script
└── setup.py               # Paket yapılandırması
``` 