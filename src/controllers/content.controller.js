const geminiService = require('../features/gemini/gemini.service');
const wordpressService = require('../features/wordpress/wordpress.service');
const fs = require('fs').promises;
const path = require('path');

// Genel loglama fonksiyonu
async function logToFile(filename, data) {
    try {
        const logDir = path.join(__dirname, '../logs');
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

class ContentController {
    async generateAndPost(req, res) {
        const { inputText } = req.body;

        if (!inputText) {
            return res.status(400).json({ error: 'Lütfen bir metin veya başlık girin.' });
        }

        try {
            // 1. Gemini'den içeriği üret
            const generatedData = await geminiService.generateContent(inputText);

            if (!generatedData || !generatedData.content || generatedData.titles.length === 0) {
                 throw new Error("Gemini'den geçerli bir cevap alınamadı.");
            }

            // 2. Üretilen içeriği WordPress'e gönder
            // Şimdilik ilk üretilen başlığı kullanalım
            const postDetails = {
                title: generatedData.titles[0],
                content: generatedData.content,
                slug: generatedData.slug,
                meta_description: generatedData.meta_description,
                focus_keyword: generatedData.focus_keyword,
                secondary_keywords: generatedData.secondary_keywords
            };
            
            const result = await wordpressService.createDraftPost(postDetails);

            // 3. Başarılı sonucu frontend'e geri gönder
            res.status(201).json({
                message: 'İçerik başarıyla oluşturuldu ve WordPress\'e taslak olarak kaydedildi!',
                wordpressPostUrl: result.link,
                generatedData: generatedData // Tüm üretilen veriyi de gönderelim
            });

            // Başarılı işlemi logla
            await logToFile('content_generation.log', {
                operation: 'generate_and_post',
                status: 'success',
                inputText: inputText.substring(0, 100) + '...',
                generatedTitle: generatedData.titles[0],
                wordpressPostId: result.id,
                wordpressUrl: result.link
            });

        } catch (error) {
            console.error("Controller Hatası:", error.message);

            // Hatayı logla
            await logToFile('content_errors.log', {
                operation: 'generate_and_post',
                status: 'error',
                inputText: inputText ? inputText.substring(0, 100) + '...' : '',
                error: error.message,
                stack: error.stack
            });

            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ContentController();