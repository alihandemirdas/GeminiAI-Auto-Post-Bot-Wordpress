const googleTrendsService = require('../features/google-trends/google-trends.service');
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

class GoogleTrendsController {

    // Google Trends'den güncel trend'leri getir
    async getTrends(req, res) {
        try {
            console.log('🌐 Google Trends verileri çekiliyor...');

            const trends = await googleTrendsService.fetchTrends();

            if (!trends || trends.length === 0) {
                return res.status(404).json({
                    error: 'Trend konusu bulunamadı.',
                    message: 'Google Trends\'den veri alınamadı.'
                });
            }

            console.log(`✅ ${trends.length} adet trend konusu bulundu.`);

            res.status(200).json({
                message: 'Trend verileri başarıyla çekildi.',
                count: trends.length,
                trends: trends,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Trend çekme hatası:', error);

            // Hatayı logla
            await logToFile('controller_errors.log', {
                operation: 'get_trends',
                status: 'error',
                error: error.message,
                stack: error.stack
            });

            res.status(500).json({
                error: 'Trend verileri alınırken bir hata oluştu.',
                message: error.message
            });
        }
    }

    // Belirli bir trend için içerik üret (kullanıcıdan input ile)
    async generateContentForTrend(req, res) {
        const { trendTitle, userInput } = req.body;

        if (!trendTitle) {
            return res.status(400).json({
                error: 'Trend başlığı gerekli.',
                message: 'Lütfen bir trend başlığı belirtin.'
            });
        }

        if (!userInput || userInput.trim().length === 0) {
            return res.status(400).json({
                error: 'Kullanıcı input gerekli.',
                message: 'Lütfen içerik üretimi için metin girin.'
            });
        }

        try {
            console.log(`🎯 "${trendTitle}" için içerik üretiliyor...`);

            // Trend başlığını ve kullanıcı input'unu birleştir
            const combinedInput = `${trendTitle}\n\nKullanıcı isteği: ${userInput}`;

            // Gemini'den içerik üret
            console.log(`🤖 "${trendTitle}" için içerik üretiliyor...`);
            const generatedData = await geminiService.generateContent(combinedInput);

            if (!generatedData || !generatedData.content) {
                throw new Error('İçerik üretilemedi.');
            }

            // İçeriği WordPress'e gönder
            const postDetails = {
                title: generatedData.titles[0] || trendTitle,
                content: generatedData.content,
                slug: generatedData.slug || this.generateSlug(trendTitle),
                meta_description: generatedData.meta_description,
                focus_keyword: generatedData.focus_keyword || trendTitle,
                secondary_keywords: generatedData.secondary_keywords
            };

            console.log(`📝 İçerik WordPress'e gönderiliyor...`);
            const wordpressResult = await wordpressService.createDraftPost(postDetails);

            // Başarılı sonucu logla
            await logToFile('manual_content_generation.log', {
                operation: 'generate_content_for_trend',
                status: 'success',
                trendTitle: trendTitle,
                userInput: userInput,
                generatedTitle: postDetails.title,
                wordpressPostId: wordpressResult.id,
                wordpressUrl: wordpressResult.link
            });

            res.status(201).json({
                message: 'Trend için içerik başarıyla oluşturuldu!',
                trend: {
                    title: trendTitle,
                    userInput: userInput
                },
                generatedContent: {
                    title: postDetails.title,
                    focusKeyword: generatedData.focus_keyword,
                    secondaryKeywords: generatedData.secondary_keywords
                },
                wordpressPost: {
                    id: wordpressResult.id,
                    url: wordpressResult.link,
                    status: 'draft'
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Trend için içerik üretme hatası:', error);

            // Hatayı logla
            await logToFile('manual_content_errors.log', {
                operation: 'generate_content_for_trend',
                status: 'error',
                trendTitle: trendTitle,
                userInput: userInput,
                error: error.message,
                stack: error.stack
            });

            res.status(500).json({
                error: 'İçerik üretilirken bir hata oluştu.',
                message: error.message
            });
        }
    }



    // URL slug üret
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
}

module.exports = new GoogleTrendsController();
