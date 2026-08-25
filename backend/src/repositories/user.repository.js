'use strict';

const { query } = require('../config/db');

const PUBLIC_FIELDS = 'id, name, email, role, created_at, updated_at';

async function findAll() {
  const { rows } = await query(`SELECT ${PUBLIC_FIELDS} FROM users ORDER BY name ASC`);
  return rows;
}

async function findById(id) {
  const { rows } = await query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

/** Retorna o usuário completo (com password_hash) — uso interno do AuthService. */
async function findByEmailWithPassword(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE email = ?`, [email]);
  return rows[0] || null;
}

async function create({ name, email, passwordHash, role }) {
  const { insertId } = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role || 'USER']
  );
  const { rows } = await query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [insertId]);
  return rows[0];
}

async function updateProfile(id, { name, email }) {
  await query(
    `UPDATE users
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    [name, email, id]
  );
  const { rows } = await query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function updatePassword(id, passwordHash) {
  await query(
    `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [passwordHash, id]
  );
}

async function remove(id) {
  const { rowCount } = await query('DELETE FROM users WHERE id = ?', [id]);
  return rowCount > 0;
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  findByEmailWithPassword,
  create,
  updateProfile,
  updatePassword,
  remove,
};
