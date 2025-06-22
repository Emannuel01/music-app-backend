const db = require('../database/db'); 

async function addPlayToHistory({ userId, audioId }) {
  const sql = `INSERT INTO play_history (user_id, audio_id) VALUES ($1, $2)`;
  return db.query(sql, [userId, audioId]);
}

async function getRecentPlaysByUserId(userId, limit = 50) {
  const sql = `
    SELECT a.* FROM audios a
    JOIN (
      SELECT audio_id, MAX(played_at) as last_played FROM play_history
      WHERE user_id = $1 GROUP BY audio_id
    ) AS recent_plays ON a.id = recent_plays.audio_id
    ORDER BY recent_plays.last_played DESC LIMIT $2
  `;
  const result = await db.query(sql, [userId, limit]);
  return result.rows;
}

module.exports = { addPlayToHistory, getRecentPlaysByUserId };