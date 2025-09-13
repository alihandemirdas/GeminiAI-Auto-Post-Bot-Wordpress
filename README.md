# 🤖 Gemini WordPress Bot

**AI İçerik Üretim ve WordPress Otomasyon Sistemi**

Google Gemini AI kullanarak SEO dostu içerikler üreten ve WordPress'e otomatik gönderen basit web uygulaması.

---

## 🎯 **Çözdüğümüz Problemler**

### **❌ Eski Problemler:**
- **Manuel İçerik Yazımı**: SEO içeriği üretmek zaman alıcı ve uzmanlık gerektiriyordu
- **Google Trends Takibi**: Trend konuları manuel olarak takip ediliyordu
- **WordPress Entegrasyonu**: İçerikleri manuel olarak WordPress'e eklemek gerekiyordu
- **Tekrarlayan İşler**: Aynı tür içerik üretimi sürekli tekrarlanıyordu

### **✅ Bizim Çözümlerimiz:**
- **AI İçerik Üretimi**: Google Gemini ile otomatik içerik üretimi
- **Google Trends Entegrasyonu**: Trend konuları otomatik çekme ve içerik önerisi
- **WordPress Otomasyonu**: İçerikleri otomatik WordPress'e gönderme
- **Web Arayüzü**: Kolay kullanım için basit ve modern UI

---

## 🚀 **Temel Özellikler**

### **🤖 AI İçerik Üretimi**
- **Google Gemini AI**: Otomatik içerik üretimi
- **SEO Dostu İçerik**: Anahtar kelime odaklı yazılar
- **Türkçe İçerik**: Profesyonel Türkçe makaleler
- **Esnek Input**: Başlık, anahtar kelime veya metin ile üretme

### **📊 Google Trends Entegrasyonu**
- **Trend Takibi**: Türkiye için güncel trend konuları çekme
- **Trend Bazlı İçerik**: Popüler konular için makale önerisi
- **Manual Seçim**: İstediğiniz trend için içerik üretme

### **⚙️ WordPress Otomasyonu**
- **Otomatik Gönderim**: İçerikleri doğrudan WordPress'e taslak olarak gönderme
- **Meta Bilgileri**: SEO başlık ve açıklamaları otomatik ekleme
- **Application Password**: Güvenli WordPress API entegrasyonu

### **🎨 Web Arayüzü**
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Modern Tasarım**: Glass effect ve gradient arka plan
- **Interactive Elements**: Hover efektleri ve geçişler
- **Real-time Feedback**: İşlem durumları için geri bildirim

---

## 🏗️ **Sistem Mimarisi**

```
├── 🎯 Kullanıcı Arayüzü (Web UI)
│   ├── Manuel İçerik Üretimi
│   ├── Google Trends Dashboard
│   └── API Endpoint'leri
│
├── ⚙️ Backend API (Node.js + Express)
│   ├── Content Controller
│   ├── Google Trends Controller
│   └── Logger Service
│
├── 🤖 AI Servisleri
│   └── Gemini AI Service
│
├── 📊 Veri Kaynakları
│   ├── Google Trends Scraping
│   └── WordPress REST API
│
└── 📝 Loglama Sistemi
    ├── Centralized Logger
    └── Error Tracking
```

---

## 📋 **Teknik Gereksinimler**

### **Sistem Gereksinimleri**
- **Node.js**: 16.0.0 veya üzeri
- **npm**: Paket yönetimi için
- **Memory**: Minimum 256MB RAM
- **Storage**: 50MB boş disk alanı

### **API Gereksinimleri**
- **Google Gemini API Key**: Geçerli API anahtarı
- **WordPress Site**: REST API desteği
- **WordPress Application Password**: API erişimi için

### **Ağ Gereksinimleri**
- **İnternet Bağlantısı**: Google API'lerine erişim
- **Firewall**: Port 3000 açık olmalı

---

