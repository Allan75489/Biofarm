'use strict';

const productRepository = require('../repositories/product.repository');
const stockRepository = require('../repositories/stock.repository');
const AppError = require('../utils/AppError');

async function list(filters) {
  return productRepository.findAll(filters);
}

async function getById(id) {
  const product = await productRepository.findById(id);
  if (!product) throw new AppError('Produto não encontrado.', 404);
  return product;
}

async function create({ sku, name, categoryId, price, imageUrl, initialQuantity }) {
  const existing = await productRepository.findBySku(sku);
  if (existing) throw new AppError('Já existe um produto com este SKU.', 409);

  const product = await productRepository.create({ sku, name, categoryId, price, imageUrl });
  await stockRepository.create(product.id, initialQuantity || 0);

  return getById(product.id);
}

async function update(id, data) {
  await getById(id); // garante que existe

  if (data.sku) {
    const existing = await productRepository.findBySku(data.sku);
    if (existing && existing.id !== Number(id)) {
      throw new AppError('Já existe um produto com este SKU.', 409);
    }
  }

  await productRepository.update(id, data);
  return getById(id);
}

async function remove(id) {
  await getById(id);
  await productRepository.remove(id);
}

module.exports = { list, getById, create, update, remove };
