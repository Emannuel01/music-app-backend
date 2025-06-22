const favoriteModel = require('../model/favoriteModel');

async function getMyFavorites(req, res) {
  try {
    const userId = req.user.id;
    const favoriteAudios = await favoriteModel.findFavoritesByUserId(userId);
    res.status(200).json(favoriteAudios);
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

module.exports = {
  getMyFavorites,
};