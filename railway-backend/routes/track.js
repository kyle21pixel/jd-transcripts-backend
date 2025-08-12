const express = require('express');
const router = express.Router();
const Order = require('../models/order');

/**
 * @route   POST /api/orders/track
 * @desc    Track an order by ID and email
 * @access  Public
 */
router.post('/track', async (req, res) => {
    try {
        const { orderId, email } = req.body;

        if (!orderId || !email) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and email are required'
            });
        }

        // Find the order by ID and email
        const order = await Order.findOne({
            orderId: orderId,
            customerEmail: email
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found. Please check your Order ID and email.'
            });
        }

        // Calculate estimated completion date based on order date and service type
        const orderDate = new Date(order.createdAt);
        const estimatedCompletion = new Date(orderDate);
        
        // Different service types have different turnaround times
        switch (order.serviceType) {
            case 'Legal Transcription':
                estimatedCompletion.setDate(orderDate.getDate() + 3);
                break;
            case 'Medical Transcription':
                estimatedCompletion.setDate(orderDate.getDate() + 2);
                break;
            case 'Business Transcription':
                estimatedCompletion.setDate(orderDate.getDate() + 2);
                break;
            case 'Academic Transcription':
                estimatedCompletion.setDate(orderDate.getDate() + 4);
                break;
            default:
                estimatedCompletion.setDate(orderDate.getDate() + 3);
        }

        // Generate timeline based on order status
        const timeline = generateTimeline(order);

        // Format response data
        const responseData = {
            orderId: order.orderId,
            serviceType: order.serviceType,
            orderDate: order.createdAt,
            status: order.status,
            estimatedCompletion: estimatedCompletion,
            amount: order.totalAmount,
            timeline: timeline
        };

        return res.status(200).json({
            success: true,
            data: responseData
        });

    } catch (error) {
        console.error('Error tracking order:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

/**
 * Generate timeline based on order status
 * @param {Object} order - Order object
 * @returns {Array} Timeline array
 */
function generateTimeline(order) {
    const timeline = [];
    const orderDate = new Date(order.createdAt);
    
    // Order received
    timeline.push({
        date: orderDate,
        status: 'Order Received',
        description: 'Your order has been received and is being processed.',
        completed: true,
        current: order.status === 'Received'
    });
    
    // Processing started (1 day after order)
    const processingDate = new Date(orderDate);
    processingDate.setDate(orderDate.getDate() + 1);
    
    timeline.push({
        date: processingDate,
        status: 'Processing Started',
        description: 'Our transcription team has started working on your order.',
        completed: ['Processing', 'In Progress', 'Quality Check', 'Completed'].includes(order.status),
        current: order.status === 'Processing'
    });
    
    // In progress (2 days after order)
    const inProgressDate = new Date(orderDate);
    inProgressDate.setDate(orderDate.getDate() + 2);
    
    timeline.push({
        date: inProgressDate,
        status: 'In Progress',
        description: 'Your transcription is currently being processed by our specialists.',
        completed: ['In Progress', 'Quality Check', 'Completed'].includes(order.status),
        current: order.status === 'In Progress'
    });
    
    // Quality check (depends on service type)
    const qualityCheckDate = new Date(orderDate);
    switch (order.serviceType) {
        case 'Legal Transcription':
            qualityCheckDate.setDate(orderDate.getDate() + 3);
            break;
        case 'Medical Transcription':
            qualityCheckDate.setDate(orderDate.getDate() + 2);
            break;
        case 'Business Transcription':
            qualityCheckDate.setDate(orderDate.getDate() + 2);
            break;
        case 'Academic Transcription':
            qualityCheckDate.setDate(orderDate.getDate() + 4);
            break;
        default:
            qualityCheckDate.setDate(orderDate.getDate() + 3);
    }
    
    timeline.push({
        date: qualityCheckDate,
        status: 'Quality Check',
        description: 'Final review and quality assurance check.',
        completed: ['Quality Check', 'Completed'].includes(order.status),
        current: order.status === 'Quality Check'
    });
    
    // Completed (1 day after quality check)
    const completedDate = new Date(qualityCheckDate);
    completedDate.setDate(qualityCheckDate.getDate() + 1);
    
    timeline.push({
        date: completedDate,
        status: 'Completed',
        description: 'Your transcription is complete and ready for delivery.',
        completed: order.status === 'Completed',
        current: order.status === 'Completed'
    });
    
    return timeline;
}

module.exports = router;