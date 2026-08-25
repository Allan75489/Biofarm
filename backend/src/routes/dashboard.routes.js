'use strict';

const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

const router = Router();

router.use(authMiddleware, requireRole('ADMIN'));

router.get('/summary', dashboardController.summary);
router.get('/sales-by-month', dashboardController.salesByMonth);
router.get('/by-category', dashboardController.byCategory);

module.exports = router;
