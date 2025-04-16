# TORYPTO Proje Kuralları ve Standartları

## Genel Kurallar

1. Tüm geliştirme işlemleri feature branch'ler üzerinde yapılacaktır
2. Kod incelemeleri (code review) zorunludur, en az bir onay alınmalıdır
3. Commit mesajları açıklayıcı ve İngilizce olmalıdır
4. Haftalık sprint toplantıları yapılacaktır
5. Kritik hatalar 24 saat içinde çözülmelidir

## Kod Standartları

### Frontend (Next.js + Tailwind)

1. Component-based yaklaşım kullanılacaktır
2. Tüm komponentler TypeScript ile yazılacaktır
3. State yönetimi için React Context API tercih edilecektir
4. Responsive tasarım tüm sayfalar için zorunludur
5. TailwindCSS class'ları düzenli ve okunabilir olmalıdır
6. Custom hook'lar `hooks` klasöründe tanımlanacaktır
7. API çağrıları `services` klasöründe toplanacaktır
8. Jest ile birim testleri yazılacaktır

### Backend (FastAPI + Python)

1. PEP 8 kurallarına uyulacaktır
2. Type hinting kullanılacaktır
3. Fonksiyonlar ve sınıflar için docstring yazılacaktır
4. API endpointleri RESTful prensiplere uygun olacaktır
5. Hata yönetimi standart hata kodları ile yapılacaktır
6. Kritik fonksiyonlar için unit testler yazılacaktır
7. Veritabanı işlemleri için ORM (SQLAlchemy) kullanılacaktır
8. Asenkron işlemler için `async/await` kullanılacaktır

## Veritabanı Kuralları

1. Tablo isimleri çoğul olacaktır (users, analyses, subscriptions, etc.)
2. Primary key'ler için `id` kullanılacaktır
3. Foreign key'ler için `table_name_id` formatı kullanılacaktır
4. Tüm tablolarda `created_at` ve `updated_at` sütunları bulunacaktır
5. Hassas veriler şifrelenecektir
6. Index'ler performans gerektiren sorgular için eklenecektir
7. Database migration'lar versiyon kontrollü olacaktır

## Güvenlik Standartları

1. JWT token'ları kısa ömürlü olacaktır (max 1 saat)
2. API rate limiting uygulanacaktır
3. Input validation tüm form alanları için zorunludur
4. SQL injection ve XSS saldırılarına karşı önlemler alınacaktır
5. Hassas API anahtarları environment variable olarak saklanacaktır
6. HTTPS zorunludur
7. WooCommerce webhook'ları için imza doğrulaması yapılacaktır

## Proje Yönetimi

1. GitHub Projects kullanılacaktır
2. Issue'lar uygun etiketlerle kategorize edilecektir
3. Milestone'lar iki haftalık olarak belirlenecektir
4. Hata raporları şablona uygun olarak açılacaktır
5. Dokümantasyon güncel tutulacaktır

## Dağıtım (Deployment) Kuralları

1. CI/CD pipeline kullanılacaktır
2. Deploy öncesi otomatik testler çalıştırılacaktır
3. Staging ortamında test edilmeden production'a geçilmeyecektir
4. Rollback stratejisi hazır olacaktır
5. Performans monitoring yapılacaktır
6. Kesintisiz dağıtım (zero downtime deployment) uygulanacaktır

Bu kurallar projenin kaliteli, sürdürülebilir ve güvenli olmasını sağlamak için belirlenmiştir. Gerektiğinde güncellenebilir. 