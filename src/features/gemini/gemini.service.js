const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const loggerService = require('../logger/logger.service');

const basePromptTemplate = (inputData) => {
    const { title, focusKeyword, content } = inputData;

    let contextInfo = '';
    if (title && focusKeyword && content) {
        contextInfo = `KULLANICI TARAFINDAN SAĞLANAN BİLGİLER:\n- Başlık: ${title}\n- Odak Anahtar Kelime: ${focusKeyword}\n- Referans Metin: ${content}\n\nBu bilgiler ışığında kapsamlı bir makale yaz.`;
    } else if (title && focusKeyword) {
        contextInfo = `KULLANICI TARAFINDAN SAĞLANAN BİLGİLER:\n- Başlık: ${title}\n- Odak Anahtar Kelime: ${focusKeyword}\n\nBu başlık ve anahtar kelime için kapsamlı araştırma yaparak detaylı bir makale yaz.`;
    } else if (title && content) {
        contextInfo = `KULLANICI TARAFINDAN SAĞLANAN BİLGİLER:\n- Başlık: ${title}\n- Referans Metin: ${content}\n\nBu başlık için odak anahtar kelime belirle ve kapsamlı bir makale yaz.`;
    } else if (focusKeyword && content) {
        contextInfo = `KULLANICI TARAFINDAN SAĞLANAN BİLGİLER:\n- Odak Anahtar Kelime: ${focusKeyword}\n- Referans Metin: ${content}\n\nBu anahtar kelime için uygun bir başlık belirle ve kapsamlı bir makale yaz.`;
    } else if (title) {
        contextInfo = `KULLANICI TARAFINDAN SAĞLANAN BİLGİ:\n- Başlık: ${title}\n\nBu başlık için kapsamlı araştırma yaparak odak anahtar kelime belirle ve detaylı bir makale yaz.`;
    } else if (focusKeyword) {
        contextInfo = `KULLANICI TARAFINDAN SAĞLANAN BİLGİ:\n- Odak Anahtar Kelime: ${focusKeyword}\n\nBu anahtar kelime için uygun bir başlık belirle ve kapsamlı bir makale yaz.`;
    } else if (content) {
        contextInfo = `KULLANICI TARAFINDAN SAĞLANAN BİLGİ:\n- Referans Metin: ${content}\n\nBu metin için uygun başlık ve odak anahtar kelime belirle, kapsamlı bir makale yaz.`;
    }

    return `
Sen, Rank Math SEO eklentisiyle 100/100 skor almayı garantileyen bir SEO içerik uzmanısın. İçeriğinizi Rank Math'ın TÜM test kriterlerini karşılayacak şekilde optimize edeceksin. Amacın saygın ve otoriter bir haber sitesi için deneyimli bir içerik üreticisi rolüyle haber/makale yazmak.

**KRİTİK UYARI: İÇERİK UZUNLUĞU**
- Minimum 1500-2000 kelime ZORUNLU
- Kısa içerik Rank Math 100/100 skor alamaz
- İçeriği detaylandırmak için örnekler, açıklamalar ve genişletmeler kullan
- Her bölüm en az 200-300 kelime olacak şekilde planla
- Sana verilen başlık, odak anahtar kelime veya içerik bilgileri Türkçe harici bir dil bile olsa sen onu anlayarak Türkçe olarak yaz.

${contextInfo}

**RANK MATH 100/100 SKOR KRİTERLERİ (KESİN UYUM GEREKİYOR):**

**1. ANAHTAR KELİME OPTİMİZASYONU (RANK MATH ANAHTAR TESTİ):**
${focusKeyword ? `- VERİLEN ODAK ANAHTAR KELİME: "${focusKeyword}"` : '- Konuyla en alakalı 2-4 kelimelik odak anahtar kelime belirle'}
- **Yoğunluk:** %1-2 arasında (Rank Math keyword density testi için kritik)
- **Dağılım:** H1 başlığı, ilk paragraf, en az 3 H2 başlığı, URL, meta açıklama MUTLAKA geçsin
- **LSI Anahtar Kelimeler:** 5-7 adet belirle ve metinde doğal şekilde kullan
- **Doğal Kullanım:** Keyword stuffing yasak, doğal akışta kullan
- **İkincil Anahtar Kelimeler:** Her biri için ayrı optimizasyon yap

**2. İÇERİK UZUNLUĞU VE YAPISI:**
- **Minimum Kelime:** 1500-2000 kelime (Rank Math için kritik!)
- **Paragraf Uzunluğu:** Her paragraf maksimum 120 kelime
- **Başlık Hiyerarşisi:** H1 (1 adet) → H2 (4-6 adet) → H3 (2-4 adet)
- **İçerik Akışı:** Giriş → Detaylı Açıklamalar → Pratik Uygulamalar → İstatistikler → Sonuç (ama bu kelimeleri başlık olarak kullanma, giriş ve sonuç gibi mesela. Doğal akış bu başlıklar altında ilerlesin.)

**3. ZENGİN İÇERİK ELEMANLARI (RANK MATH ZENGİN İÇERİK TESTLERİ):**
- **Tablolar:** Minimum 1 adet karşılaştırma tablosu (Rank Math tablo testi için)
- **Listeler:** Bolca bullet point ve numaralı liste kullan (okunabilirlik için kritik)
- **İstatistikler:** Güncel veriler, araştırmalar ve sayısal bilgiler ekle
- **Örnekler:** Pratik case study'ler, gerçek hayattan örnekler
- **Yapısal Veriler:** Schema markup dostu içerik yapısı

**4. OKUNABİLİRLİK OPTİMİZASYONU:**
- **Cümle Uzunluğu:** Basit ve anlaşılır cümleler
- **Aktif Ses:** Pasif ses yerine aktif ses kullan
- **Geçiş Kelimeleri:** Paragraflar arası akıcı geçişler
- **Dil Seviyesi:** Orta seviye, uzman ama anlaşılır

**5. E-E-A-T UYUMLULUK:**
- **Uzmanlık:** Konunun derinlemesine bilgisi
- **Deneyim:** Pratik tavsiyeler ve gerçek örnekler
- **Otorite:** Güvenilir kaynaklar ve güncel veriler
- **Güvenilirlik:** Tam ve doğru bilgiler

**6. TEKNİK SEO:**
- **Meta Başlık:** 55-60 karakter, odak anahtar kelime içeren
- **Meta Açıklama:** 150-160 karakter, CTA içeren
- **URL Slug:** Kısa, anahtar kelime içeren
- **İç Link:** Mantıklı iç bağlantılar öner

**İÇERİK ÜRETİM STRATEJİSİ:**
1. **Araştırma ve Planlama:** Konuyu derinlemesine araştır
2. **Anahtar Kelime Entegrasyonu:** Doğal ve stratejik yerleştirme
3. **Zengin İçerik:** Tablo, liste, görsel ile çeşitlendir
4. **Uzunluk Garantisi:** 1500+ kelimeyi doldurmak için detaylandır, çabalamaya çalış ama dolmuyorsa da aynı şeyleri tekrarlama.
5. **Okunabilirlik:** Kısa paragraflar ve anlaşılır dil
6. **SEO Skoru:** Rank Math 100/100 için tüm kriterleri karşılamaya çalış

**ÇIKTI FORMATI:**
Aşağıdaki yapıyı KESİNLİKLE kullan, başka açıklama ekleme:

[ODAK_ANAHTAR_KELIME_START]
${focusKeyword || 'Sen belirle: 2-4 kelimelik odak anahtar kelime'}
[ODAK_ANAHTAR_KELIME_END]

[YARDIMCI_ANAHTAR_KELIMELER_START]
yardımcı kelime 1, yardımcı kelime 2, yardımcı kelime 3, yardımcı kelime 4, yardımcı kelime 5, yardımcı kelime 6, yardımcı kelime 7
[YARDIMCI_ANAHTAR_KELIMELER_END]

[BASLIKLAR_START]
${title ? `SEO Optimizeli ${title} (55-60 karakter)` : 'Başlık 1 (55-60 karakter)'}
${title ? `Detaylı ${title} Rehberi (55-60 karakter)` : 'Başlık 2 (55-60 karakter)'}
${title ? `${title} - 2024 Güncel Bilgiler (55-60 karakter)` : 'Başlık 3 (55-60 karakter)'}
[BASLIKLAR_END]

[URL_SLUG_START]
${focusKeyword ? focusKeyword.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'seo-optimizeli-baslik'}
[URL_SLUG_END]

[META_ACIKLAMA_START]
${focusKeyword ? `${focusKeyword} hakkında kapsamlı rehber. Detaylı bilgiler, güncel veriler ve pratik tavsiyeler. Hemen öğrenmek için tıklayın!` : 'Konu hakkında uzman görüşleri, güncel bilgiler ve detaylı açıklamalar. Profesyonel rehber için içeriğimizi inceleyin.'}
[META_ACIKLAMA_END]

[ICERIK_START]
<!-- Rank Math 100/100 Skor İçin Kritik Notlar:
- İçerik toplam uzunluğu: 1500-2000 kelime minimum
- Anahtar kelime yoğunluğu: %1-2 arasında
- Kısa paragraflar: Maksimum 120 kelime
- Görsel sayısı: Minimum 4 adet
- Tablo sayısı: Minimum 1 adet
- Liste kullanımı: Bolca bullet point ve numaralı liste
-->

<h1>H1 Başlık - Odak Anahtar Kelime İçeren</h1>

<p><strong>Odak anahtar kelime</strong> konusunda kapsamlı bir rehber sunmak için bu makaleyi hazırladık. Güncel bilgiler, pratik uygulamalar ve uzman görüşleri ile konuyu derinlemesine ele alacağız.</p>

<p>Konunun temel sorusuna 40-50 kelimelik Featured Snippet cevabı burada yer alacak. Bu bölüm Google'ın öne çıkan snippet özelliği için optimize edilmiştir.</p>

<h2>Temel Kavramlar ve Tanım</h2>
<p>Öncelikle <strong>odak anahtar kelime</strong> nedir ve neden önemlidir anlamaya çalışalım. Bu kavram, modern dünyada vazgeçilmez bir rol oynuyor.</p>

<p>Kısaca açıklamak gerekirse, temel kavram şu şekilde işliyor. İlk olarak temel prensipleri anlamak gerekiyor. Daha sonra detaylara inmek mümkün oluyor.</p>

<h2>Kapsamlı Uygulama Rehberi</h2>
<p>Şimdi uygulamaya geçelim. <strong>Odak anahtar kelime</strong> konusunda uzmanların önerileri ve pratik adımlar oldukça önemli.</p>

<h3>Adım 1: Başlangıç ve Hazırlık</h3>
<p>İlk adımda temel hazırlıkları tamamlamanız gerekiyor. Bu aşama, tüm sürecin temelini oluşturuyor.</p>

<ul>
    <li><strong>Gerekli araçlar</strong> - Başlamak için hangi araçlara ihtiyacınız var?</li>
    <li><strong>Temel bilgiler</strong> - Konu hakkında temel bilgileri edinmek</li>
    <li><strong>Planlama</strong> - Detaylı bir plan yapmak</li>
    <li><strong>Kaynak araştırması</strong> - Güvenilir kaynaklar bulmak</li>
</ul>

<h3>Adım 2: Detaylı Uygulama</h3>
<p>İkinci aşamada uygulamaya geçiyoruz. Bu adım, teoriyi pratiğe dönüştürme sürecidir.</p>

<ol>
    <li>Birinci aşama: Temel kurulum ve yapılandırma</li>
    <li>İkinci aşama: Detaylı inceleme ve analiz</li>
    <li>Üçüncü aşama: Uygulama ve test</li>
    <li>Dördüncü aşama: İyileştirme ve optimizasyon</li>
</ol>

<h2>İstatistikler ve Güncel Veriler</h2>
<p><strong>Odak anahtar kelime</strong> konusunda güncel istatistikler oldukça önemli. İşte dikkat çekici bazı veriler:</p>

<p>Son araştırmalara göre, konunun önemi her geçen gün artıyor. İşte bazı önemli bulgular:</p>

<ul>
    <li>Yüzde 70'den fazla kullanıcı temel bilgileri arıyor</li>
    <li>Ortalama kullanım süresi önemli ölçüde arttı</li>
    <li>Uzman görüşleri giderek daha fazla önem kazanıyor</li>
</ul>

<h2>Karşılaştırma Tablosu</h2>
<p>Farklı yaklaşımları karşılaştıralım:</p>

<table>
    <thead>
        <tr>
            <th>Yöntem</th>
            <th>Avantajlar</th>
            <th>Dezavantajlar</th>
            <th>Önerilen Kullanım</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Geleneksel Yöntem</td>
            <td>Güvenilir, test edilmiş</td>
            <td>Yavaş, karmaşık</td>
            <td>Temel kullanım için</td>
        </tr>
        <tr>
            <td>Modern Yaklaşım</td>
            <td>Hızlı, etkili</td>
            <td>Öğrenme eğrisi</td>
            <td>Gelişmiş kullanım için</td>
        </tr>
    </tbody>
</table>

<h2>En İyi Uygulamalar ve Tavsiyeler</h2>
<p>Uzmanların önerileri doğrultusunda en iyi uygulamaları sizlerle paylaşıyoruz.</p>

<h3>Profesyonel Tavsiyeler</h3>
<p>Konunun uzmanları şu noktalara dikkat çekiyor:</p>

<p>İlk olarak, kaliteli kaynak kullanmak çok önemli. Güvenilir bilgiler, başarılı sonuçların anahtarıdır.</p>

<p>İkinci olarak, sürekli güncel kalmak gerekiyor. Teknoloji hızla değişiyor ve gelişiyor.</p>

<h2>Görsel ve Medya Kullanımı</h2>
<p>Konuyu daha iyi anlamak için görseller oldukça yardımcı oluyor.</p>

<p><em>Görsel 1: Temel kavramları gösteren diyagram (dosya: temel-kavramlar-diagram.png, alt metin: Odak anahtar kelime temel kavramları görsel açıklaması)</em></p>

<p><em>Görsel 2: Uygulama adımları akış şeması (dosya: uygulama-adimlari-schema.png, alt metin: Detaylı uygulama süreci görseli)</em></p>

<p><em>Görsel 3: İstatistikler grafik (dosya: istatistikler-grafik.png, alt metin: Güncel verilerin görsel sunumu)</em></p>

<p><em>Görsel 4: Karşılaştırma tablosu (dosya: karsilastirma-tablosu.png, alt metin: Farklı yöntemlerin karşılaştırılması)</em></p>

<h2>Gelişmiş Teknikler ve İpuçları</h2>
<p>Daha gelişmiş kullanıcılar için bazı özel teknikler ve ipuçları:</p>

<p>Konunun derinliklerine inmeye başladığınızda, bazı gelişmiş teknikler oldukça faydalı oluyor.</p>

<p>Öncelikle optimizasyon tekniklerini öğrenmek gerekiyor. Bu teknikler, verimliliği önemli ölçüde artırıyor.</p>

<h2>Sık Karşılaşılan Problemler ve Çözümleri</h2>
<p>Uygulama sırasında karşılaşabileceğiniz yaygın problemler ve çözümleri:</p>

<p>Birçok kullanıcı benzer sorunlarla karşılaşıyor. Bunların çoğu, basit çözümlerle aşılabiliyor.</p>

<h3>Yaygın Sorun 1: Başlangıç Güçlükleri</h3>
<p>Çoğu kişi başlangıçta bazı zorluklar yaşıyor. Bu oldukça normal bir durum.</p>

<p>Çözüm olarak, adım adım ilerlemek ve temel prensipleri anlamak önemli.</p>

<h3>Yaygın Sorun 2: İleri Düzey Problemler</h3>
<p>Daha gelişmiş aşamalarda farklı tür sorunlar ortaya çıkabiliyor.</p>

<p>Bu durumda, uzman desteği almak faydalı olabiliyor.</p>

<h2>Gelecek Trendleri ve Öngörüler</h2>
<p><strong>Odak anahtar kelime</strong> konusunda gelecekte bizi neler bekliyor?</p>

<p>Teknolojinin hızla gelişmesiyle birlikte, yeni trendler ortaya çıkıyor.</p>

<p>Uzmanlar, gelecekte şu gelişmelerin yaşanacağını öngörüyor:</p>

<ul>
    <li>Daha akıllı sistemlerin ortaya çıkması</li>
    <li>Kullanıcı deneyimini iyileştiren yeni özellikler</li>
    <li>Daha hızlı ve etkili çözümler</li>
</ul>

<h2>Uzman Görüşleri ve Önerileri</h2>
<p>Konunun önde gelen uzmanlarının görüşleri oldukça değerli.</p>

<p>Dr. Ahmet Yılmaz: "Bu alanda önemli gelişmeler yaşanıyor. Gelecekte çok daha etkili çözümler göreceğiz."</p>

<p>Prof. Ayşe Kaya: "Temel prensipleri anlamak, başarılı olmanın anahtarıdır."</p>

<h2>Detaylı Örnek Çalışmalar</h2>
<p>Gerçek hayattan örnekler, konuyu daha iyi anlamamıza yardımcı oluyor.</p>

<h3>Başarılı Bir Uygulama Örneği</h3>
<p>Bir şirketin deneyimini inceleyelim. Bu örnek, iyi bir uygulama örneği olabilir.</p>

<p>Şirket, sistematik bir yaklaşım benimseyerek önemli başarılar elde etti.</p>

<h3>Başka Bir Örnek: Eğitim Sektörü</h3>
<p>Eğitim alanında da benzer başarı hikayeleri mevcut.</p>

<p>Öğrenciler ve eğitmenler, yeni yöntemlerle önemli kazanımlar elde ediyor.</p>

<h2>Sonuç ve Öneriler</h2>
<p><strong>Odak anahtar kelime</strong> konusunda kapsamlı bir yolculuk yaptık. Umarız bu rehber sizlere faydalı olmuştur.</p>

<p>Özetlemek gerekirse, temel kavramları anlamak, doğru uygulamak ve sürekli güncel kalmak çok önemli.</p>

<p>Unutmayın, başarı için sabır ve tutarlılık gerekiyor. Adım adım ilerleyerek, hedeflerinize ulaşabilirsiniz.</p>

<p>Bu alanda daha fazla bilgi için uzman kaynakları takip etmenizi öneririz.</p>
[ICERIK_END]

[SSS_BOLUMU_START]
<h2>Sıkça Sorulan Sorular</h2>
<h3>Konuyla ilgili temel soru 1?</h3>
<p>Detaylı ve doyurucu cevap. Bu bölüm, Google'ın "Kullanıcılar bunları da sordu" (People Also Ask) özelliği için optimize edilmiştir.</p>

<h3>Konuyla ilgili temel soru 2?</h3>
<p>Uzman görüşü ile kapsamlı açıklama. Pratik örnekler ve gerçek hayattan case study'ler içerir.</p>

<h3>Konuyla ilgili temel soru 3?</h3>
<p>Kapsamlı açıklama ve adım adım çözüm önerileri. Görseller ve diyagramlar ile desteklenir.</p>

<h3>Konuyla ilgili teknik soru?</h3>
<p>Teknik detaylar ve gelişmiş özellikler hakkında bilgi. Kod örnekleri ve teknik spesifikasyonlar içerir.</p>

<h3>Konuyla ilgili maliyet/fiyat sorusu?</h3>
<p>Maliyet analizi ve bütçe önerileri. Farklı seçeneklerin karşılaştırılması ve öneriler.</p>

<h3>Konuyla ilgili gelecek trendleri?</h3>
<p>Gelecek öngörüleri ve trend analizi. Uzman görüşleri ve araştırma verileri ile desteklenir.</p>
[SSS_BOLUMU_END]
`;
};

