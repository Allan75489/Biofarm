'use strict';

const { getClient } = require('../config/db');
const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const stockRepository = require('../repositories/stock.repository');
const AppError = require('../utils/AppError');

async function list({ userId, role }, query) {
  // USER só vê os próprios pedidos; ADMIN vê todos.
  const filters = { ...query };
  if (role !== 'ADMIN') filters.userId = userId;
  return orderRepository.findAll(filters);
}

async function getById(id, { userId, role }) {
  const order = await orderRepository.findById(id);
  if (!order) throw new AppError('Pedido não encontrado.', 404);

  if (role !== 'ADMIN' && order.user_id !== userId) {
    throw new AppError('Você não tem acesso a este pedido.', 403);
  }

  const items = await orderRepository.findItemsByOrderId(id);
  return { ...order, items };
}

/**
 * Cria um pedido validando estoque disponível e, dentro da mesma
 * transação, decrementa a quantidade de cada produto. Se qualquer
 * item não tiver estoque suficiente, tudo é revertido (ROLLBACK).
 */
async function create(userId, { items }) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    const resolvedItems = [];
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new AppError(`Produto ${item.productId} não encontrado.`, 404);
      }

      const updatedStock = await stockRepository.decrement(item.productId, item.quantity, client);
      if (!updatedStock) {
        throw new AppError(
          `Estoque insuficiente para "${product.name}" (disponível: ${product.stock_quantity}).`,
          409
        );
      }

      resolvedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(product.price),
      });
    }

    const order = await orderRepository.createWithItems(client, {
      userId,
      items: resolvedItems,
    });

    await client.query('COMMIT');
    return getById(order.id, { userId, role: 'ADMIN' });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateStatus(id, status) {
  const updated = await orderRepository.updateStatus(id, status);
  if (!updated) throw new AppError('Pedido não encontrado.', 404);
  return updated;
}

module.exports = { list, getById, create, updateStatus };
