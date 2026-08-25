'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', 'backend', '.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const DEFAULT_CATEGORIES = ['Analgesicos', 'Higiene', 'Pomadas', 'Vitaminas', 'Perfumaria'];

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'alangustavodasilvacarvalho@gmail.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Alan1712';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Administrador';

async function seedCategories(connection) {
  for (const name of DEFAULT_CATEGORIES) {
    await connection.query(
      `INSERT INTO categories (name) VALUES (?)
       ON DUPLICATE KEY UPDATE name = name`,
      [name]
    );
  }
  console.log(`✔ categorias garantidas: ${DEFAULT_CATEGORIES.join(', ')}`);
}

async function seedAdmin(connection) {
  const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
  if (rows.length > 0) {
    console.log(`↷ usuário admin já existe: ${ADMIN_EMAIL}`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await connection.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, 'ADMIN')`,
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash]
  );
  console.log(`✔ usuário admin criado: ${ADMIN_EMAIL} / senha: ${ADMIN_PASSWORD}`);
  console.log('  ⚠ troque essa senha assim que possível.');
}

async function run() {
  const connection = await pool.getConnection();
  try {
    await seedCategories(connection);
    await seedAdmin(connection);
    console.log('Seed finalizado com sucesso.');
  } finally {
    connection.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('Erro ao rodar seed:', err);
  process.exit(1);
});
