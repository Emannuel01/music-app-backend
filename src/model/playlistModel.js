const db = require('../database/db');

async function getAudiosForPlaylist(playlistId) {
  const audiosSql = `
    SELECT a.* FROM audios a
    JOIN playlist_audios pa ON a.id = pa.audio_id
    WHERE pa.playlist_id = $1 ORDER BY pa.added_at DESC`;
  const result = await db.query(audiosSql, [playlistId]);
  return result.rows;
}

async function findPlaylistsByUserId(userId) {
  const playlistsSql = `SELECT id, name, description, created_at FROM playlists WHERE user_id = $1 ORDER BY created_at DESC`;
  const playlistsResult = await db.query(playlistsSql, [userId]);
  const playlists = playlistsResult.rows;

  for (const playlist of playlists) {
    playlist.audios = await getAudiosForPlaylist(playlist.id);
  }
  return playlists;
}

async function createPlaylist({ name, description, userId }) {
  const sql = `INSERT INTO playlists (name, description, user_id) VALUES ($1, $2, $3) RETURNING id`;
  const result = await db.query(sql, [name, description, userId]);
  return result.rows[0];
}

async function findPlaylistByIdAndUser({ playlistId, userId }) {
  const sql = `SELECT * FROM playlists WHERE id = $1 AND user_id = $2`;
  const result = await db.query(sql, [playlistId, userId]);
  return result.rows[0];
}

async function findPlaylistByNameAndUser({ name, userId }) {
    const sql = `SELECT id FROM playlists WHERE name = $1 AND user_id = $2`;
    const result = await db.query(sql, [name, userId]);
    return result.rows[0];
}

async function addAudioToPlaylist({ playlistId, audioId }) {
  const sql = `INSERT INTO playlist_audios (playlist_id, audio_id) VALUES ($1, $2)`;
  await db.query(sql, [playlistId, audioId]);
}

async function removeAudioFromPlaylist({ playlistId, audioId }) {
  const sql = `DELETE FROM playlist_audios WHERE playlist_id = $1 AND audio_id = $2`;
  const result = await db.query(sql, [playlistId, audioId]);
  return { changes: result.rowCount };
}

async function updatePlaylistDetails({ playlistId, name, description }) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(name);
  }
  if (description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    values.push(description);
  }
  values.push(playlistId);

  const sql = `UPDATE playlists SET ${fields.join(', ')} WHERE id = $${paramIndex}`;
  const result = await db.query(sql, values);
  return { changes: result.rowCount };
}

async function deletePlaylist(playlistId) {
  const sql = `DELETE FROM playlists WHERE id = $1`;
  const result = await db.query(sql, [playlistId]);
  return { changes: result.rowCount };
}

module.exports = {
    createPlaylist,
    findPlaylistsByUserId,
    findPlaylistByIdAndUser,
    addAudioToPlaylist,
    removeAudioFromPlaylist,
    getAudiosForPlaylist,
    updatePlaylistDetails,
    deletePlaylist,
    findPlaylistByNameAndUser
};