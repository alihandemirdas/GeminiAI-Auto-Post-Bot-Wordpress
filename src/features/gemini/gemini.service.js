const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Loglama fonksiyonu
async function logToFile(filename, data) {
    try {
        const logDir = path.join(__dirname, '../../logs');
        const logPath = path.join(logDir, filename);

        // Logs klasörü yoksa oluştur
        try {
            await fs.access(logDir);
        } catch {
            await fs.mkdir(logDir, { recursive: true });
        }

        // Zaman damgası ekle
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}]\n${JSON.stringify(data, null, 2)}\n\n---\n\n`;

        // Dosyaya ekle (append mode)
        await fs.appendFile(logPath, logEntry, 'utf8');
    } catch (error) {
        console.error('Log yazma hatası:', error.message);
    }
}

const basePromptTemplate = `
Sen, Google'ın E-E-A-T (Deneyim, Uzmanlık, Otorite, Güvenilirlik) prensiplerini benimsemiş, Rank Math SEO eklentisiyle 90+ skor almayı hedefleyen bir SEO içerik stratejistisin. Sana verdiğim konuyla ilgili, kullanıcı arama niyetini (search intent) tamamen karşılayan, son derece detaylı, özgün ve uzman bir dille yazılmış bir makale/haber hazırla.

**KESİN UYULMASI GEREKEN KURALLAR:**

1.  **Anahtar Kelimeler:**
    -   **Odak Anahtar Kelime:** Konuyla en alakalı, 2-4 kelimelik TEK bir odak anahtar kelime belirle.
    -   **Yardımcı Anahtar Kelimeler:** Odak anahtar kelimeyi destekleyen, LSI (Latent Semantic Indexing) prensiplerine uygun, virgülle ayrılmış 3-5 adet yardımcı anahtar kelime belirle.
    -   **Kullanım:** Odak anahtar kelime; H1 başlıkta, ilk paragrafta, en az bir H2 başlıkta, URL'de ve meta açıklamada MUTLAKA geçmelidir. Yardımcı anahtar kelimeler metin içinde doğal bir şekilde serpiştirilmelidir.

2.  **İçerik Yapısı ve Okunabilirlik:**
    -   **Kelime Sayısı:** Minimum 1500 kelime.
    -   **Yapı:** Giriş, detaylı alt başlıklar (H2, H3) ve genel değerlendirme şeklinde, ancak 'giriş' ve 'sonuç' kelimelerini başlık olarak kullanma.
    -   **Okunabilirlik:** Paragraflar en fazla 3-4 cümleden oluşsun. Metin içinde mantıklı yerlerde **maddeleme (bullet points)** ve **numaralı listeler** kullan. Önemli terimleri veya anahtar kelimeleri doğal bir şekilde **kalın (bold)** olarak vurgula.
    -   **Featured Snippet:** Makalenin giriş bölümünden hemen sonra, konunun en temel sorusuna net ve kısa (40-50 kelime) bir cevap veren bir paragraf ekle. Bu, Google'ın "Öne Çıkan Snippet" alanı için optimize edilmelidir.

3.  **Meta Verileri (Rank Math için Optimize Edilmiş):**
    -   **Başlıklar (Titles):** SEO uyumlu, ilgi çekici, başlıkta Odak Anahtar Kelime geçen, 55-60 karakter aralığında 3 adet başlık öner. Başlıklarda sayı veya soru kullanmak performansı artırabilir.
    -   **URL Slug:** Odak anahtar kelimeyi içeren, kısa (max 70 karakter), sadece küçük harf ve kelimeler arasında tire (-) içeren bir yapı oluştur.
    -   **Meta Açıklama:** Odak anahtar kelimeyi içeren, kullanıcıyı tıklamaya teşvik eden bir eylem çağrısı (call-to-action) içeren, 150-160 karakter aralığında bir açıklama yaz.

4.  **E-E-A-T ve Yapısal Veri:**
    -   **Uzmanlık:** Metni, konunun uzmanı bir kişi yazmış gibi kaleme al. Teknik detaylardan kaçınma.
    -   **SSS (FAQ) Bölümü:** Makalenin sonuna, konuyla ilgili Google'da "Kullanıcılar bunları da sordu" (People Also Ask) bölümünde çıkabilecek 3-4 adet soruyu ve cevabını içeren bir SSS bölümü ekle. Bu bölüm, Rank Math'in FAQ Schema'sı ile uyumlu olmalıdır.

