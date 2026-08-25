'use strict';

const { Router } = require('express');
const stockController = require('../controllers/stock.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { idParamSchema } = require('../validators/common.validator');
const { updateStockSchema, listStockQuerySchema } = require('../validators/stock.validator');
const { z } = require('zod');

const productIdParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
});

const router = Router();

router.use(authMiddleware);

router.get('/summary', stockController.summary);
router.get('/', validate(listStockQuerySchema, 'query'), stockController.list);
router.put(
  '/:productId',
  requireRole('ADMIN'),
  validate(productIdParamSchema, 'params'),
  validate(updateStockSchema),
  stockController.update
);

module.exports = router;
