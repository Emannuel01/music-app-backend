const userModel = require('../model/userModel');

// Retorna os dados do usuário logado
async function getMyProfile(req, res) {
  // A função findUserByEmail funciona aqui, pois o email está no objeto 'user' do token,
  // mas o ideal seria ter uma findById. Por enquanto, isso funciona.
  const user = await userModel.findUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  // Remove a senha antes de enviar os dados
  delete user.password;
  res.json(user);
}

// Atualiza os dados do usuário logado
async function updateMyProfile(req, res) {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "O nome é obrigatório." });
    }

    await userModel.updateUser({ userId, name });
    // Retorna o novo objeto do usuário para o front-end
    const updatedUser = { id: userId, name, email: req.user.email };
    res.status(200).json({ message: "Perfil atualizado com sucesso!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o perfil." });
  }
}

module.exports = { getMyProfile, updateMyProfile };