'use strict';

const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await productService.list(req.query);
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  res.json(product);
});

const create = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);
  res.status(201).json(product);
});

const update = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.json(product);
});

const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
