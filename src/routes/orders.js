const express = require('express');
const Order = require('../models/order');
const { authenticateToken, authorize } = require('../middleware/auth');
const emailService = require('../services/email');
const router = express.Router();

// @route   POST /api/orders
// @desc    Create order
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            service_type,
            audio_file_name,
            duration_minutes,
            urgent,
            special_instructions
        } = req.body;

        const result = await Order.create({
            customer_id: req.user.id,
            service_type,
            audio_file_name,
            duration_minutes,
            urgent,
            special_instructions
        });

        const order = await Order.getById(result.id);

        // Send confirmation email
        await emailService.sendOrderConfirmation(order, req.user.email);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        const filters = { status };

        // If user is customer, only show their orders
        if (req.user.role === 'customer') {
            filters.customer_id = req.user.id;
        }
        // If user is staff, show assigned orders
        else if (req.user.role === 'staff') {
            filters.staff_id = req.user.id;
        }

        const result = await Order.getAll({
            page,
            limit,
            filters
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user has access to this order
        if (req.user.role === 'customer' && order.customer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Staff/Admin)
router.put('/:id/status', authenticateToken, authorize('staff', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.updateStatus(req.params.id, status, req.user.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Send status update email to customer
        await emailService.sendStatusUpdate(order, order.customer_email);

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
});

// @route   PUT /api/orders/:id/assign
// @desc    Assign order to staff
// @access  Private (Admin only)
router.put('/:id/assign', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const { staff_id } = req.body;

        const order = await Order.assign(req.params.id, staff_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order or staff member not found'
            });
        }

        // Send assignment email to staff
        await emailService.sendStaffAssignment(order, order.staff_email);

        res.json({
            success: true,
            message: 'Order assigned successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to assign order',
            error: error.message
        });
    }
});

// @route   GET /api/orders/stats/dashboard
// @desc    Get order statistics
// @access  Private (Admin only)
router.get('/stats/dashboard', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const stats = await Order.getDashboardStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

module.exports = router;