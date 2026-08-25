'use strict';

const { query } = require('../config/db');

async function findAll({ userId, status, page = 1, perPage = 10 }) {
  const conditions = [];
  const params = [];

  if (userId) {
    params.push(userId);
    conditions.push(`o.user_id = ?`);
  }

  if (status) {
    params.push(status);
    conditions.push(`o.status = ?`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*) AS total FROM orders o ${where}`;
  const { rows: countRows } = await query(countSql, params);
  const total = countRows[0].total;

  const offset = (page - 1) * perPage;
  const dataSql = `
    SELECT o.id, o.status, o.total, o.created_at, o.updated_at,
           u.id AS user_id, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ${where}
     ORDER BY o.created_at DESC
     LIMIT ? OFFSET ?
  `;
  const { rows } = await query(dataSql, [...params, perPage, offset]);

  return { data: rows, total, page, perPage };
}

async function findById(id) {
  const { rows } = await query(
    `SELECT o.id, o.status, o.total, o.created_at, o.updated_at,
            u.id AS user_id, u.name AS user_name, u.email AS user_email
       FROM orders o
       JOIN users u ON u.id = o.user_id
      WHERE o.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findItemsByOrderId(orderId) {
  const { rows } = await query(
    `SELECT oi.id, oi.quantity, oi.unit_price,
            p.id AS product_id, p.name AS product_name, p.sku, p.image_url
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC`,
    [orderId]
  );
  return rows;
}

/** Cria o pedido dentro de uma transação (client vindo de db.getClient()). */
async function createWithItems(client, { userId, items }) {
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const { insertId } = await client.query(
    `INSERT INTO orders (user_id, total) VALUES (?, ?)`,
    [userId, total]
  );

  for (const item of items) {
    await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
       VALUES (?, ?, ?, ?)`,
      [insertId, item.productId, item.quantity, item.unitPrice]
    );
  }

  const { rows } = await client.query('SELECT * FROM orders WHERE id = ?', [insertId]);
  return rows[0];
}

async function updateStatus(id, status) {
  const { rowCount } = await query(
    `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, id]
  );
  if (!rowCount) return null;
  const { rows } = await query('SELECT * FROM orders WHERE id = ?', [id]);
  return rows[0] || null;
}

async function countByStatus() {
  const { rows } = await query(`
    SELECT status, COUNT(*) AS total
      FROM orders
     GROUP BY status
  `);
  return rows;
}

async function sumTotalByMonth(months = 12) {
  const { rows } = await query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
            SUM(total) AS total
       FROM orders
      WHERE status <> 'CANCELADO'
        AND created_at >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL ? MONTH)
      GROUP BY month
      ORDER BY month ASC`,
    [months - 1]
  );
  return rows;
}

module.exports = {
  findAll,
  findById,
  findItemsByOrderId,
  createWithItems,
  updateStatus,
  countByStatus,
  sumTotalByMonth,
};