class GeminiService {
    async generateContent(inputData) {
        try {
            // inputData yapısını kontrol et ve düzenle
            let processedInput = inputData;

            // Eski format desteği için geriye uyumluluk
            if (typeof inputData === 'string') {
                processedInput = { content: inputData };
            }

            const { title, focusKeyword, content } = processedInput;

            // En az bir input olduğundan emin ol
            if (!title && !focusKeyword && !content) {
                throw new Error('En az bir input (başlık, odak anahtar kelime veya içerik) sağlanmalıdır.');
            }

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const fullPrompt = basePromptTemplate(processedInput);

            console.log("Gemini'ye gönderilen prompt'un başlangıcı:", fullPrompt.substring(0, 200));

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            console.log("Gemini'den ham cevap alındı.");

            // Ham cevabı log dosyasına kaydet
            await loggerService.logGeminiResponse(
                processedInput,
                fullPrompt,
                text,
                new Date().toISOString()
            );

            return this.parseResponse(text);

        } catch (error) {
            console.error("Gemini API Hatası:", error);
            throw new Error("İçerik üretilirken bir hata oluştu: " + error.message);
        }
    }

    parseResponse(text) {
        const content = this.extractSection(text, "ICERIK")[0] || '';
        const faq = this.extractSection(text, "SSS_BOLUMU")[0] || '';

        // Yardımcı anahtar kelimeleri virgülle ayır ve temizle
        const secondaryKeywordsRaw = this.extractSection(text, "YARDIMCI_ANAHTAR_KELIMELER")[0] || '';
        const secondary_keywords = secondaryKeywordsRaw
            .split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword.length > 0);

        const parsedData = {
            focus_keyword: this.extractSection(text, "ODAK_ANAHTAR_KELIME")[0] || '',
            secondary_keywords: secondary_keywords.join(', '), // Array'i string'e çevir
            titles: (this.extractSection(text, "BASLIKLAR")[0] || '').split('\n').filter(t => t.trim() !== ''),
            slug: this.extractSection(text, "URL_SLUG")[0] || '',
            meta_description: this.extractSection(text, "META_ACIKLAMA")[0] || '',
            content: content + '\n' + faq, // Ana içeriğe SSS bölümünü ekliyoruz
        };

        if (parsedData.titles.length === 0) {
            parsedData.titles = ["Başlık Üretilemedi"];
        }

        return parsedData;
    }

    extractSection(text, sectionName) {
        const regex = new RegExp(`\\[${sectionName}_START\\]([\\s\\S]*?)\\[${sectionName}_END\\]`, 'gm');
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        return matches;
    }
}

module.exports = new GeminiService();