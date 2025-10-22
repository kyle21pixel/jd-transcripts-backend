const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const { specs, swaggerUi } = require('./swagger');
const logger = require('./utils/logger');
const { initSentry, requestHandler, errorHandler } = require('./utils/sentry');

// Load environment variables
dotenv.config();

// Initialize Sentry
initSentry();

const app = express();

// The request handler must be the first middleware on the app
app.use(requestHandler());

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
    'https://jd-reporting-company.netlify.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
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

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// More strict rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Apply stricter rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

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
        message: 'JD Reporting Company API is running!',
        status: 'success',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /api/health - Health check',
            'POST /api/orders - Create order',
            'POST /api/orders/track - Track order',
            'PUT /api/orders/status/:orderId - Update order status',
            'GET /api/orders/status/:orderId - Get order status',
            'POST /api/email/contact - Contact form',
            'POST /api/auth/login - Admin login',
            'GET /api/careers/positions - Job positions'
        ]
    });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/orders', require('./routes/order')); // Using the simpler order.js file
    app.use('/api/orders', require('./routes/track')); // Order tracking route
    app.use('/api/orders', require('./routes/orderStatus')); // Order status updates
    app.use('/api/transcribers', require('./routes/transcribers'));
    app.use('/api/admin', require('./routes/admin'));
    app.use('/api/careers', require('./routes/careers'));
    app.use('/api/email', require('./routes/email'));
    app.use('/api/payment', require('./routes/payment')); // Payment processing routes
} catch (error) {
    console.error('Error loading routes:', error);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'JD Reporting Company API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// The Sentry error handler must be before any other error middleware
app.use(errorHandler());

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Error:', { 
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    
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
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📧 Email service configured: ${process.env.EMAIL_SERVICE || 'Gmail'}`);
    logger.info(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;