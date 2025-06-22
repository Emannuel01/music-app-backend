const express = require('express');
const router = express.Router();
const {     createMyPlaylist, 
  getMyPlaylists, 
  addAudioToMyPlaylist,
  removeAudioFromMyPlaylist,
  getMyPlaylistById,
  updateMyPlaylist,
  deleteMyPlaylist
 } = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');

// APLICANDO O MIDDLEWARE:
// Todas as rotas neste arquivo agora exigirão um token válido.
// O middleware 'authMiddleware' será executado ANTES das funções do controller.

// Rota para criar uma nova playlist para o usuário logado
router.post('/', authMiddleware, createMyPlaylist);

// Rota para buscar todas as playlists do usuário logado
router.get('/', authMiddleware, getMyPlaylists);

// Rota para adicionar uma música a uma playlist específica do usuário logado
router.post('/:playlistId/audios', authMiddleware, addAudioToMyPlaylist);

// Rota para remover uma música de uma playlist específica
// parâmetros na URL: :playlistId e :audioId
router.delete('/:playlistId/audios/:audioId', authMiddleware, removeAudioFromMyPlaylist);

// Rota para buscar uma playlist específica pelo seu ID.
// Esta rota deve vir ANTES de outras rotas GET com sub-recursos para evitar conflitos.
router.get('/:id', authMiddleware, getMyPlaylistById);

// Rota para atualizar os detalhes de uma playlist
router.patch('/:id', authMiddleware, updateMyPlaylist);

// Rota para deletar uma playlist específica do usuário logado
router.delete('/:id', authMiddleware, deleteMyPlaylist);


module.exports = router;