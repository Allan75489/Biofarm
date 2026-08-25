'use strict';

const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.list();
  res.json(categories);
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body.name);
  res.status(201).json(category);
});

module.exports = { list, create };
