const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');

router.post('/generate-and-post', contentController.generateAndPost);

module.exports = router;