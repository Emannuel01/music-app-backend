const path = require('path');

// Este é o único lugar onde o caminho para o banco de dados será definido.
// Ele calcula o caminho absoluto para o arquivo, saindo da pasta 'src/config',
// voltando duas pastas para a raiz do projeto, e então entrando em 'database'.
const dbPath = path.resolve(__dirname, '..', '..', 'database', 'database.db');

module.exports = {
  dbPath,
};