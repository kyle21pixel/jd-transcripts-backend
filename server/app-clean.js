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

// Import services
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

// Database connection - CLEAN VERSION
console.log('🚀 JD Transcripts API - CLEAN BUILD 2024-12-19');
if (process.env.MONGODB_URI) {
    console.log('🔗 Attempting MongoDB connection...');
    console.log('🔗 MongoDB URI:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));
    
    // CLEAN connection without deprecated options
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log('✅ Database ready for operations');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️ API will run without database functionality');
    });
} else {
    console.log('⚠️ No MongoDB URI provided, running without database');
}

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
        message: 'JD Legal Transcripts API - CLEAN VERSION',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        version: '2.0.1-clean'
    });
});

// Basic routes
app.get('/', (req, res) => {
    res.json({
        message: 'JD Legal Transcripts API - CLEAN VERSION',
        status: 'Running',
        version: '2.0.1-clean',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints: [
            'GET /api/health - Health check',
            'POST /api/auth/login - Admin login',
            'POST /api/orders - Create order',
            'GET /api/orders - Get all orders (admin)',
            'GET /api/orders/:id - Get specific order',
            'PUT /api/orders/:id - Update order (admin)',
            'POST /api/email/contact - Contact form'
        ]
    });
});

// AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

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

        const turnaroundHours = {
            'same-day': 8,
            '24h': 24,
            '48h': 48,
            'standard': 72
        };

        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + (turnaroundHours[turnaround] || 72));

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

        // Send email notification
        try {
            await sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@jdlegaltranscripts.com',
                subject: `New Order: ${order.orderId}`,
                html: `
                    <h2>New Order Received</h2>
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Client:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Turnaround:</strong> ${turnaround}</p>
                    <p><strong>Estimated Cost:</strong> $${estimatedCost}</p>
                    <p><strong>Due Date:</strong> ${dueDate.toLocaleString()}</p>
                    <p><strong>Notes:</strong> ${notes || 'None'}</p>
                `
            });
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
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

        if (status) order.status = status;
        if (assignedTranscriberName) order.assignedTranscriberName = assignedTranscriberName;
        if (actualCost) order.actualCost = actualCost;

        order.timeline.push({
            action: `Status updated to ${status}`,
            performedBy: req.user.email,
            notes: notes || ''
        });

        if (status === 'completed') {
            order.completedDate = new Date();
        }

        await order.save();

        res.json({ success: true, message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ success: false, message: 'Failed to update order' });
    }
});

// CONTACT FORM ROUTE
app.post('/api/email/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        await sendEmail({
            to: process.env.ADMIN_EMAIL || 'admin@jdlegaltranscripts.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <h2>Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
    console.log('✅ API ready for requests');
});