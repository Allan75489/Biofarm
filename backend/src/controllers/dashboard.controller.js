'use strict';

const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const summary = asyncHandler(async (req, res) => {
  const result = await dashboardService.getSummary();
  res.json(result);
});

const salesByMonth = asyncHandler(async (req, res) => {
  const result = await dashboardService.getSalesByMonth();
  res.json(result);
});

const byCategory = asyncHandler(async (req, res) => {
  const result = await dashboardService.getRevenueByCategory();
  res.json(result);
});

module.exports = { summary, salesByMonth, byCategory };
