const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas aqui são protegidas
router.use(authMiddleware);

// Rota para buscar os dados do próprio usuário
router.get('/me', getMyProfile);
// Rota para atualizar os dados do próprio usuário
router.patch('/me', updateMyProfile);

module.exports = router;