require('dotenv').config();
const audioModel = require('./src/model/audioModel'); // Agora ele importa a versão correta

async function runTest() {
  console.log("--- Iniciando teste de inserção no banco PostgreSQL ---");

  // Dados de teste com URLs completas, como se viessem do Cloudinary
  const testAudioData = {
    filename: 'https://example.com/audio.mp3',
    music_name: 'Música de Teste para PG',
    author: 'Tester',
    year: 2025,
    genre: 'Debug',
    lyrics: 'Testando 1, 2, 3...',
    description: 'Verificando se o model do PostgreSQL funciona.',
    group_artists: null,
    album_art_filename: 'https://example.com/cover.jpg'
  };

  console.log("Dados a serem inseridos:", testAudioData);

  try {
    const result = await audioModel.createAudio(testAudioData);
    console.log("\n✅ SUCESSO! Registro inserido com o ID:", result.id);
    console.log("Isso prova que a conexão com o banco e o audioModel estão corretos.");
  } catch (error) {
    console.error("\n❌ FALHA! Ocorreu um erro ao tentar inserir o registro:", error);
  } finally {
    console.log("\n--- Teste finalizado ---");
    // Importante: precisamos de uma forma de fechar a conexão, que o pg/pool faz automaticamente.
  }
}

runTest();