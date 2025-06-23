const express = require('express');
const router = express.Router();

const {
    uploadAudio,
    likeAudio,
    unlikeAudio,
    findAudioByName,
    findAudioByField,
    streamAudioFile
} = require('../controllers/audioController');

// ALTERADO: Renomeamos a importação para ser mais claro
const uploadMiddleware = require('../config/multerConfig');
const authMiddleware = require('../middleware/authMiddleware');


// Rotas de Busca (Protegidas)
router.get('/search', authMiddleware, findAudioByName);
router.get('/filter/:field', authMiddleware, findAudioByField);

// Rota de Streaming (Pública)
router.get('/:id/play', streamAudioFile);

// Rota de Upload (Protegida)
router.post('/upload', authMiddleware, uploadMiddleware, uploadAudio);


// Rotas de Like/Unlike (Protegidas)
router.post('/:id/like', authMiddleware, likeAudio);
router.delete('/:id/like', authMiddleware, unlikeAudio);


module.exports = router;