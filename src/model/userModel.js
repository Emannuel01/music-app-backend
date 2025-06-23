const db = require('../database/db');

async function createUser({ name, email, passwordHash }) {
  const sql = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`;
  const result = await db.query(sql, [name, email, passwordHash]);
  return result.rows[0];
}
async function findUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE email = $1`;
  const result = await db.query(sql, [email]);
  return result.rows[0];
}
async function updateUser({ userId, name }) {
  const sql = `UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email`;
  const result = await db.query(sql, [name, userId]);
  return result.rows[0];
}
module.exports = { createUser, findUserByEmail, updateUser };