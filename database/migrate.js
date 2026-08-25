'use strict';

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const mysql = require('mysql2/promise');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

async function ensureMigrationsTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function getAppliedMigrations(connection) {
  const [rows] = await connection.query('SELECT name FROM schema_migrations');
  return new Set(rows.map((r) => r.name));
}

async function run() {
  const connection = await pool.getConnection();

  try {
    await ensureMigrationsTable(connection);
    const applied = await getAppliedMigrations(connection);

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`↷ já aplicada: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      console.log(`▶ aplicando: ${file}`);
      await connection.beginTransaction();
      try {
        await connection.query(sql);
        await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
        await connection.commit();
        console.log(`✔ concluída: ${file}`);
      } catch (err) {
        await connection.rollback();
        throw err;
      }
    }

    console.log('Migrations finalizadas com sucesso.');
  } finally {
    connection.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('Erro ao rodar migrations:', err);
  process.exit(1);
});
