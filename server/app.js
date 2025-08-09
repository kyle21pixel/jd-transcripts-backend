const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
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

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max file size
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection (optional for basic functionality)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
    console.log('⚠️ No MongoDB URI provided, running without database');
}

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'JD Legal Transcripts API is running!',
        status: 'success',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /api/health - Health check',
            'POST /api/orders - Create order',
            'POST /api/email/contact - Contact form',
            'POST /api/auth/login - Admin login',
            'GET /api/careers/positions - Job positions'
        ]
    });
});

// Routes
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/orders', require('./routes/order')); // Using the simpler order.js file
    app.use('/api/transcribers', require('./routes/transcribers'));
    app.use('/api/admin', require('./routes/admin'));
    app.use('/api/careers', require('./routes/careers'));
    app.use('/api/email', require('./routes/email'));
} catch (error) {
    console.error('Error loading routes:', error);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'JD Legal Transcripts API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
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
    console.log(`📧 Email service configured: ${process.env.EMAIL_SERVICE || 'Gmail'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;