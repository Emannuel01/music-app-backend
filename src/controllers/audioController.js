// backend/src/controllers/audioController.js

const audioModel = require('../model/audioModel');
const favoriteModel = require('../model/favoriteModel');
const fs = require('fs');
const path = require('path');

async function uploadAudio(req, res) {
    try {
        // 1. Acessa os arquivos enviados pelo multer.
        // req.files é um objeto com as chaves 'audiofile' e 'imagefile'.
        const audiofile = req.files.audiofile ? req.files.audiofile[0] : null;
        const imagefile = req.files.imagefile ? req.files.imagefile[0] : null;

        if (!audiofile) {
            return res.status(400).json({ message: 'Nenhum arquivo de áudio enviado.' });
        }

        const { music_name, author, year, genre, lyrics, description, group_artists } = req.body;
        
        if (!music_name || !author) {
            // Limpa os arquivos órfãos se os dados essenciais não foram enviados
            if (audiofile) fs.unlinkSync(audiofile.path);
            if (imagefile) fs.unlinkSync(imagefile.path);
            return res.status(400).json({ message: 'Nome da música e autor são obrigatórios.' });
        }

        // 2. Monta o objeto de dados para salvar no banco.
        // A linha chave é a que verifica se 'imagefile' existe.
        const audioData = {
            filename: audiofile.filename,
            album_art_filename: imagefile ? imagefile.filename : null, // Se imagefile existir, pega seu nome; senão, salva NULL.
            music_name,
            author,
            lyrics,
            description,
            group_artists,
            year: parseInt(year) || null,
            genre,
        };

        // 3. Envia os dados completos para o model, que irá inserir no banco.
        const newAudio = await audioModel.createAudio(audioData);
        res.status(201).json({ message: 'Upload bem-sucedido!', data: { id: newAudio.id } });

    } catch (error) {
        console.error('Erro no upload do controller:', error);
        res.status(500).json({ message: 'Erro interno ao salvar os dados.' });
    }
}


async function likeAudio(req, res) {
  try {
    const { id: audioId } = req.params;
    const userId = req.user.id;

    // Agora o 'favoriteModel' está definido e pode ser usado aqui
    await favoriteModel.addFavorite({ userId, audioId });
    res.status(201).json({ message: 'Música adicionada aos favoritos.' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ message: 'Você já curtiu esta música.' });
    }
    console.error("Erro ao curtir música:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

async function unlikeAudio(req, res) {
  try {
    const { id: audioId } = req.params;
    const userId = req.user.id;

    const result = await favoriteModel.removeFavorite({ userId, audioId });

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Música não encontrada nos seus favoritos.' });
    }

    res.status(200).json({ message: 'Música removida dos favoritos.' });
  } catch (error) {
    console.error("Erro ao descurtir música:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

async function streamAudioFile(req, res) {
  try {
    const { id } = req.params;
    const audio = await audioModel.findById(id);

    if (!audio || !audio.filename) {
      return res.status(404).json({ message: 'Áudio não encontrado.' });
    }
    const filePath = path.resolve(__dirname, '../../uploads', audio.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(500).json({ message: 'Arquivo de áudio não localizado no servidor.' });
    }
    res.sendFile(filePath);
  } catch (error) {
    console.error('Erro ao fazer stream do áudio:', error);
    res.status(500).json({ message: 'Erro interno ao processar a solicitação do áudio.' });
  }
}


 async function findAudioByName(req, res) {
   try {
     const { q } = req.query;
     if (!q) {
       return res.status(400).json({ message: 'O parâmetro de busca "q" é obrigatório.' });
     }
     const results = await audioModel.searchByName(q);
     res.status(200).json(results);
   } catch (error) {
     res.status(500).json({ message: 'Erro interno ao realizar a busca.' });
   }
 }
async function findAudioByField(req, res) {
   try {
     const { field } = req.params;
     const { q } = req.query;
     if (!q) {
       return res.status(400).json({ message: 'O parâmetro de busca "q" é obrigatório.' });
     }
     const results = await audioModel.searchByField(field, q);
     res.status(200).json(results);
   } catch (error) {
     if (error.message === 'Campo de pesquisa inválido.') {
         return res.status(400).json({ message: error.message });
     }
     res.status(500).json({ message: 'Erro interno ao realizar a busca.' });
   }
  }

module.exports = {
  uploadAudio,
  likeAudio,
  unlikeAudio,
  findAudioByName,
  findAudioByField,
  streamAudioFile
}