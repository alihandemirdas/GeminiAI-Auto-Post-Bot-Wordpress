const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class GoogleTrendsService {
    constructor() {
        this.trendsUrl = 'https://trends.google.com/trending?geo=TR&hl=tr&hours=4&status=active&sort=recency';
        this.browser = null;
    }

    // Loglama fonksiyonu
    async logToFile(filename, message) {
        try {
            const logDir = path.join(__dirname, '../../logs');
            await fs.mkdir(logDir, { recursive: true });

            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] ${message}\n`;

            await fs.appendFile(path.join(logDir, filename), logMessage);
        } catch (error) {
            console.error('Log yazma hatası:', error.message);
        }
    }

    async initializeBrowser() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            });
        }
        return this.browser;
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async fetchTrends() {
        let page = null;

        try {
            console.log('🌐 Google Trends verileri çekiliyor...');
            await this.logToFile('google_trends_operations.log', 'Google Trends verileri çekme işlemi başlatıldı');

            // Tarayıcıyı başlat
            const browser = await this.initializeBrowser();
            page = await browser.newPage();

            // User agent ayarla
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            // Sayfa yükleme timeout'u
            await page.setDefaultTimeout(30000);

            // Sayfaya git
            await page.goto(this.trendsUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Sayfa tamamen yüklenene kadar bekle
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log('📄 Sayfa yüklendi, veriler çıkarılıyor...');

            // Trend verilerini çıkar
            const trends = await page.evaluate(() => {
                const trendsData = [];

                // Tüm trend satırlarını bul
                const trendRows = document.querySelectorAll('tr[jsname="oKdM2c"]');

                trendRows.forEach((row, index) => {
                    try {
                        // Trend başlığını çıkar
                        const titleElement = row.querySelector('div.mZ3RIc');
                        const title = titleElement ? titleElement.textContent.trim() : '';

                        // Arama sayısını çıkar
                        const searchVolumeElement = row.querySelector('div.qNpYPd');
                        const searchVolume = searchVolumeElement ? searchVolumeElement.textContent.trim() : '';

                        // Artış oranını çıkar
                        const increaseElement = row.querySelector('div.TXt85b');
                        const increase = increaseElement ? increaseElement.textContent.trim() : '';

                        // Başlangıç zamanını çıkar
                        const timeElement = row.querySelector('div.vdw3Ld');
                        const startTime = timeElement ? timeElement.textContent.trim() : '';

                        // Durum bilgisini çıkar
                        const statusElement = row.querySelector('div.TUfb9d div');
                        const status = statusElement ? statusElement.textContent.trim() : '';

                        if (title) {
                            trendsData.push({
                                id: index + 1,
                                title: title,
                                searchVolume: searchVolume,
                                increase: increase,
                                startTime: startTime,
                                status: status,
                                timestamp: new Date().toISOString()
                            });
                        }
                    } catch (error) {
                        console.error('Satır işleme hatası:', error.message);
                    }
                });

                return trendsData;
            });

            console.log(`✅ ${trends.length} trend bulundu`);
            await this.logToFile('google_trends_operations.log', `${trends.length} trend başarıyla çıkarıldı`);

            return trends;

        } catch (error) {
            console.error('❌ Google Trends hatası:', error.message);
            await this.logToFile('google_trends_operations.log', `Hata: ${error.message}`);

            throw new Error(`Google Trends verileri alınırken hata oluştu: ${error.message}`);
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    async getTopTrends(limit = 5) {
        try {
            const allTrends = await this.fetchTrends();

            // En çok aranan trendleri sırala (arama hacmine göre)
            const sortedTrends = allTrends.sort((a, b) => {
                // Arama hacmini sayıya çevir
                const getVolumeNumber = (volume) => {
                    if (volume.includes('500+')) return 500;
                    if (volume.includes('100+')) return 100;
                    return 0;
                };

                return getVolumeNumber(b.searchVolume) - getVolumeNumber(a.searchVolume);
            });

            return sortedTrends.slice(0, limit);
        } catch (error) {
            console.error('❌ En iyi trendler alınırken hata:', error.message);
            throw error;
        }
    }

    async cleanup() {
        await this.closeBrowser();
    }
}

module.exports = new GoogleTrendsService();
