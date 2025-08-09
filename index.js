const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Root endpoint - Railway health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'JD Legal Transcripts API is running!',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Simple order endpoint
app.post('/api/orders', (req, res) => {
    console.log('Order received:', req.body);
    res.json({
        success: true,
        message: 'Order received successfully',
        orderNumber: 'JD' + Date.now(),
        data: req.body
    });
});

// Simple contact endpoint
app.post('/api/email/contact', (req, res) => {
    console.log('Contact form:', req.body);
    res.json({
        success: true,
        message: 'Contact form received successfully'
    });
});

// Simple auth endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Login successful',
            token: 'mock-jwt-token'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/`);
});

module.exports = app;