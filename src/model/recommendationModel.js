const db = require('../database/db');

async function getRecommendationsForUser(userId) {
  const topGenreQuery = `
    SELECT a.genre FROM play_history ph
    JOIN audios a ON ph.audio_id = a.id
    WHERE ph.user_id = $1 AND a.genre IS NOT NULL AND a.genre != ''
    GROUP BY a.genre ORDER BY COUNT(a.id) DESC LIMIT 1
  `;
  const topGenreResult = await db.query(topGenreQuery, [userId]);
  
  if (topGenreResult.rows.length === 0) return [];
  const topGenre = topGenreResult.rows[0].genre;

  const recommendationsQuery = `
    SELECT * FROM audios
    WHERE genre = $1 AND id NOT IN (
      SELECT audio_id FROM play_history WHERE user_id = $2
    )
    ORDER BY RANDOM() LIMIT 10
  `;
  const recommendationsResult = await db.query(recommendationsQuery, [topGenre, userId]);
  return recommendationsResult.rows;
}

module.exports = { getRecommendationsForUser };