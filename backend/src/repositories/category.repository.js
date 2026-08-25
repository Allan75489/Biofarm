'use strict';

const { query } = require('../config/db');

async function findAll() {
  const { rows } = await query('SELECT * FROM categories ORDER BY name ASC');
  return rows;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
}

async function findByName(name) {
  const { rows } = await query('SELECT * FROM categories WHERE name = ?', [name]);
  return rows[0] || null;
}

async function create(name) {
  const { insertId } = await query(
    'INSERT INTO categories (name) VALUES (?)',
    [name]
  );
  const { rows } = await query('SELECT * FROM categories WHERE id = ?', [insertId]);
  return rows[0];
}

module.exports = { findAll, findById, findByName, create };
