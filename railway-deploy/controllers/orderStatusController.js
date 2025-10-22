const Order = require('../models/order');
const emailController = require('./emailController');

/**
 * Update order status and send notification email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and status are required'
            });
        }
        
        // Validate status
        const validStatuses = ['Received', 'Processing', 'In Progress', 'Quality Check', 'Completed', 'Cancelled', 'Revision Requested'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }
        
        // Find and update the order
        const order = await Order.findOneAndUpdate(
            { orderId: orderId },
            { 
                status: status,
                ...(status === 'Completed' ? { completedDate: new Date() } : {})
            },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Add to timeline
        order.timeline.push({
            action: `Status Updated to ${status}`,
            timestamp: new Date(),
            performedBy: req.user ? req.user.username : 'System',
            notes: req.body.notes || `Order status changed to ${status}`
        });
        
        await order.save();
        
        // Send email notification
        try {
            await emailController.sendOrderStatusUpdate(order);
            console.log(`Status update email sent for order ${orderId}`);
        } catch (emailError) {
            console.error('Error sending status update email:', emailError);
            // Continue even if email fails
        }
        
        return res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
        
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

/**
 * Get order status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }
        
        // Find the order
        const order = await Order.findOne({ orderId: orderId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: {
                orderId: order.orderId,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                completedDate: order.completedDate,
                timeline: order.timeline
            }
        });
        
    } catch (error) {
        console.error('Error getting order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

module.exports = exports;