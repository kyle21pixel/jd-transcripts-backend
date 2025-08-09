const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://sensational-tartufo-6888eb.netlify.app',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jd-transcripts', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'JD Legal Transcripts API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Basic routes (Railway-compatible)
app.get('/', (req, res) => {
    res.json({
        message: 'JD Legal Transcripts API',
        status: 'Running',
        endpoints: [
            'GET /api/health - Health check',
            'POST /api/contact - Contact form',
            'POST /api/order - Create order'
        ]
    });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Log the contact form submission
        console.log('Contact form submission:', { name, email, message });
        
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

// Order creation endpoint
app.post('/api/order', async (req, res) => {
    try {
        const orderData = req.body;
        
        // Log the order submission
        console.log('Order submission:', orderData);
        
        // Generate order number
        const orderNumber = 'JD' + Date.now();
        
        res.json({
            success: true,
            message: 'Order submitted successfully',
            orderNumber: orderNumber,
            data: orderData
        });
    } catch (error) {
        console.error('Order submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit order'
        });
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
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;