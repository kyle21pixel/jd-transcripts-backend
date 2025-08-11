const express = require('express');
const router = express.Router();

// Simple order creation without authentication for now
router.post('/', async (req, res) => {
    try {
        console.log('Order received:', req.body);
        
        const orderData = {
            orderNumber: 'JD' + Date.now(),
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // In production, this would save to database
        // For now, just return success response
        res.json({
            success: true,
            message: 'Order received successfully',
            data: orderData
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Get orders (simplified)
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Orders endpoint working',
        data: []
    });
});

module.exports = router;