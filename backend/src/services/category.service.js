'use strict';

const categoryRepository = require('../repositories/category.repository');
const AppError = require('../utils/AppError');

async function list() {
  return categoryRepository.findAll();
}

async function create(name) {
  const existing = await categoryRepository.findByName(name);
  if (existing) throw new AppError('Categoria já existe.', 409);
  return categoryRepository.create(name);
}

module.exports = { list, create };
