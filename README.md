# Gemini WordPress Bot

Google Gemini AI kullanarak otomatik içerik üreten ve WordPress'e gönderen bot sistemi.

## 🚀 Özellikler

- **Otomatik İçerik Üretimi**: Google Gemini AI ile SEO dostu içerik üretimi
- **WordPress Entegrasyonu**: Üretilen içerikleri otomatik olarak WordPress'e taslak olarak gönderir
- **Google Trends Entegrasyonu**: Türkiye için güncel trend konularını otomatik takip eder
- **Zamanlayıcı Sistemi**: Belirlenen aralıklarla otomatik çalışır (varsayılan: 30 dakika)
- **Detaylı Loglama**: Tüm işlemler detaylıca loglanır
- **REST API**: Manuel kontrol için API endpoint'leri

## 📋 Gereksinimler

- Node.js 16+
- npm
- Google Gemini API anahtarı
- WordPress sitesi (Application Password ile)

## 🛠️ Kurulum

1. **Repository'yi klonlayın:**
   ```bash
   git clone <repository-url>
   cd gemini-wordpress-bot
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Konfigürasyon dosyasını oluşturun:**
   ```bash
   cp .env.example .env
   ```

4. **`.env` dosyasını düzenleyin:**
   ```env
   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here

   # WordPress Ayarları
   WP_URL=https://your-wordpress-site.com
   WP_USER=your_wordpress_username
   WP_PASSWORD=your_wordpress_application_password

   # Sunucu Ayarları
   PORT=3000

   # Google Trends Otomatik Sistem Ayarları
   AUTO_TRENDS_ENABLED=true
   TRENDS_CHECK_INTERVAL=*/30 * * * *
   MAX_CONTENT_PER_RUN=3
   ```

## ⚙️ Konfigürasyon

### Google Trends Ayarları

- `AUTO_TRENDS_ENABLED`: Otomatik sistemi etkinleştir/devre dışı bırak (true/false)
- `TRENDS_CHECK_INTERVAL`: Kontrol aralığı (cron formatı)
  - `*/30 * * * *` = Her 30 dakikada bir
  - `0 */1 * * *` = Her saat başı
  - `0 9,14,19 * * *` = Günde 3 kez (09:00, 14:00, 19:00)
- `MAX_CONTENT_PER_RUN`: Her çalıştırmada maksimum içerik sayısı

### WordPress Ayarları

Application Password oluşturmak için:
1. WordPress admin paneline gidin
2. Users → Profile sayfasına gidin
3. "Application Passwords" bölümüne gidin
4. Yeni uygulama şifresi oluşturun

## 🚀 Kullanım

### Otomatik Mod

Uygulamayı başlattığınızda otomatik sistem çalışmaya başlar:

```bash
npm start
```

### Manuel Mod

API endpoint'lerini kullanarak manuel kontrol:

#### Trend'leri Görüntüle
```bash
GET /api/trends
```

#### Belirli Trend için İçerik Üret
```bash
POST /api/trends/generate-content
Content-Type: application/json

{
  "trendTitle": "Türkiye'de Elektrikli Araçlar"
}
```

#### Scheduler Kontrolü
```bash
GET /api/scheduler/status
POST /api/scheduler/start
POST /api/scheduler/stop
POST /api/scheduler/run-manual
```

### Mevcut İçerik Üretme
```bash
POST /api/generate-and-post
Content-Type: application/json

{
  "inputText": "SEO hakkında detaylı bilgi"
}
```

## 📊 Log Dosyaları

Sistem aşağıdaki log dosyalarını oluşturur:

- `logs/google_trends.log`: Trend verisi çekme işlemleri
- `logs/automated_content_success.log`: Başarılı otomatik içerik üretimi
- `logs/automated_content_errors.log`: Otomatik sistem hataları
- `logs/manual_content_generation.log`: Manuel içerik üretimi
- `logs/gemini_responses.log`: Gemini API yanıtları
- `logs/wordpress_operations.log`: WordPress işlemleri

## 🔧 API Endpoint'leri

### Google Trends
- `GET /api/trends` - Güncel trend'leri listele
- `POST /api/trends/generate-content` - Belirli trend için içerik üret

### Scheduler
- `GET /api/scheduler/status` - Scheduler durumunu göster
- `POST /api/scheduler/start` - Otomatik sistemi başlat
- `POST /api/scheduler/stop` - Otomatik sistemi durdur
- `POST /api/scheduler/run-manual` - Manuel çalıştırma

### İçerik Üretimi
- `POST /api/generate-and-post` - Özel metin için içerik üret

## 🛠️ Geliştirme

### Proje Yapısı
```
src/
├── app.js                      # Ana uygulama dosyası
├── controllers/                # API controller'ları
│   ├── content.controller.js
│   └── google-trends.controller.js
├── features/                   # İş mantığı servisleri
│   ├── gemini/                 # Gemini AI servisi
│   ├── google-trends/          # Google Trends scraping
│   ├── scheduler/              # Zamanlayıcı sistemi
│   └── wordpress/              # WordPress entegrasyonu
├── routes/                     # API rotaları
└── logs/                       # Log dosyaları
```

### Yeni Özellik Ekleme

1. `src/features/` altında yeni servis oluşturun
2. `src/controllers/` altında controller oluşturun
3. `src/routes/api.routes.js`'e endpoint ekleyin
4. Gerekli konfigürasyonları `.env`'ye ekleyin

## ⚠️ Uyarılar

- Google Trends scraping işlemi için Puppeteer kullanır
- Rate limit nedeniyle 30 dakikalık aralık önerilir
- WordPress'e taslak olarak gönderilir, yayınlamadan önce kontrol edin
- Gemini API kota limitlerinize dikkat edin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Sorularınız için issue açabilirsiniz.
