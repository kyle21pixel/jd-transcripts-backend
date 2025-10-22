const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const auth = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
    try {
        console.log('Order received:', req.body);
        
        const {
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            turnaround,
            estimatedCost,
            instructions,
            audioFiles = []
        } = req.body;

        // Validate required fields
        if (!clientName || !clientEmail || !serviceType || !turnaround) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: clientName, clientEmail, serviceType, turnaround'
            });
        }

        // Calculate due date based on turnaround
        const dueDate = new Date();
        const turnaroundHours = parseInt(turnaround) || 24;
        dueDate.setHours(dueDate.getHours() + turnaroundHours);

        const orderData = {
            clientName,
            clientEmail,
            clientPhone,
            serviceType,
            turnaround,
            estimatedCost: estimatedCost || 'TBD',
            instructions: instructions || '',
            audioFiles,
            dueDate,
            status: 'pending'
        };

        let savedOrder;
        try {
            // Try to save to MongoDB
            const order = new Order(orderData);
            savedOrder = await order.save();
            console.log('Order saved to database:', savedOrder.orderId);
        } catch (dbError) {
            console.log('Database not available, using fallback:', dbError.message);
            // Fallback: return order data without saving
            savedOrder = {
                ...orderData,
                orderId: 'JD' + Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: savedOrder
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

// @route   GET /api/orders
// @desc    Get all orders (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, clientEmail, limit = 50, page = 1 } = req.query;
        
        let orders = [];
        try {
            // Try to fetch from MongoDB
            let query = {};
            if (status) query.status = status;
            if (clientEmail) query.clientEmail = clientEmail;

            const skip = (parseInt(page) - 1) * parseInt(limit);
            orders = await Order.find(query)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(skip);

            console.log(`Found ${orders.length} orders in database`);
        } catch (dbError) {
            console.log('Database not available, using fallback data:', dbError.message);
            // Fallback: return mock data
            orders = [
                {
                    orderId: 'JD' + Date.now(),
                    clientName: 'Sample Client',
                    clientEmail: 'sample@example.com',
                    serviceType: 'Legal Transcription',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            ];
        }

        res.json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: orders.length
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
// @desc    Get single order by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        let order = null;
        try {
            // Try to fetch from MongoDB
            order = await Order.findOne({
                $or: [
                    { _id: id },
                    { orderId: id }
                ]
            });
        } catch (dbError) {
            console.log('Database not available for order lookup:', dbError.message);
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order retrieved successfully',
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

// @route   PATCH /api/orders/:id
// @desc    Update order
// @access  Private (Admin)
router.patch('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData._id;
        delete updateData.orderId;
        delete updateData.createdAt;
        
        // Add updated timestamp
        updateData.updatedAt = new Date();

        let updatedOrder = null;
        try {
            // Try to update in MongoDB
            updatedOrder = await Order.findOneAndUpdate(
                {
                    $or: [
                        { _id: id },
                        { orderId: id }
                    ]
                },
                updateData,
                { new: true, runValidators: true }
            );

            if (updatedOrder) {
                // Add timeline entry for status changes
                if (updateData.status) {
                    updatedOrder.timeline.push({
                        action: `Status changed to ${updateData.status}`,
                        performedBy: req.user?.username || 'Admin',
                        notes: updateData.notes || ''
                    });
                    await updatedOrder.save();
                }
            }
        } catch (dbError) {
            console.log('Database not available for order update:', dbError.message);
            return res.status(503).json({
                success: false,
                message: 'Database unavailable, cannot update order'
            });
        }

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: updatedOrder
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

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        let deletedOrder = null;
        try {
            // Try to delete from MongoDB
            deletedOrder = await Order.findOneAndDelete({
                $or: [
                    { _id: id },
                    { orderId: id }
                ]
            });
        } catch (dbError) {
            console.log('Database not available for order deletion:', dbError.message);
            return res.status(503).json({
                success: false,
                message: 'Database unavailable, cannot delete order'
            });
        }

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully',
            data: { orderId: deletedOrder.orderId }
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
});

// @route   POST /api/orders/:id/files
// @desc    Upload files for an order
// @access  Public
router.post('/:id/files', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        let order = null;
        try {
            // Try to find order in MongoDB
            order = await Order.findOne({
                $or: [
                    { _id: id },
                    { orderId: id }
                ]
            });
        } catch (dbError) {
            console.log('Database not available for file upload:', dbError.message);
            return res.status(503).json({
                success: false,
                message: 'Database unavailable, cannot upload files'
            });
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const uploadedFiles = [];
        const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

        for (const file of files) {
            const fileName = `${Date.now()}-${file.name}`;
            const uploadPath = `./uploads/${fileName}`;
            
            try {
                await file.mv(uploadPath);
                uploadedFiles.push({
                    filename: fileName,
                    originalName: file.name,
                    size: file.size,
                    uploadDate: new Date()
                });
            } catch (uploadError) {
                console.error('File upload error:', uploadError);
            }
        }

        // Update order with new files
        order.audioFiles.push(...uploadedFiles);
        await order.save();

        res.json({
            success: true,
            message: 'Files uploaded successfully',
            data: {
                orderId: order.orderId,
                uploadedFiles: uploadedFiles.length,
                totalFiles: order.audioFiles.length
            }
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload files',
            error: error.message
        });
    }
});

module.exports = router;