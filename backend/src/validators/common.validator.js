'use strict';

const { z } = require('zod');

/** Valida :id numérico em params (ex: /api/products/:id). */
const idParamSchema = z.object({
  id: z.coerce.number().int().positive('Id inválido.'),
});

/** Valida query string de paginação simples (?page=&perPage=). */
const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(100).optional().default(10),
});

module.exports = { idParamSchema, paginationQuerySchema };
