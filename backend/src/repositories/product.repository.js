'use strict';

const { query } = require('../config/db');

/**
 * SELECT base compartilhado: traz o produto já com o nome da categoria
 * e a quantidade em estoque (LEFT JOIN pois stock pode não existir ainda
 * logo após o cadastro, antes do trigger/insert inicial).
 */
const BASE_SELECT = `
  SELECT
    p.id, p.sku, p.name, p.price, p.image_url,
    p.category_id, c.name AS category_name,
    COALESCE(s.quantity, 0) AS stock_quantity,
    p.created_at, p.updated_at
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN stock s ON s.product_id = p.id
`;

async function findAll({ search, categoryId, page = 1, perPage = 12 }) {
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    conditions.push(`(LOWER(p.name) LIKE ? OR LOWER(p.sku) LIKE ?)`);
  }

  if (categoryId) {
    params.push(categoryId);
    conditions.push(`p.category_id = ?`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*) AS total FROM products p ${where}`;
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

async function findById(id) {
  const { rows } = await query(`${BASE_SELECT} WHERE p.id = ?`, [id]);
  return rows[0] || null;
}

async function findBySku(sku) {
  const { rows } = await query('SELECT * FROM products WHERE sku = ?', [sku]);
  return rows[0] || null;
}

async function create({ sku, name, categoryId, price, imageUrl }) {
  const { insertId } = await query(
    `INSERT INTO products (sku, name, category_id, price, image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [sku, name, categoryId || null, price, imageUrl || null]
  );
  const { rows } = await query('SELECT * FROM products WHERE id = ?', [insertId]);
  return rows[0];
}

async function update(id, { sku, name, categoryId, price, imageUrl }) {
  await query(
    `UPDATE products
        SET sku = COALESCE(?, sku),
            name = COALESCE(?, name),
            category_id = COALESCE(?, category_id),
            price = COALESCE(?, price),
            image_url = COALESCE(?, image_url),
            updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    [sku, name, categoryId, price, imageUrl, id]
  );
  const { rows } = await query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await query('DELETE FROM products WHERE id = ?', [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, findBySku, create, update, remove };
