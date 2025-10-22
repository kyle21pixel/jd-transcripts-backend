const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Serve static frontend from /public (if present)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Root endpoint - health check
app.get('/api', (req, res) => {
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

// Track order endpoint
app.post('/api/orders/track', (req, res) => {
    const { orderId, email } = req.body || {};

    if (!orderId || !email) {
        return res.status(400).json({ success: false, message: 'orderId and email are required' });
    }

    // Mock deterministic response for demo - replace with DB lookup in production
    const today = new Date();
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - 3);
    const estimatedCompletion = new Date(today);
    estimatedCompletion.setDate(today.getDate() + 2);

    const data = {
        orderId,
        email,
        serviceType: 'Legal Transcription',
        orderDate: orderDate.toISOString(),
        status: 'In Progress',
        estimatedCompletion: estimatedCompletion.toISOString(),
        amount: 150.00,
        timeline: [
            { date: orderDate.toISOString(), status: 'Order Received', description: 'Order received and queued.', completed: true, current: false },
            { date: new Date(orderDate.getTime() + 24*60*60*1000).toISOString(), status: 'Processing Started', description: 'Transcription team started work.', completed: true, current: false },
            { date: new Date(orderDate.getTime() + 48*60*60*1000).toISOString(), status: 'In Progress', description: 'Currently being transcribed.', completed: false, current: true },
            { date: estimatedCompletion.toISOString(), status: 'Quality Check', description: 'Quality assurance review.', completed: false, current: false },
            { date: new Date(estimatedCompletion.getTime() + 24*60*60*1000).toISOString(), status: 'Completed', description: 'Delivered to customer.', completed: false, current: false }
        ]
    };

    return res.json({ success: true, data });
});

// Contact endpoint
app.post('/api/email/contact', (req, res) => {
    const { name, email, message } = req.body || {};
    if (!email || !message) {
        return res.status(400).json({ success: false, message: 'Email and message are required.' });
    }
    console.log('Contact form submission:', { name, email, message });
    return res.json({ success: true, message: 'Contact form received successfully' });
});

// Careers application endpoint
app.post('/api/careers/apply', (req, res) => {
    const { name, email, position, resumeText } = req.body || {};
    if (!name || !email || !position) {
        return res.status(400).json({ success: false, message: 'Name, email and position are required.' });
    }
    console.log('Job application received:', { name, email, position });
    return res.json({ success: true, message: 'Application submitted. We will be in touch.' });
});

// Simple auth endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        return res.json({ success: true, message: 'Login successful', token: 'mock-jwt-token' });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// API 404 handler
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// SPA fallback - serve index.html for non-API routes if file exists
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    const indexPath = path.join(publicDir, 'index.html');
    res.sendFile(indexPath, err => {
        if (err) res.status(404).send('Not found');
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;