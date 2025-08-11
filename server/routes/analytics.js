const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get comprehensive analytics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Basic stats
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const inProgressOrders = await Order.countDocuments({ status: 'in-progress' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

        // Revenue analytics
        const revenueData = await Order.aggregate([
            { $match: { status: 'completed', actualCost: { $gt: 0 } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$actualCost' },
                    averageOrderValue: { $avg: '$actualCost' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Service type distribution
        const serviceDistribution = await Order.aggregate([
            {
                $group: {
                    _id: '$serviceType',
                    count: { $sum: 1 },
                    revenue: { $sum: '$actualCost' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Monthly trends
        const monthlyTrends = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$actualCost' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Turnaround time analysis
        const turnaroundAnalysis = await Order.aggregate([
            {
                $match: { status: 'completed' }
            },
            {
                $group: {
                    _id: '$turnaround',
                    count: { $sum: 1 },
                    avgRevenue: { $avg: '$actualCost' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Recent activity
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('orderId clientName serviceType status createdAt actualCost');

        // Performance metrics
        const performanceMetrics = await Order.aggregate([
            {
                $match: { status: 'completed' }
            },
            {
                $project: {
                    completionTime: {
                        $divide: [
                            { $subtract: ['$completedDate', '$createdAt'] },
                            1000 * 60 * 60 // Convert to hours
                        ]
                    },
                    turnaround: 1
                }
            },
            {
                $group: {
                    _id: '$turnaround',
                    avgCompletionTime: { $avg: '$completionTime' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            analytics: {
                overview: {
                    totalOrders,
                    pendingOrders,
                    inProgressOrders,
                    completedOrders,
                    cancelledOrders,
                    completionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0
                },
                revenue: {
                    total: revenueData[0]?.totalRevenue || 0,
                    average: revenueData[0]?.averageOrderValue || 0,
                    paidOrders: revenueData[0]?.count || 0
                },
                serviceDistribution,
                monthlyTrends,
                turnaroundAnalysis,
                performanceMetrics,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
    }
});

// Get order status timeline
router.get('/order-timeline/:orderId', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .select('timeline orderId clientName status');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({
            success: true,
            timeline: order.timeline,
            orderInfo: {
                orderId: order.orderId,
                clientName: order.clientName,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Timeline error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch timeline' });
    }
});

// Export data
router.get('/export', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { format = 'json', startDate, endDate } = req.query;
        
        let filter = {};
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(filter)
            .select('-timeline -__v')
            .sort({ createdAt: -1 });

        if (format === 'csv') {
            // Convert to CSV format
            const csvHeaders = [
                'Order ID', 'Client Name', 'Client Email', 'Service Type',
                'Status', 'Turnaround', 'Estimated Cost', 'Actual Cost',
                'Created Date', 'Due Date', 'Completed Date'
            ];

            const csvRows = orders.map(order => [
                order.orderId,
                order.clientName,
                order.clientEmail,
                order.serviceType,
                order.status,
                order.turnaround,
                order.estimatedCost,
                order.actualCost || 0,
                order.createdAt.toISOString(),
                order.dueDate.toISOString(),
                order.completedDate ? order.completedDate.toISOString() : ''
            ]);

            const csvContent = [csvHeaders, ...csvRows]
                .map(row => row.map(field => `"${field}"`).join(','))
                .join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=orders-export.csv');
            res.send(csvContent);
        } else {
            res.json({
                success: true,
                data: orders,
                count: orders.length,
                exportDate: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ success: false, message: 'Failed to export data' });
    }
});

module.exports = router;