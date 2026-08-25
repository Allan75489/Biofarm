'use strict';

const { Router } = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { idParamSchema } = require('../validators/common.validator');
const {
  createOrderSchema,
  updateOrderStatusSchema,
  listOrdersQuerySchema,
} = require('../validators/order.validator');

const router = Router();

router.use(authMiddleware);

router.get('/', validate(listOrdersQuerySchema, 'query'), orderController.list);
router.get('/:id', validate(idParamSchema, 'params'), orderController.getById);
router.post('/', validate(createOrderSchema), orderController.create);
router.put(
  '/:id/status',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  validate(updateOrderStatusSchema),
  orderController.updateStatus
);

module.exports = router;
