const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = 'jsonwebtoken';

/**
 * Registra um novo usuário.
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se o usuário já existe
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Cria o usuário no banco
    const userId = await userModel.createUser({ name, email, passwordHash });

    res.status(201).json({ message: 'Usuário criado com sucesso!', userId });

  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

/**
 * Realiza o login de um usuário.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // Encontra o usuário
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Usuário não encontrado
    }

    // Compara a senha enviada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Senha incorreta
    }

    // Se tudo estiver correto, gera o Token JWT
    const payload = {
      id: user.id,
      name: user.name,
    };

    const token = require('jsonwebtoken').sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expira em 1 dia
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

module.exports = {
  register,
  login,
};