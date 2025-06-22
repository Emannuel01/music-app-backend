const playlistModel = require('../model/playlistModel');

async function createMyPlaylist(req, res) {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'O nome da playlist é obrigatório.' });
    }

    const existingPlaylist = await playlistModel.findPlaylistByNameAndUser({ name, userId });
    if (existingPlaylist) {
      // Retorna o status 409 Conflict se a playlist já existir
      return res.status(409).json({ message: 'Uma playlist com este nome já existe.' });
    }

    const newPlaylist = await playlistModel.createPlaylist({ name, description, userId });
    res.status(201).json({ message: 'Playlist criada com sucesso!', playlist: { id: newPlaylist.id, name, description } });
  } catch (error) {
    console.error("Erro ao criar playlist:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

async function getMyPlaylists(req, res) {
  try {
    const userId = req.user.id;
    const playlists = await playlistModel.findPlaylistsByUserId(userId);
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Erro ao buscar playlists:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
async function addAudioToMyPlaylist(req, res) {
  try {
    // Pega os IDs da URL e do corpo da requisição
    const { playlistId } = req.params;
    const { audioId } = req.body;
    const userId = req.user.id; // ID do usuário logado (do token)

    if (!audioId) {
      return res.status(400).json({ message: 'O ID do áudio (audioId) é obrigatório.' });
    }

    // 1. VERIFICAÇÃO DE SEGURANÇA: O usuário é dono da playlist?
    const playlist = await playlistModel.findPlaylistByIdAndUser({ playlistId, userId });
    if (!playlist) {
      // Usamos 404 para não informar a um atacante que a playlist existe, mas pertence a outro.
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    // 2. Se a verificação passar, adiciona a música
    await playlistModel.addAudioToPlaylist({ playlistId, audioId });

    res.status(201).json({ message: 'Música adicionada à playlist com sucesso!' });

  } catch (error) {
    // Trata erros específicos, como música duplicada ou IDs inválidos
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ message: 'Erro: Esta música já está na playlist ou o ID da música/playlist é inválido.' });
    }
    console.error("Erro ao adicionar áudio à playlist:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

async function removeAudioFromMyPlaylist(req, res) {
  try {
    // Pega os IDs da URL (parâmetros da rota)
    const { playlistId, audioId } = req.params;
    const userId = req.user.id; // ID do usuário logado

    // 1. VERIFICAÇÃO DE SEGURANÇA: O usuário é dono da playlist?
    const playlist = await playlistModel.findPlaylistByIdAndUser({ playlistId, userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    // 2. Se for o dono, tenta remover a música
    const result = await playlistModel.removeAudioFromPlaylist({ playlistId, audioId });

    // 3. Verifica se algo foi realmente deletado
    // A propriedade 'changes' nos diz se alguma linha foi afetada
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Música não encontrada nesta playlist.' });
    }

    res.status(200).json({ message: 'Música removida da playlist com sucesso.' });

  } catch (error) {
    console.error("Erro ao remover áudio da playlist:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}


async function getMyPlaylistById(req, res) {
  try {
    const { id: playlistId } = req.params; // Pega o ID da playlist da URL
    const userId = req.user.id;          // Pega o ID do usuário do token

    // 1. VERIFICAÇÃO DE SEGURANÇA: O usuário é dono da playlist?
    const playlist = await playlistModel.findPlaylistByIdAndUser({ playlistId, userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    // 2. Se for o dono, busca as músicas daquela playlist
    playlist.audios = await playlistModel.getAudiosForPlaylist(playlistId);

    // 3. Retorna a playlist completa com suas músicas
    res.status(200).json(playlist);

  } catch (error) {
    console.error("Erro ao buscar detalhes da playlist:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}


async function updateMyPlaylist(req, res) {
  try {
    const { id: playlistId } = req.params;
    const userId = req.user.id;
    const { name, description } = req.body;

    // Verifica se pelo menos um campo para atualizar foi enviado
    if (name === undefined && description === undefined) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar foi fornecido (nome ou descrição).' });
    }

    // 1. VERIFICAÇÃO DE SEGURANÇA: O usuário é dono da playlist?
    const playlist = await playlistModel.findPlaylistByIdAndUser({ playlistId, userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    // 2. Chama o model para atualizar os dados
    await playlistModel.updatePlaylistDetails({ playlistId, name, description });

    res.status(200).json({ message: 'Playlist atualizada com sucesso.' });

  } catch (error) {
    console.error("Erro ao atualizar a playlist:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}


async function deleteMyPlaylist(req, res) {
  try {
    const { id: playlistId } = req.params;
    const userId = req.user.id;

    // 1. VERIFICAÇÃO DE SEGURANÇA: O usuário é dono da playlist?
    const playlist = await playlistModel.findPlaylistByIdAndUser({ playlistId, userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist não encontrada.' });
    }

    // 2. Se for o dono, deleta a playlist
    const result = await playlistModel.deletePlaylist(playlistId);

    if (result.changes === 0) {
      // Isso não deveria acontecer se a verificação acima passou, mas é uma segurança extra
      return res.status(404).json({ message: 'Playlist não encontrada para deletar.' });
    }

    res.status(200).json({ message: 'Playlist deletada com sucesso.' });
    // Nota: Muitas APIs retornam um status 204 No Content (sem conteúdo) após um DELETE bem-sucedido.
    // Manteremos 200 com mensagem para facilitar os testes no Postman.

  } catch (error) {
    console.error("Erro ao deletar a playlist:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

module.exports = {
  createMyPlaylist,
  getMyPlaylists,
  addAudioToMyPlaylist,
  removeAudioFromMyPlaylist,
  getMyPlaylistById,
  updateMyPlaylist,
  deleteMyPlaylist
};