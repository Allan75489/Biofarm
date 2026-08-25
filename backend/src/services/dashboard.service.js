'use strict';

const dashboardRepository = require('../repositories/dashboard.repository');
const orderRepository = require('../repositories/order.repository');

async function getSummary() {
  const summary = await dashboardRepository.getSummary();
  return {
    totalProducts: summary.total_products,
    totalOrders: summary.total_orders,
    totalUsers: summary.total_users,
    revenue: Number(summary.revenue),
  };
}

/** Série usada no gráfico de barras do dashboard (dashboard.js -> renderSalesChart). */
async function getSalesByMonth(months = 12) {
  const rows = await orderRepository.sumTotalByMonth(months);
  return rows.map((r) => ({ month: r.month, total: Number(r.total) }));
}

/** Série usada no doughnut de categorias (dashboard.js -> renderCategoryChart). */
async function getRevenueByCategory() {
  const rows = await dashboardRepository.getRevenueByCategory();
  return rows.map((r) => ({ category: r.category, total: Number(r.total) }));
}

module.exports = { getSummary, getSalesByMonth, getRevenueByCategory };
