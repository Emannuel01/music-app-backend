const recommendationModel = require('../model/recommendationModel');

async function getForYou(req, res) {
  try {
    const userId = req.user.id; // Vem do token
    const recommendations = await recommendationModel.getRecommendationsForUser(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    res.status(500).json({ message: 'Erro ao buscar recomendações.' });
  }
}
module.exports = { getForYou };