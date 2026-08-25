'use strict';

const { query } = require('../config/db');

const BASE_SELECT = `
  SELECT
    s.id AS stock_id, s.quantity, s.updated_at,
    p.id AS product_id, p.sku, p.name, p.price, p.image_url,
    p.category_id, c.name AS category_name
  FROM stock s
  JOIN products p ON p.id = s.product_id
  LEFT JOIN categories c ON c.id = p.category_id
`;

async function findAll({ categoryId, search, page = 1, perPage = 10 }) {
  const conditions = [];
  const params = [];

  if (categoryId) {
    params.push(categoryId);
    conditions.push(`p.category_id = ?`);
  }

  if (search) {
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    conditions.push(`(LOWER(p.name) LIKE ? OR LOWER(p.sku) LIKE ?)`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*) AS total FROM stock s JOIN products p ON p.id = s.product_id ${where}`;
  const { rows: countRows } = await query(countSql, params);
  const total = countRows[0].total;

  const offset = (page - 1) * perPage;
  const dataSql = `
    ${BASE_SELECT}
    ${where}
    ORDER BY p.name ASC
    LIMIT ? OFFSET ?
  `;
  const { rows } = await query(dataSql, [...params, perPage, offset]);

  return { data: rows, total, page, perPage };
}

async function findByProductId(productId) {
  const { rows } = await query(`${BASE_SELECT} WHERE p.id = ?`, [productId]);
  return rows[0] || null;
}

/** Cria o registro de estoque de um produto recém-cadastrado. */
async function create(productId, quantity = 0) {
  const { insertId } = await query(
    `INSERT INTO stock (product_id, quantity) VALUES (?, ?)`,
    [productId, quantity]
  );
  const { rows } = await query('SELECT * FROM stock WHERE id = ?', [insertId]);
  return rows[0];
}

/** Define a quantidade absoluta de um produto em estoque. */
async function setQuantity(productId, quantity) {
  await query(
    `UPDATE stock SET quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ?`,
    [quantity, productId]
  );
  const { rows } = await query('SELECT * FROM stock WHERE product_id = ?', [productId]);
  return rows[0] || null;
}

/**
 * Decrementa o estoque em `amount` unidades, sem permitir valor negativo.
 * Usado ao confirmar um pedido. `client` opcional permite rodar dentro
 * de uma transação (ver order.service.js).
 */
async function decrement(productId, amount, client) {
  const runner = client || { query };
  const { rowCount } = await runner.query(
    `UPDATE stock
        SET quantity = quantity - ?, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ? AND quantity >= ?`,
    [amount, productId, amount]
  );
  if (!rowCount) return null;
  const { rows } = await runner.query('SELECT * FROM stock WHERE product_id = ?', [productId]);
  return rows[0] || null;
}

async function countByStatus() {
  const { rows } = await query(`
    SELECT
      SUM(CASE WHEN quantity > 60 THEN 1 ELSE 0 END)                     AS em_estoque,
      SUM(CASE WHEN quantity <= 60 AND quantity > 10 THEN 1 ELSE 0 END)  AS baixo,
      SUM(CASE WHEN quantity <= 10 THEN 1 ELSE 0 END)                    AS critico,
      COUNT(*)                                                          AS total
    FROM stock
  `);
  return rows[0];
}

module.exports = { findAll, findByProductId, create, setQuantity, decrement, countByStatus };
