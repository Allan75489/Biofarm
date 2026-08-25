'use strict';

const orderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await orderService.list(req.user, req.query);
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const order = await orderService.getById(req.params.id, req.user);
  res.json(order);
});

const create = asyncHandler(async (req, res) => {
  const order = await orderService.create(req.user.id, req.body);
  res.status(201).json(order);
});

const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status);
  res.json(order);
});

module.exports = { list, getById, create, updateStatus };
