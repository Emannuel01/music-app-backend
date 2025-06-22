const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// NÃO PRECISAMOS MAIS CHAMAR cloudinary.config() AQUI.
// A biblioteca irá ler a variável CLOUDINARY_URL do seu .env automaticamente.

// Configura o armazenamento para o Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Para áudios, o resource_type é 'video'. Para imagens, é 'image'.
    const isAudio = file.mimetype.startsWith('audio/');
    return {
      folder: 'music_app', // Nome da pasta no Cloudinary onde os arquivos serão salvos
      resource_type: isAudio ? 'video' : 'auto', // 'auto' detecta o tipo de recurso
    };
  },
});

const upload = multer({ storage: storage }).fields([
    { name: 'audiofile', maxCount: 1 },
    { name: 'imagefile', maxCount: 1 }
]);

module.exports = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: `Erro no upload do Cloudinary: ${err.message}` });
        }
        next();
    });
};