const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = 'uploads';

// Garante que o diretório de uploads exista na estrutura do projeto
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Configuração para salvar no disco local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de arquivos (opcional, mas boa prática)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado.'), false);
  }
};

// Middleware do Multer para múltiplos campos (áudio e imagem)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 20 } // Limite de 20MB
}).fields([
  { name: 'audiofile', maxCount: 1 },
  { name: 'imagefile', maxCount: 1 }
]);

// Exportamos o middleware completo para ser usado nas rotas
module.exports = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: `Erro no upload: ${err.message}` });
    }
    next();
  });
};