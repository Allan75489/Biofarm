'use strict';

const { query } = require('../config/db');

async function getSummary() {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*) FROM products)                                    AS total_products,
      (SELECT COUNT(*) FROM orders)                                      AS total_orders,
      (SELECT COUNT(*) FROM users)                                       AS total_users,
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'CANCELADO') AS revenue
  `);
  return rows[0];
}

/** Faturamento (soma de order_items) agrupado por categoria de produto. */
async function getRevenueByCategory() {
  const { rows } = await query(`
    SELECT COALESCE(c.name, 'Sem categoria') AS category,
           SUM(oi.quantity * oi.unit_price) AS total
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      LEFT JOIN categories c ON c.id = p.category_id
     WHERE o.status <> 'CANCELADO'
     GROUP BY c.name
     ORDER BY total DESC
  `);
  return rows;
}

module.exports = { getSummary, getRevenueByCategory };
