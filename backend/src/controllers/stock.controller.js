'use strict';

const stockService = require('../services/stock.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await stockService.list(req.query);
  res.json(result);
});

const update = asyncHandler(async (req, res) => {
  const stock = await stockService.setQuantity(req.params.productId, req.body.quantity);
  res.json(stock);
});

const summary = asyncHandler(async (req, res) => {
  const result = await stockService.summary();
  res.json(result);
});

module.exports = { list, update, summary };
