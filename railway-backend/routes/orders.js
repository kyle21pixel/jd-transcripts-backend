const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Transcriber = require('../models/Transcriber');
const emailController = require('../controllers/emailController');
const auth = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            turnaround,
            estimatedCost,
            instructions
        } = req.body;

        // Calculate due date based on turnaround
        const dueDate = new Date();
        const turnaroundHours = parseInt(turnaround.match(/\d+/)[0]);
        dueDate.setHours(dueDate.getHours() + turnaroundHours);

        const order = new Order({
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            turnaround,
            estimatedCost,
            instructions,
            dueDate
        });

        await order.save();

        // Send email notification to admin
        await emailController.sendNewOrderNotification({
            orderId: order.orderId,
            clientName: order.clientName,
            clientEmail: order.clientEmail,
            clientPhone: order.clientPhone,
            serviceType: order.serviceType,
            turnaround: order.turnaround,
            estimatedCost: order.estimatedCost,
            instructions: order.instructions
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: order.orderId,
                status: order.status,
                dueDate: order.dueDate
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;
        
        let query = {};
        
        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Search functionality
        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } },
                { clientEmail: { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('assignedTo', 'name email specialization')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
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

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id })
            .populate('assignedTo', 'name email specialization hourlyRate');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// @route   PUT /api/orders/:id/assign
// @desc    Assign order to transcriber
// @access  Private
router.put('/:id/assign', auth, async (req, res) => {
    try {
        const { transcriberID, priority = 'normal', notes = '' } = req.body;

        const order = await Order.findOne({ orderId: req.params.id });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const transcriber = await Transcriber.findOne({ transcriberID });
        if (!transcriber) {
            return res.status(404).json({
                success: false,
                message: 'Transcriber not found'
            });
        }

        // Check if transcriber can take more orders
        const canTakeMore = await transcriber.canTakeMoreOrders();
        if (!canTakeMore) {
            return res.status(400).json({
                success: false,
                message: 'Transcriber is not available or has reached maximum concurrent orders'
            });
        }

        // Update order
        order.assignedTo = transcriber._id;
        order.assignedTranscriberName = transcriber.name;
        order.status = 'in-progress';
        order.priority = priority;
        
        if (notes) {
            order.instructions += `\n\nAdmin Notes: ${notes}`;
        }

        order.timeline.push({
            action: 'Order Assigned',
            performedBy: req.user.username,
            notes: `Assigned to ${transcriber.name} with ${priority} priority`
        });

        await order.save();

        // Update transcriber statistics
        transcriber.statistics.totalOrders += 1;
        await transcriber.save();

        // Send assignment notification to transcriber
        await emailController.sendAssignmentNotification({
            orderId: order.orderId,
            clientName: order.clientName,
            serviceType: order.serviceType,
            priority: order.priority,
            dueDate: order.dueDate.toLocaleDateString(),
            instructions: order.instructions,
            estimatedDuration: order.calculateEstimatedDuration() + ' hours'
        }, {
            name: transcriber.name,
            email: transcriber.email
        });

        res.json({
            success: true,
            message: 'Order assigned successfully',
            data: {
                orderId: order.orderId,
                assignedTo: transcriber.name,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Error assigning order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign order',
            error: error.message
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status, notes = '' } = req.body;

        const order = await Order.findOne({ orderId: req.params.id })
            .populate('assignedTo', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const oldStatus = order.status;
        order.status = status;

        // Set completion date if completed
        if (status === 'completed' && oldStatus !== 'completed') {
            order.completedDate = new Date();
            
            // Update transcriber statistics
            if (order.assignedTo) {
                const transcriber = await Transcriber.findById(order.assignedTo);
                if (transcriber) {
                    transcriber.statistics.completedOrders += 1;
                    await transcriber.updateStatistics();
                }
            }

            // Send completion notification to client
            await emailController.sendCompletionNotification({
                orderId: order.orderId,
                serviceType: order.serviceType,
                transcriberName: order.assignedTranscriberName || 'Our team'
            }, {
                name: order.clientName,
                email: order.clientEmail
            });
        }

        order.timeline.push({
            action: `Status Changed to ${status}`,
            performedBy: req.user.username,
            notes: notes || `Status updated from ${oldStatus} to ${status}`
        });

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                orderId: order.orderId,
                status: order.status,
                completedDate: order.completedDate
            }
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
});

// @route   GET /api/orders/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', auth, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const inProgressOrders = await Order.countDocuments({ status: 'in-progress' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const overdueOrders = await Order.countDocuments({
            status: { $in: ['pending', 'in-progress'] },
            dueDate: { $lt: new Date() }
        });

        // Revenue calculation
        const revenueResult = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$actualCost' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Recent orders
        const recentOrders = await Order.find()
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                inProgressOrders,
                completedOrders,
                overdueOrders,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

module.exports = router;