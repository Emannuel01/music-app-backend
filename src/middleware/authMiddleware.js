const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Pega o token do cabeçalho da requisição
  const authHeader = req.headers['authorization'];
  
  // O token geralmente vem no formato "Bearer <token>"
  // Se o cabeçalho existir, pegamos apenas a parte do token
  const token = authHeader && authHeader.split(' ')[1];

  // Se não houver token, retorna erro 401 (Não Autorizado)
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    // Verifica se o token é válido usando a nossa chave secreta
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // Adiciona os dados do usuário (do payload do token) ao objeto da requisição
    // para que as próximas rotas possam usá-los
    req.user = decoded;

    // Passa para a próxima função (o controller)
    next();
  } catch (error) {
    // Se o token for inválido ou expirado, retorna erro 400
    res.status(400).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;