'use strict';

const { z } = require('zod');

const createProductSchema = z.object({
  sku: z.string().min(2).max(20),
  name: z.string().min(2).max(150),
  categoryId: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().nonnegative('O preço não pode ser negativo.'),
  imageUrl: z.string().max(255).optional(),
  // quantidade inicial de estoque, opcional no cadastro (default 0)
  initialQuantity: z.coerce.number().int().nonnegative().optional().default(0),
});

const updateProductSchema = z.object({
  sku: z.string().min(2).max(20).optional(),
  name: z.string().min(2).max(150).optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
  price: z.coerce.number().nonnegative().optional(),
  imageUrl: z.string().max(255).optional(),
});

const listProductsQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(100).optional().default(12),
});

module.exports = { createProductSchema, updateProductSchema, listProductsQuerySchema };
