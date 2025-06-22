const express = require('express');
const router = express.Router();
const { getForYou } = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// A rota /api/recommendations/for-you será protegida e precisa de login
router.get('/for-you', authMiddleware, getForYou);

module.exports = router;