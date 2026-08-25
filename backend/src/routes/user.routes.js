'use strict';

const { Router } = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { idParamSchema } = require('../validators/common.validator');
const {
  createUserSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/user.validator');

const router = Router();

router.use(authMiddleware);

router.get('/me', userController.me);
router.put('/me', validate(updateProfileSchema), userController.updateMe);
router.put('/me/senha', validate(changePasswordSchema), userController.changeMyPassword);

router.get('/', requireRole('ADMIN'), userController.list);
router.post('/', requireRole('ADMIN'), validate(createUserSchema), userController.create);
router.delete(
  '/:id',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  userController.remove
);

module.exports = router;
