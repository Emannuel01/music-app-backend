const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Rota para registrar um novo usuário
router.post('/register', register);

// Rota para fazer login
router.post('/login', login);

module.exports = router;