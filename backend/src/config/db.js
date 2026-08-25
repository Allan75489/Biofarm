'use strict';

require('dotenv').config();
const mysql = require('mysql2/promise');

/**
 * Pool de conexões com o MySQL.
 * Reutilizado por todos os repositories da aplicação.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Executa uma query usando o pool.
 * Compatibiliza a interface com o formato usado anteriormente
 * (retorna { rows, rowCount }), para minimizar mudanças nos repositories.
 * @param {string} text - comando SQL parametrizado (?, ?, ...)
 * @param {Array} params - parâmetros da query
 */
async function query(text, params) {
  const [rows] = await pool.query(text, params);
  const rowCount = Array.isArray(rows) ? rows.length : (rows.affectedRows ?? 0);
  return { rows, rowCount, ...(Array.isArray(rows) ? {} : { insertId: rows.insertId }) };
}

/**
 * Obtém uma conexão dedicada do pool, útil para transações
 * (BEGIN / COMMIT / ROLLBACK) — usado no fluxo de criação de pedidos.
 * A conexão retornada expõe .query() com a mesma interface { rows, rowCount }
 * e .release() para devolver ao pool.
 */
async function getClient() {
  const connection = await pool.getConnection();

  return {
    query: async (text, params) => {
      if (text === 'BEGIN') {
        await connection.beginTransaction();
        return { rows: [], rowCount: 0 };
      }
      if (text === 'COMMIT') {
        await connection.commit();
        return { rows: [], rowCount: 0 };
      }
      if (text === 'ROLLBACK') {
        await connection.rollback();
        return { rows: [], rowCount: 0 };
      }

      const [rows] = await connection.query(text, params);
      const rowCount = Array.isArray(rows) ? rows.length : (rows.affectedRows ?? 0);
      return { rows, rowCount, ...(Array.isArray(rows) ? {} : { insertId: rows.insertId }) };
    },
    release: () => connection.release(),
  };
}

module.exports = { pool, query, getClient };
