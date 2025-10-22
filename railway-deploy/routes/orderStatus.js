const express = require('express');
const router = express.Router();
const orderStatusController = require('../controllers/orderStatusController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @route   PUT /api/orders/status/:orderId
 * @desc    Update order status and send notification
 * @access  Admin/Staff
 */
router.put('/status/:orderId', authMiddleware, adminMiddleware, orderStatusController.updateOrderStatus);

/**
 * @route   GET /api/orders/status/:orderId
 * @desc    Get order status
 * @access  Public
 */
router.get('/status/:orderId', orderStatusController.getOrderStatus);

module.exports = router;