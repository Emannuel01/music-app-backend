const db = require('../database/db');

async function addFavorite({ userId, audioId }) {
  const sql = `INSERT INTO favorite_audios (user_id, audio_id) VALUES ($1, $2)`;
  await db.query(sql, [userId, audioId]);
}

async function removeFavorite({ userId, audioId }) {
  const sql = `DELETE FROM favorite_audios WHERE user_id = $1 AND audio_id = $2`;
  const result = await db.query(sql, [userId, audioId]);
  return { changes: result.rowCount };
}

async function findFavoritesByUserId(userId) {
  const sql = `
    SELECT a.* FROM audios a
    JOIN favorite_audios fa ON a.id = fa.audio_id
    WHERE fa.user_id = $1
    ORDER BY fa.liked_at DESC
  `;
  const result = await db.query(sql, [userId]);
  return result.rows;
}

module.exports = {
  addFavorite,
  removeFavorite,
  findFavoritesByUserId,
};