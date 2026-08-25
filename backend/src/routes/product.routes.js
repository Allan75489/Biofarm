'use strict';

const { Router } = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { idParamSchema } = require('../validators/common.validator');
const {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} = require('../validators/product.validator');

const router = Router();

router.use(authMiddleware);

router.get('/', validate(listProductsQuerySchema, 'query'), productController.list);
router.get('/:id', validate(idParamSchema, 'params'), productController.getById);
router.post('/', requireRole('ADMIN'), validate(createProductSchema), productController.create);
router.put(
  '/:id',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  validate(updateProductSchema),
  productController.update
);
router.delete(
  '/:id',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  productController.remove
);

module.exports = router;
