'use strict';

const stockRepository = require('../repositories/stock.repository');
const productRepository = require('../repositories/product.repository');
const AppError = require('../utils/AppError');
const { getStockStatus } = require('../utils/stockStatus');

function withStatus(row) {
  return { ...row, status: getStockStatus(row.quantity) };
}

async function list(filters) {
  const { data, total, page, perPage } = await stockRepository.findAll(filters);

  // O filtro por status (crítico/baixo/em estoque) depende da regra de
  // negócio (utils/stockStatus.js), então é aplicado aqui, depois da
  // busca/categoria já filtradas no banco.
  const withStatusData = data.map(withStatus);
  const filteredByStatus = filters.status
    ? withStatusData.filter((row) => row.status === filters.status)
    : withStatusData;

  return { data: filteredByStatus, total, page, perPage };
}

async function getByProductId(productId) {
  const stock = await stockRepository.findByProductId(productId);
  if (!stock) throw new AppError('Produto não encontrado no estoque.', 404);
  return withStatus(stock);
}

async function setQuantity(productId, quantity) {
  const product = await productRepository.findById(productId);
  if (!product) throw new AppError('Produto não encontrado.', 404);

  const updated = await stockRepository.setQuantity(productId, quantity);
  if (!updated) throw new AppError('Produto não possui registro de estoque.', 404);

  return getByProductId(productId);
}

async function summary() {
  return stockRepository.countByStatus();
}

module.exports = { list, getByProductId, setQuantity, summary };
