const db = require('../database/db');

async function createAudio(audioData) {
  const { filename, music_name, author, genre, group_artists, year, description, lyrics, album_art_filename } = audioData;
  const sql = `
    INSERT INTO audios (filename, music_name, author, genre, group_artists, year, description, lyrics, album_art_filename)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
  const params = [filename, music_name, author, genre, group_artists, year, description, lyrics, album_art_filename];
  const result = await db.query(sql, params);
  return result.rows[0];
}
async function findById(id) {
  const sql = `SELECT * FROM audios WHERE id = $1`;
  const result = await db.query(sql, [id]);
  return result.rows[0];
}
async function searchByName(query) {
  const sql = `SELECT * FROM audios WHERE music_name ILIKE $1 OR author ILIKE $2 OR genre ILIKE $3`;
  const params = [`%${query}%`, `%${query}%`, `%${query}%`];
  const result = await db.query(sql, params);
  return result.rows;
}
async function searchByField(field, query) {
  const allowedFields = ['author', 'genre', 'group_artists', 'filename'];
  if (!allowedFields.includes(field)) { throw new Error('Campo de pesquisa inválido.'); }
  const sql = `SELECT * FROM audios WHERE ${field} ILIKE $1`;
  const result = await db.query(sql, [`%${query}%`]);
  return result.rows;
}
async function updateAudioFile(id, { filename, album_art_filename }) {
  const sql = `UPDATE audios SET filename = $1, album_art_filename = $2 WHERE id = $3`;
  const result = await db.query(sql, [filename, album_art_filename, id]);
  return result.rowCount;
}
module.exports = { createAudio, findById, searchByName, searchByField, updateAudioFile };