## 🛠️ **Detaylı Kurulum Rehberi**

### **Adım 1: Repository'yi Klonlayın**
   ```bash
   git clone <repository-url>
   cd gemini-wordpress-bot
   ```

### **Adım 2: Bağımlılıkları Yükleyin**
   ```bash
   npm install
   ```

### **Adım 3: Google Gemini API Key Alın**
1. [Google AI Studio](https://makersuite.google.com/app/apikey)'ya gidin
2. Yeni API anahtarı oluşturun
3. Anahtarı güvenli bir yerde saklayın

### **Adım 4: WordPress Application Password Oluşturun**
1. WordPress admin paneline gidin
2. **Users → Profile** sayfasına gidin
3. **Application Passwords** bölümüne inin
4. **"New Application Password"** butonuna tıklayın
5. Uygulama adı girin (örn: "Gemini Bot")
6. Oluşturulan şifreyi kaydedin

### **Adım 5: Konfigürasyon Dosyası Oluşturun**
   ```bash
   cp .env.example .env
   ```

### **Adım 6: .env Dosyasını Düzenleyin**
   ```env
# ===========================================
# GEMINI WORDPRESS BOT - KONFIGURASYON
# ===========================================

# Google Gemini API Ayarları
GEMINI_API_KEY=your_gemini_api_key_here

# WordPress API Ayarları
WP_URL=https://your-wordpress-site.com
WP_USER=your_wordpress_username
WP_PASSWORD=your_application_password

# Sunucu Ayarları
PORT=3000
```

### **Adım 7: Uygulamayı Başlatın**
```bash
# Geliştirme modu
npm run dev

# Üretim modu
npm start
```

### **Adım 8: Web Arayüzüne Erişin**
```
http://localhost:3000
```

---

## ⚙️ **Konfigürasyon Detayları**

### **Google Trends Ayarları**
```env
AUTO_TRENDS_ENABLED=true          # Otomatik sistemi etkinleştir
TRENDS_CHECK_INTERVAL=*/30 * * * * # Her 30 dakikada bir kontrol
MAX_CONTENT_PER_RUN=3             # Her çalıştırmada max 3 içerik
TRENDS_COUNTRY=TR                 # Türkiye için
TRENDS_CATEGORY=0                 # Tüm kategoriler
```

### **İçerik Kalitesi Ayarları**
```env
MIN_CONTENT_LENGTH=1500    # Minimum 1500 kelime
MAX_CONTENT_LENGTH=2000    # Maximum 2000 kelime
FOCUS_KEYWORD_DENSITY=1.5  # Anahtar kelime yoğunluğu %
LSI_KEYWORDS_COUNT=7       # Yardımcı anahtar kelime sayısı
```

### **WordPress Application Password**
Application Password oluşturmak için:
1. WordPress admin paneline gidin
2. **Users → Profile** sayfasına gidin
3. **Application Passwords** bölümüne gidin
4. Yeni uygulama şifresi oluşturun
5. Güvenli bir yerde saklayın

---

## 🎮 **Kullanım Rehberi**

### **Web Arayüzü Kullanımı**

#### **1. Manuel İçerik Üretimi**
1. Ana sayfaya gidin
2. "Manuel İçerik" sekmesine tıklayın
3. Aşağıdaki alanları doldurun:
   - **Başlık**: Makale başlığı (isteğe bağlı)
   - **Odak Anahtar Kelime**: SEO anahtar kelimesi (isteğe bağlı)
   - **Referans Metin**: İçerik temeli (isteğe bağlı)
4. "İçerik Üret ve Gönder" butonuna tıklayın

#### **2. Google Trends Kullanımı**
1. "Google Trends" sekmesine tıklayın
2. "Yenile" butonuna tıklayarak güncel trend'leri çekin
3. İlginizi çeken trend için "İçerik Üret" butonuna tıklayın
4. Ek bilgi girmek için açılan modal'ı doldurun

### **API Kullanımı**

#### **Temel İçerik Üretimi**
```bash
POST /api/generate-and-post
Content-Type: application/json

{
  "title": "SEO Optimizasyonu Rehberi",
  "focusKeyword": "SEO optimizasyonu",
  "content": "SEO hakkında detaylı bilgi"
}
```

#### **Google Trends API**
```bash
# Trend'leri listele
GET /api/trends

# Belirli trend için içerik üret
POST /api/trends/generate-content
Content-Type: application/json

{
  "trendTitle": "Elektrikli Araçlar",
  "userInput": "Detaylı bir rehber yaz"
}
```

### **Manuel Kullanım**
Web arayüzü üzerinden manuel olarak içerik üretmek için:
1. Ana sayfaya gidin
2. "Manuel İçerik" sekmesine tıklayın
3. Gerekli alanları doldurun
4. "İçerik Üret ve Gönder" butonuna tıklayın

---

## 📊 **Loglama Sistemi**

### **Log Dosyaları Yapısı**
```
logs/
├── content_generation.log      # Başarılı içerik üretimleri
├── controller_errors.log       # API hataları
├── gemini_responses.log        # Gemini AI yanıtları
├── google_trends_operations.log # Trend işlemleri
├── manual_run_operations.log   # Manuel işlemler
├── wordpress_operations.log    # WordPress işlemleri
└── test_log.log                # Test logları (geliştirme için)
```

### **Log Formatı**
```json
{
  "operation": "generate_and_post",
  "status": "success",
  "timestamp": "2025-09-13T10:00:00.000Z",
  "inputData": {
    "title": "SEO Rehberi",
    "focusKeyword": "SEO optimizasyonu",
    "contentLength": 1800
  },
  "generatedData": {
    "focusKeyword": "SEO optimizasyonu",
    "secondaryKeywords": "seo teknikleri, arama motoru optimizasyonu",
    "contentLength": 1850
  },
  "wordpressResult": {
    "postId": 123,
    "url": "https://site.com/seo-rehberi",
    "status": "published"
  }
}
```

### **Log Analizi Komutları**
```bash
# Son 10 log girişini görüntüle
tail -n 50 logs/content_generation.log

# Hata loglarını ara
grep "error" logs/controller_errors.log

# Belirli tarih aralığındaki logları filtrele
grep "2025-09-13" logs/*.log

# Başarılı işlemlerin sayısını öğren
grep -c "success" logs/content_generation.log

# En çok kullanılan anahtar kelimeleri bul
grep "focusKeyword" logs/content_generation.log | sort | uniq -c | sort -nr
```

---

## 🎯 **SEO Optimizasyon Detayları**

### **Rank Math 100/100 Skor Kriterleri**

#### **✅ Temel SEO (Basic SEO)**
- ✅ Focus Keyword kullanımı
- ✅ Meta title optimizasyonu
- ✅ Meta description optimizasyonu
- ✅ Permalink yapısı
- ✅ İçerik uzunluğu (1500+ kelime)

#### **✅ İleri SEO (Advanced SEO)**
- ✅ LSI anahtar kelimeler
- ✅ Başlık hiyerarşisi (H1, H2, H3)
- ✅ İç link yapısı
- ✅ Görsel optimizasyonu
- ✅ Okunabilirlik skoru

#### **✅ Teknik SEO**
- ✅ Sayfa hızı optimizasyonu
- ✅ Mobil uyumluluk
- ✅ HTTPS sertifikası
- ✅ XML sitemap
- ✅ Robots.txt

### **İçerik Kalitesi Standartları**
- **Kelime Sayısı**: 1500-2000 arası
- **Paragraf Uzunluğu**: Maksimum 120 kelime
- **Anahtar Kelime Yoğunluğu**: %1-2 arası
- **Okunabilirlik**: Orta seviye (Flesch Reading Score)
- **E-E-A-T**: Tam uyumlu

---

## 🔧 **API Endpoint'leri**

### **İçerik Üretim API**
```bash
# Özel metin için içerik üret
POST /api/generate-and-post
Content-Type: application/json
Body: {
  "title": "string (optional)",
  "focusKeyword": "string (optional)",
  "content": "string (optional)"
}
```

### **Google Trends API**
```bash
# Trend'leri listele
GET /api/trends
Response: { "trends": [...] }

# Belirli trend için içerik üret
POST /api/trends/generate-content
Content-Type: application/json
Body: { "trendTitle": "string", "userInput": "string" }
```


---

## 🛠️ **Geliştirme**

### **Proje Yapısı**
```
src/
├── app.js                      # Ana Express uygulaması
├── controllers/                # API controller'ları
│   ├── content.controller.js   # İçerik üretimi
│   └── google-trends.controller.js # Trend işlemleri
├── features/                   # İş mantığı servisleri
│   ├── gemini/                 # Gemini AI servisi
│   ├── google-trends/          # Google Trends scraping
│   ├── wordpress/              # WordPress entegrasyonu
│   └── logger/                 # Loglama servisi
├── routes/                     # API rotaları
│   └── api.routes.js          # Ana API rotaları
├── logs/                       # Log dosyaları
└── public/                     # Web arayüzü
    └── index.html             # Ana sayfa
```

### **Yeni Özellik Ekleme**

1. `src/features/` altında yeni servis oluşturun
2. `src/controllers/` altında controller oluşturun
3. `src/routes/api.routes.js`'e endpoint ekleyin
4. Gerekli konfigürasyonları `.env`'ye ekleyin

---

## 🛠️ **Sorun Giderme**

### **Yaygın Problemler ve Çözümleri**

#### **API Key Hatası**
```bash
# API key'inizi kontrol edin
echo $GEMINI_API_KEY

# Yeni API key alın
# https://makersuite.google.com/app/apikey
```

#### **WordPress Bağlantı Problemi**
```bash
# WordPress URL'ini kontrol edin
curl -I https://your-wordpress-site.com/wp-json

# Application Password'ü yeniden oluşturun
# WordPress Admin → Users → Profile → Application Passwords
```

#### **Port Çakışması**
```bash
# Port 3000 kullanılıyorsa farklı port kullanın
PORT=3001 npm start

# Veya .env dosyasında portu değiştirin
PORT=3001
```

---

## ⚠️ **Uyarılar ve Güvenlik**

### **Güvenlik Uyarıları**
- API anahtarlarınızı güvenli yerde saklayın
- WordPress Application Password'leri düzenli değiştirin
- Log dosyalarında hassas bilgiler bulunmaz
- İnternet bağlantısı gereklidir


---

## 🤝 **Katkıda Bulunma**

### **Kod Katkısı**
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

## 📞 **Destek ve İletişim**

### **İletişim**
- 🐛 **Issues**: GitHub Issues
- 📧 **Email**: Sorularınız için issue açabilirsiniz

---

## 📝 **Lisans**

Bu proje **MIT Lisansı** altında lisanslanmıştır.

```
MIT License

Copyright (c) 2025 Gemini WordPress Bot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎉 **Sonuç**

**Gemini WordPress Bot**, Google Gemini AI kullanarak SEO dostu içerikler üreten ve WordPress'e otomatik gönderen basit ve etkili bir web uygulamasıdır.

### **🚀 Hemen Başlayın**

1. **Kurulum**: Repository'yi klonlayın
2. **Konfigürasyon**: API anahtarlarını ayarlayın
3. **Başlatma**: Uygulamayı çalıştırın
4. **Kullanım**: Web arayüzünden içerik üretin

**Kolay kullanım ve güçlü AI teknolojisi ile içerik üretim süreçlerinizi basitleştirin!** 🤖

---

*MIT Lisansı altında lisanslanmıştır*
