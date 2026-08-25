'use strict';

const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string().min(2, 'Nome muito curto.').max(60),
});

module.exports = { createCategorySchema };
