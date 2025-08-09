const express = require('express');
const router = express.Router();

// Simplified admin routes for deployment
// @route   GET /api/admin/orders
// @desc    Get all orders (simplified)
// @access  Public (for now)
router.get('/orders', async (req, res) => {
    try {
        // Mock data for now
        const orders = [
            {
                id: 1,
                orderNumber: 'JD1234567890',
                customerName: 'John Doe',
                service: 'legal',
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        ];

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// @route   PATCH /api/admin/orders/:id
// @desc    Update order status (simplified)
// @access  Public (for now)
router.patch('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        
        res.json({
            success: true,
            message: 'Order status updated',
            data: {
                id: req.params.id,
                status: status
            }
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order',
            error: error.message
        });
    }
});

module.exports = router;