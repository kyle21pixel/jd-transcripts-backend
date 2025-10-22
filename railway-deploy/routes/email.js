const express = require('express');
const router = express.Router();

// Simplified email routes for deployment
// @route   POST /api/email/contact
// @desc    Send contact form email (simplified)
// @access  Public
router.post('/contact', async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        console.log('Contact form submission:', { name, email, subject, message });

        // For now, just log and return success
        // In production, this would send actual emails
        res.json({
            success: true,
            message: 'Contact email received successfully'
        });
    } catch (error) {
        console.error('Error processing contact email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process contact email',
            error: error.message
        });
    }
});

// @route   POST /api/email/order-confirmation
// @desc    Send order confirmation email (simplified)
// @access  Public
router.post('/order-confirmation', async (req, res) => {
    try {
        const orderData = req.body;
        
        console.log('Order confirmation request:', orderData);

        res.json({
            success: true,
            message: 'Order confirmation processed successfully'
        });
    } catch (error) {
        console.error('Error processing order confirmation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process order confirmation',
            error: error.message
        });
    }
});

module.exports = router;