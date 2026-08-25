'use strict';

const { Router } = require('express');
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createCategorySchema } = require('../validators/category.validator');

const router = Router();

router.use(authMiddleware);

router.get('/', categoryController.list);
router.post('/', requireRole('ADMIN'), validate(createCategorySchema), categoryController.create);

module.exports = router;
