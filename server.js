// server.js

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');


// ALTERADO: Corrija os caminhos para apontar para a pasta 'src'
const audioRoutes = require('./src/routes/audioRoutes');
const authRoutes = require('./src/routes/authRoutes');
const playlistRoutes = require('./src/routes/playlistRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const userRoutes = require('./src/routes/userRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(cors()); // 2. USE O MIDDLEWARE CORS AQUI
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Este caminho agora funciona corretamente a partir da raiz
app.use('/files', express.static('uploads'));

app.get('/api', (req, res) => {
    res.json({ message: 'Bem-vindo à API de áudios!' });
});

// Usar os roteadores
app.use('/api/audio', audioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes); 
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/history', historyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use((err, req, res, next) => {
  // Lógica do middleware de erro
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://192.168.3.9:${PORT}`);
});