'use strict';

const { z } = require('zod');

const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive('A quantidade deve ser maior que zero.'),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'O pedido precisa de ao menos um item.'),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']),
});

const listOrdersQuerySchema = z.object({
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(100).optional().default(10),
});

module.exports = { createOrderSchema, updateOrderStatusSchema, listOrdersQuerySchema };
