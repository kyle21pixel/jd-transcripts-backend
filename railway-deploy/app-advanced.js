const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();

// Import models
const Order = require('./models/order');
const User = require('./models/user');

// Import utilities
const sendEmail = require('./utils/sendEmail');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://jd-reporting-company.netlify.app',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jd-transcripts', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'JD Legal Transcripts API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        features: [
            'Database Storage',
            'Email Notifications',
            'File Upload',
            'Admin Dashboard',
            'Authentication',
            'Order Management'
        ]
    });
});

// Basic routes
app.get('/', (req, res) => {
    res.json({
        message: 'JD Legal Transcripts API - Advanced Version',
        status: 'Running',
        endpoints: [
            'GET /api/health - Health check',
            'POST /api/auth/login - Admin login',
            'POST /api/orders - Create order',
            'GET /api/orders - Get all orders (admin)',
            'GET /api/orders/:id - Get specific order',
            'PUT /api/orders/:id - Update order (admin)',
            'POST /api/email/contact - Contact form',
            'POST /api/upload - File upload'
        ]
    });
});

// AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// ORDER ROUTES
app.post('/api/orders', async (req, res) => {
    try {
        const { name, email, service, turnaround, estimatedCost, phone, notes } = req.body;

        // Calculate due date based on turnaround
        const turnaroundHours = {
            'same-day': 8,
            '24h': 24,
            '48h': 48,
            'standard': 72
        };

        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + (turnaroundHours[turnaround] || 72));

        // Create order
        const order = new Order({
            clientName: name,
            clientEmail: email,
            clientPhone: phone || '',
            serviceType: service,
            turnaround: turnaround,
            estimatedCost: estimatedCost,
            instructions: notes || '',
            dueDate: dueDate
        });

        await order.save();

        // Send confirmation email to client
        try {
            await sendEmail(
                email,
                'Order Confirmation - JD Legal Transcripts',
                `Dear ${name},

Thank you for your order! Here are the details:

Order Number: ${order.orderId}
Service: ${service}
Turnaround: ${turnaround}
Estimated Cost: ${estimatedCost}
Due Date: ${dueDate.toLocaleDateString()}

We will begin processing your order shortly and keep you updated on the progress.

Best regards,
JD Legal Transcripts Team`
            );
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        // Send notification to admin
        try {
            await sendEmail(
                process.env.ADMIN_EMAIL || 'admin@jdlegaltranscripts.com',
                'New Order Received',
                `New order received:

Order Number: ${order.orderId}
Client: ${name} (${email})
Service: ${service}
Turnaround: ${turnaround}
Estimated Cost: ${estimatedCost}

Please review and assign to a transcriber.`
            );
        } catch (emailError) {
            console.error('Admin notification failed:', emailError);
        }

        res.json({
            success: true,
            message: 'Order submitted successfully',
            orderNumber: order.orderId,
            orderId: order._id,
            dueDate: dueDate
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit order'
        });
    }
});

app.get('/api/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        const filter = status ? { status } : {};
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch order' });
    }
});

app.put('/api/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status, assignedTranscriberName, actualCost, notes } = req.body;
        
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update order
        if (status) order.status = status;
        if (assignedTranscriberName) order.assignedTranscriberName = assignedTranscriberName;
        if (actualCost) order.actualCost = actualCost;

        // Add timeline entry
        order.timeline.push({
            action: `Status updated to ${status}`,
            performedBy: req.user.email,
            notes: notes || ''
        });

        if (status === 'completed') {
            order.completedDate = new Date();
        }

        await order.save();

        // Send status update email to client
        try {
            let emailSubject = 'Order Status Update - JD Legal Transcripts';
            let emailBody = `Dear ${order.clientName},

Your order ${order.orderId} has been updated:

Status: ${status}
${assignedTranscriberName ? `Assigned to: ${assignedTranscriberName}` : ''}
${actualCost ? `Final Cost: $${actualCost}` : ''}

${status === 'completed' ? 'Your transcript is ready! Please check your email for the completed files.' : ''}

Best regards,
JD Legal Transcripts Team`;

            await sendEmail(order.clientEmail, emailSubject, emailBody);
        } catch (emailError) {
            console.error('Status update email failed:', emailError);
        }

        res.json({ success: true, message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ success: false, message: 'Failed to update order' });
    }
});

// FILE UPLOAD ROUTE
app.post('/api/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const file = req.files.file;
        const orderId = req.body.orderId;

        // Validate file type
        const allowedTypes = ['audio/', 'video/'];
        const isValidType = allowedTypes.some(type => file.mimetype.startsWith(type));
        
        if (!isValidType) {
            return res.status(400).json({ 
                success: false, 
                message: 'Only audio and video files are allowed' 
            });
        }

        // For now, we'll just acknowledge the upload
        // In production, you'd save to cloud storage (AWS S3, Google Cloud, etc.)
        
        if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
                order.audioFiles.push({
                    filename: file.name,
                    originalName: file.name,
                    size: file.size
                });
                await order.save();
            }
        }

        res.json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                name: file.name,
                size: file.size,
                type: file.mimetype
            }
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ success: false, message: 'File upload failed' });
    }
});

// CONTACT FORM ROUTE
app.post('/api/email/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Send email to admin
        await sendEmail(
            process.env.ADMIN_EMAIL || 'admin@jdlegaltranscripts.com',
            'New Contact Form Submission',
            `New contact form submission:

Name: ${name}
Email: ${email}
Message: ${message}

Please respond to this inquiry.`
        );

        // Send confirmation to user
        await sendEmail(
            email,
            'Thank you for contacting JD Legal Transcripts',
            `Dear ${name},

Thank you for contacting us. We have received your message and will get back to you within 24 hours.

Your message:
${message}

Best regards,
JD Legal Transcripts Team`
        );

        res.json({
            success: true,
            message: 'Contact form submitted successfully'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit contact form'
        });
    }
});

// DASHBOARD STATS (Admin)
app.get('/api/dashboard/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const inProgressOrders = await Order.countDocuments({ status: 'in-progress' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });
        
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderId clientName serviceType status createdAt');

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                inProgressOrders,
                completedOrders,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Advanced JD Transcripts Server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✨ Features: Database, Email, File Upload, Admin Dashboard, Authentication`);
});

module.exports = app;