'use strict';

const { Router } = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');
const stockRoutes = require('./stock.routes');
const orderRoutes = require('./order.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/stock', stockRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
