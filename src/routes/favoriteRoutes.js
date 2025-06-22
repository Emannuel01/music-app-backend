const express = require('express');
const router = express.Router();
const { getMyFavorites } = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para buscar todos os favoritos do usuário logado
router.get('/', authMiddleware, getMyFavorites);

module.exports = router;