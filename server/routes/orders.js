const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
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

        // Input validation
        if (!clientName || !clientEmail || !serviceType || !turnaround || !estimatedCost) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: clientName, clientEmail, serviceType, turnaround, estimatedCost'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Service type validation
        const validServiceTypes = ['Legal Transcription', 'Medical Transcription', 'Business Meetings', 'Academic & Research'];
        if (!validServiceTypes.includes(serviceType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service type'
            });
        }

        // Calculate due date based on turnaround
        const turnaroundMatch = turnaround.match(/\d+/);
        const turnaroundHours = turnaroundMatch ? parseInt(turnaroundMatch[0], 10) : 24;
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + turnaroundHours);

        const createdOrder = await Order.create({
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            service_type: serviceType,
            turnaround,
            estimated_cost: estimatedCost,
            special_instructions: instructions,
            deadline,
            file_name: req.files?.file?.name || null,
            file_path: req.files?.file ? `uploads/${Date.now()}_${req.files.file.name}` : null,
            file_size: req.files?.file?.size || null
        });

        if (req.files?.file) {
            await req.files.file.mv(createdOrder.file_path);
        }

        await emailController.sendNewOrderNotification({
            orderId: createdOrder.order_number,
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            turnaround,
            estimatedCost,
            instructions
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderNumber: createdOrder.order_number,
                status: createdOrder.status,
                deadline: createdOrder.deadline
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

        const filters = {};
        if (status && status !== 'all') {
            filters.status = status;
        }

        const allOrders = await Order.findAll(filters);

        let filteredOrders = allOrders;
        if (search) {
            const lowerSearch = search.toLowerCase();
            filteredOrders = allOrders.filter(order =>
                order.order_number.toLowerCase().includes(lowerSearch) ||
                (order.client_name && order.client_name.toLowerCase().includes(lowerSearch)) ||
                (order.client_email && order.client_email.toLowerCase().includes(lowerSearch))
            );
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const startIndex = (pageNum - 1) * limitNum;
        const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limitNum);

        res.json({
            success: true,
            data: paginatedOrders,
            pagination: {
                current: pageNum,
                pages: Math.ceil(filteredOrders.length / limitNum),
                total: filteredOrders.length
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

// @route   GET /api/orders/:orderNumber
// @desc    Get single order (public for tracking)
// @access  Public
router.get('/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findByOrderNumber(req.params.orderNumber);

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

// @route   PUT /api/orders/:orderNumber/assign
// @desc    Assign order to transcriber
// @access  Private
router.put('/:orderNumber/assign', auth, async (req, res) => {
    try {
        const { transcriberId, assignedBy } = req.body;

        const order = await Order.findByOrderNumber(req.params.orderNumber);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await order.assignTo(transcriberId, assignedBy || req.user.username || req.user.email);

        res.json({
            success: true,
            message: 'Order assigned successfully',
            data: {
                orderNumber: order.order_number,
                assignedTo: order.assigned_to,
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

// @route   PUT /api/orders/:orderNumber/status
// @desc    Update order status
// @access  Private
router.put('/:orderNumber/status', auth, async (req, res) => {
    try {
        const { status, notes } = req.body;

        const order = await Order.findByOrderNumber(req.params.orderNumber);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await order.updateStatus(status, req.user.username || req.user.email, notes || null);

        if (status === 'completed') {
            await emailController.sendCompletionNotification({
                orderId: order.order_number,
                serviceType: order.service_type,
                transcriberName: order.assigned_transcriber_name || 'Our team'
            }, {
                name: order.client_name,
                email: order.client_email
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                orderNumber: order.order_number,
                status: order.status
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