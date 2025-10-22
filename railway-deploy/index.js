const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'JD Legal Transcripts API is running!',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is healthy',
        uptime: process.uptime()
    });
});

// Contact form (basic)
app.post('/api/contact', (req, res) => {
    console.log('Contact form:', req.body);
    res.json({
        success: true,
        message: 'Contact form received'
    });
});

// Order form (basic)
app.post('/api/order', (req, res) => {
    console.log('Order received:', req.body);
    res.json({
        success: true,
        message: 'Order received',
        orderNumber: 'JD' + Date.now()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;