// backend/src/routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const { logPlay, getRecentHistory } = require('../controllers/historyController'); // Importa a nova função
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protege todas as rotas de histórico

// Rota para registrar uma música ouvida
router.post('/', logPlay);
router.get('/recent', getRecentHistory);

module.exports = router;