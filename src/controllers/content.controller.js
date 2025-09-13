const geminiService = require('../features/gemini/gemini.service');
const wordpressService = require('../features/wordpress/wordpress.service');
const loggerService = require('../features/logger/logger.service');

class ContentController {
    async generateAndPost(req, res) {
        const { title, focusKeyword, content: inputText } = req.body;

        // En az bir parametre kontrolü
        if (!title && !focusKeyword && !inputText) {
            return res.status(400).json({
                error: 'Lütfen en az bir parametre girin: başlık, odak anahtar kelime veya metin.'
            });
        }

        try {
            // Input verilerini hazırla
            const inputData = {};
            if (title) inputData.title = title.trim();
            if (focusKeyword) inputData.focusKeyword = focusKeyword.trim();
            if (inputText) inputData.content = inputText.trim();

            // 1. Gemini'den içeriği üret
            const generatedData = await geminiService.generateContent(inputData);

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
            await loggerService.logContentGeneration(
                { title, focusKeyword, content: inputText },
                generatedData,
                result,
                req
            );

        } catch (error) {
            console.error("Controller Hatası:", error.message);

            // Hatayı logla
            await loggerService.logContentError(
                'generate_and_post',
                { title, focusKeyword, content: inputText },
                error,
                req
            );

            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ContentController();