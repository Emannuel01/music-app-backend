const historyModel = require('../model/historyModel');

async function logPlay(req, res) {
  try {
    const userId = req.user.id; // Do token de autenticação
    const { audioId } = req.body; // Do corpo da requisição

    if (!audioId) {
      return res.status(400).json({ message: 'audioId é obrigatório.' });
    }
    await historyModel.addPlayToHistory({ userId, audioId });
    res.status(201).json({ message: 'Histórico registrado com sucesso.' });
  } catch (error) {
    // Não enviamos um erro de volta para o front-end, pois essa é uma ação "de fundo"
    // Apenas registramos o erro no console do servidor.
    console.error("Erro ao registrar histórico:", error);
    res.status(200).json({ message: 'Ação recebida.' }); // Responde com sucesso mesmo se falhar
  }
}

async function getRecentHistory(req, res) {
  try {
    const userId = req.user.id;
    const recentPlays = await historyModel.getRecentPlaysByUserId(userId);
    res.status(200).json(recentPlays);
  } catch (error) {
    console.error("Erro ao buscar histórico recente:", error);
    res.status(500).json({ message: "Erro ao buscar histórico." });
  }
}

module.exports = {
  logPlay,
  getRecentHistory
 };