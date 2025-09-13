const fs = require('fs').promises;
const path = require('path');

class LoggerService {
    constructor() {
        this.logsDir = path.join(__dirname, '../../logs');
        this.ensureLogsDir();
    }

    async ensureLogsDir() {
        try {
            await fs.access(this.logsDir);
        } catch {
            await fs.mkdir(this.logsDir, { recursive: true });
        }
    }

    async log(filename, data) {
        try {
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}]\n${JSON.stringify(data, null, 2)}\n\n---\n\n`;

            const logPath = path.join(this.logsDir, filename);
            await fs.appendFile(logPath, logEntry, 'utf8');

            console.log(`📝 Log kaydedildi: ${filename}`);
        } catch (error) {
            console.error('❌ Log yazma hatası:', error.message);
            throw error;
        }
    }

    // Content generation başarı logları
    async logContentGeneration(inputData, generatedData, wordpressResult, req = null) {
        const logData = {
            operation: 'generate_and_post',
            status: 'success',
            inputData: {
                title: inputData.title || null,
                focusKeyword: inputData.focusKeyword || null,
                contentLength: inputData.content ? inputData.content.length : 0,
                contentPreview: inputData.content ? inputData.content.substring(0, 100) + '...' : null
            },
            generatedData: {
                focusKeyword: generatedData.focus_keyword,
                secondaryKeywords: generatedData.secondary_keywords,
                titles: generatedData.titles,
                slug: generatedData.slug,
                metaDescription: generatedData.meta_description,
                contentLength: generatedData.content ? generatedData.content.length : 0
            },
            wordpressResult: {
                postId: wordpressResult.id,
                url: wordpressResult.link,
                status: 'published'
            },
            requestInfo: req ? {
                userAgent: req.get('User-Agent') || 'Unknown',
                ipAddress: req.ip || req.connection?.remoteAddress || 'Unknown'
            } : null,
            timestamp: new Date().toISOString()
        };

        await this.log('content_generation.log', logData);
    }

    // Content generation hata logları
    async logContentError(operation, inputData, error, req = null) {
        const logData = {
            operation: operation,
            status: 'error',
            inputData: {
                title: inputData.title || null,
                focusKeyword: inputData.focusKeyword || null,
                contentLength: inputData.content ? inputData.content.length : 0,
                contentPreview: inputData.content ? inputData.content.substring(0, 100) + '...' : null
            },
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            requestInfo: req ? {
                userAgent: req.get('User-Agent') || 'Unknown',
                ipAddress: req.ip || req.connection?.remoteAddress || 'Unknown'
            } : null,
            timestamp: new Date().toISOString()
        };

        await this.log('controller_errors.log', logData);
    }

    // Gemini API response logları
    async logGeminiResponse(inputData, prompt, response, timestamp) {
        const logData = {
            inputData: {
                title: inputData.title || null,
                focusKeyword: inputData.focusKeyword || null,
                contentLength: inputData.content ? inputData.content.length : 0
            },
            prompt: prompt.substring(0, 500) + '...', // İlk 500 karakter
            rawResponse: response,
            timestamp: timestamp || new Date().toISOString()
        };

        await this.log('gemini_responses.log', logData);
    }

    // Google Trends logları
    async logTrendsOperation(operation, status, data = {}, req = null) {
        const logData = {
            operation: operation,
            status: status,
            data: data,
            requestInfo: req ? {
                userAgent: req.get('User-Agent') || 'Unknown',
                ipAddress: req.ip || req.connection?.remoteAddress || 'Unknown'
            } : null,
            timestamp: new Date().toISOString()
        };

        await this.log('google_trends_operations.log', logData);
    }

    // Manual run logları
    async logManualRun(operation, status, data = {}, req = null) {
        const logData = {
            operation: operation,
            status: status,
            data: data,
            requestInfo: req ? {
                userAgent: req.get('User-Agent') || 'Unknown',
                ipAddress: req.ip || req.connection?.remoteAddress || 'Unknown'
            } : null,
            timestamp: new Date().toISOString()
        };

        await this.log('manual_run_operations.log', logData);
    }

    // WordPress operations logları
    async logWordPressOperation(operation, status, data = {}, req = null) {
        const logData = {
            operation: operation,
            status: status,
            data: data,
            requestInfo: req ? {
                userAgent: req.get('User-Agent') || 'Unknown',
                ipAddress: req.ip || req.connection?.remoteAddress || 'Unknown'
            } : null,
            timestamp: new Date().toISOString()
        };

        await this.log('wordpress_operations.log', logData);
    }

    // Genel amaçlı log metodu
    async logGeneral(filename, operation, status, data = {}, req = null) {
        const logData = {
            operation: operation,
            status: status,
            data: data,
            requestInfo: req ? {
                userAgent: req.get('User-Agent') || 'Unknown',
                ipAddress: req.ip || req.connection?.remoteAddress || 'Unknown'
            } : null,
            timestamp: new Date().toISOString()
        };

        await this.log(filename, logData);
    }
}

module.exports = new LoggerService();
