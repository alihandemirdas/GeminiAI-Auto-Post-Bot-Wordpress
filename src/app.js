const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// JSON body parser ve public klasörünü statik olarak sunma
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API rotalarını tanımla
app.use('/api', apiRoutes);

// Ana sayfa için index.html'i sun
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});