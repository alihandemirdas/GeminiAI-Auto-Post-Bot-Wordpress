const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const googleTrendsController = require('../controllers/google-trends.controller');

// Mevcut içerik üretme endpoint'i
router.post('/generate-and-post', contentController.generateAndPost);

// Google Trends endpoint'leri
router.get('/trends', googleTrendsController.getTrends);
router.post('/trends/generate-content', googleTrendsController.generateContentForTrend);


module.exports = router;