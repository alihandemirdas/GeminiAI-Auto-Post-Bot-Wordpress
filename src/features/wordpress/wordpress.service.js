// src/features/wordpress/wordpress.service.js

const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Genel loglama fonksiyonu
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

class WordPressService {
    constructor() {
        this.wpUrl = process.env.WP_URL;
        this.username = process.env.WP_USER;
        this.password = process.env.WP_PASSWORD;
        this.apiUrl = `${this.wpUrl}/wp-json/wp/v2/posts`;
        this.authHeader = 'Basic ' + Buffer.from(this.username + ':' + this.password).toString('base64');
    }

    async createDraftPost({ title, content, slug, meta_description, focus_keyword, secondary_keywords }) {
        if (!title || !content) {
            throw new Error("Başlık veya içerik boş olamaz.");
        }

        // Gelen verileri Rank Math'in beklediği formata hazırlıyoruz.
        // Odak ve yardımcı anahtar kelimeleri virgülle birleştirerek tek bir string oluşturuyoruz.
        const allKeywords = [focus_keyword, secondary_keywords].filter(Boolean).join(', ');

        const postData = {
            title: title,
            content: content,
            status: 'draft',
            slug: slug,
            meta: {
                rank_math_title: title, // SEO Başlığı olarak da yazının başlığını kullanalım
                rank_math_description: meta_description,
                rank_math_focus_keyword: allKeywords
            }
        };

        try {
            console.log("WordPress'e Rank Math verileriyle gönderiliyor:", this.apiUrl);
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.authHeader
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("WordPress API Hatası:", errorData);
                // Hata mesajını daha anlaşılır hale getirelim
                const errorMessage = errorData.message || response.statusText;
                throw new Error(`WordPress'e gönderilemedi: ${errorMessage}`);
            }

            const data = await response.json();
            console.log("Yazı taslak olarak başarıyla oluşturuldu. ID:", data.id);

            // Başarılı işlemi logla
            await logToFile('wordpress_operations.log', {
                operation: 'create_draft_post',
                status: 'success',
                postId: data.id,
                title: title,
                url: data.link
            });

            return data;
        } catch (error) {
            console.error("WordPress Servis Hatası:", error);

            // Hatayı logla
            await logToFile('wordpress_errors.log', {
                operation: 'create_draft_post',
                status: 'error',
                error: error.message,
                postData: {
                    title: title,
                    content: content ? content.substring(0, 200) + '...' : '',
                    slug: slug,
                    meta_description: meta_description,
                    focus_keyword: focus_keyword,
                    secondary_keywords: secondary_keywords
                }
            });

            throw error;
        }
    }
}

module.exports = new WordPressService();