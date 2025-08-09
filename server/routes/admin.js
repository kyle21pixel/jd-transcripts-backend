const express = require('express');
const { getAllOrders, updateOrderStatus } = require('../controllers/ordercontroller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/orders', auth, admin, getAllOrders);
router.patch('/orders/:id', auth, admin, updateOrderStatus);

module.exports = router;