'use strict';

const { z } = require('zod');

/** Ajuste de estoque: define a quantidade absoluta do produto. */
const updateStockSchema = z.object({
  quantity: z.coerce.number().int().nonnegative('A quantidade não pode ser negativa.'),
});

const listStockQuerySchema = z.object({
  status: z.enum(['CRITICO', 'BAIXO', 'EM_ESTOQUE']).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(100).optional().default(10),
});

module.exports = { updateStockSchema, listStockQuerySchema };