**ÇIKTI FORMATI:**
Tüm çıktıyı AŞAĞIDAKİ GİBİ FORMATLA. Başka hiçbir açıklama, giriş veya sonuç cümlesi EKLEME. Sadece bu yapıyı kullanarak cevap ver.

[ODAK_ANAHTAR_KELIME_START]
Sadece 1 adet, 2-4 kelimelik odak anahtar kelime buraya gelecek
[ODAK_ANAHTAR_KELIME_END]

[YARDIMCI_ANAHTAR_KELIMELER_START]
yardımcı kelime 1, yardımcı kelime 2, yardımcı kelime 3
[YARDIMCI_ANAHTAR_KELIMELER_END]

[BASLIKLAR_START]
Önerilen Başlık 1 (55-60 karakter)
Önerilen Başlık 2 (55-60 karakter)
Önerilen Başlık 3 (55-60 karakter)
[BASLIKLAR_END]

[URL_SLUG_START]
onerilen-kisa-url-buraya
[URL_SLUG_END]

[META_ACIKLAMA_START]
150-160 karakterlik, odak anahtar kelimeyi ve eylem çağrısını içeren meta açıklama buraya gelecek.
[META_ACIKLAMA_END]

[ICERIK_START]
<h1>Odak Anahtar Kelimeyi İçeren H1 Başlık</h1>
<p><b>Odak Anahtar Kelime</b> hakkında bilgi veren ve anahtar kelimenin geçtiği ilk paragraf...</p>
<p>Konunun en temel sorusuna verilen net ve kısa Featured Snippet cevabı burada yer alacak.</p>
<h2>Odak veya Yardımcı Anahtar Kelimeyi İçeren H2 Başlık</h2>
<p>Kısa ve okunabilir bir paragraf...</p>
<p>Bir diğer kısa paragraf. <strong>Önemli bir terim</strong> burada vurgulanabilir.</p>
<h3>Detaylandıran Bir H3 Başlık</h3>
<ul>
    <li>Maddeleme 1</li>
    <li>Maddeleme 2</li>
    <li>Maddeleme 3</li>
</ul>
<h2>İstatistikler veya Veriler İçeren Bir H2 Başlık</h2>
<ol>
    <li>Numaralı liste öğesi 1. Detaylar ve açıklamalar. [Örnek bir dış link için kaynak]</li>
    <li>Numaralı liste öğesi 2. Detaylar ve açıklamalar.</li>
</ol>
<p>... metnin geri kalanı (toplamda en az 1500 kelime olacak şekilde) ...</p>
[ICERIK_END]

[SSS_BOLUMU_START]
<h2>Sıkça Sorulan Sorular</h2>
<h3>Konuyla İlgili Bir Soru 1?</h3>
<p>Bu soruya verilen net ve doyurucu cevap.</p>
<h3>Konuyla İlgili Bir Soru 2?</h3>
<p>Bu soruya verilen net ve doyurucu cevap.</p>
<h3>Konuyla İlgili Bir Soru 3?</h3>
<p>Bu soruya verilen net ve doyurucu cevap.</p>
[SSS_BOLUMU_END]

---

**İŞLENECEK METİN:**
`;

class GeminiService {
    async generateContent(inputText) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const fullPrompt = basePromptTemplate + inputText;
            
            console.log("Gemini'ye gönderilen prompt'un başlangıcı:", fullPrompt.substring(0, 200));

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            console.log("Gemini'den ham cevap alındı.");

            // Ham cevabı log dosyasına kaydet
            await logToFile('gemini_responses.log', {
                prompt: fullPrompt.substring(0, 500) + '...', // İlk 500 karakter
                rawResponse: text,
                timestamp: new Date().toISOString()
            });

            return this.parseResponse(text);

        } catch (error) {
            console.error("Gemini API Hatası:", error);
            throw new Error("İçerik üretilirken bir hata oluştu.");
        }
    }

    parseResponse(text) {
        const content = this.extractSection(text, "ICERIK")[0] || '';
        const faq = this.extractSection(text, "SSS_BOLUMU")[0] || '';
        
        const parsedData = {
            focus_keyword: this.extractSection(text, "ODAK_ANAHTAR_KELIME")[0] || '',
            secondary_keywords: this.extractSection(text, "YARDIMCI_ANAHTAR_KELIMELER")[0] || '',
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