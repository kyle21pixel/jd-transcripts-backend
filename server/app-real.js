const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup for real-time features
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "https://jd-reporting-company.netlify.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Global database connection
let db;

// Database setup and connection
function initializeDatabaseConnection() {
    // First connect without database to create it if needed
    const tempDb = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        port: process.env.DB_PORT || 3306
    });

    tempDb.query(`CREATE DATABASE IF NOT EXISTS jd_reporting`, (err) => {
        tempDb.end();
        if (err) {
            console.error('Error creating database:', err.message);
            return;
        }

        // Now connect to the database
        db = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: 'jd_reporting',
            port: process.env.DB_PORT || 3306
        });

        db.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL database:', err.message);
            } else {
                console.log('Connected to MySQL database');
                global.db = db; // Make db accessible globally
                initializeDatabase();
            }
        });
    });
}

// Initialize database connection
initializeDatabaseConnection();

// Initialize database tables
function initializeDatabase() {
    console.log('Initializing database tables...');

    // Drop tables in reverse order due to foreign keys
    const dropQueries = [
        'DROP TABLE IF EXISTS password_resets',
        'DROP TABLE IF EXISTS notifications',
        'DROP TABLE IF EXISTS payments',
        'DROP TABLE IF EXISTS order_timeline',
        'DROP TABLE IF EXISTS orders',
        'DROP TABLE IF EXISTS users'
    ];

    let dropIndex = 0;
    function dropNext() {
        if (dropIndex >= dropQueries.length) {
            createTables();
            return;
        }
        db.query(dropQueries[dropIndex], (err) => {
            if (err) console.error('Error dropping table:', err);
            dropIndex++;
            dropNext();
        });
    }
    dropNext();

    function createTables() {
        // Users table
        db.query(`CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role ENUM('admin', 'manager', 'transcriber', 'client') DEFAULT 'client',
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table ready');
            // Create default admin user after table is created
            setTimeout(createDefaultAdmin, 100);
            setTimeout(createDefaultTranscriber, 200);
        }
    });

    // Orders table
    db.query(`CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(20),
        service_type VARCHAR(100) NOT NULL,
        turnaround VARCHAR(50) NOT NULL,
        estimated_cost DECIMAL(10,2) NOT NULL,
        actual_cost DECIMAL(10,2),
        instructions TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'normal',
        assigned_transcriber_id VARCHAR(36),
        assigned_transcriber_name VARCHAR(255),
        audio_file_path VARCHAR(500),
        transcript_file_path VARCHAR(500),
        due_date TIMESTAMP NOT NULL,
        completed_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_transcriber_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating orders table:', err);
        } else {
            console.log('Orders table ready');
        }
    });

    // Order timeline table
    db.query(`CREATE TABLE IF NOT EXISTS order_timeline (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        action VARCHAR(255) NOT NULL,
        performed_by VARCHAR(255) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating order_timeline table:', err);
        } else {
            console.log('Order timeline table ready');
        }
    });

    // Payments table
    db.query(`CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        transcriber_id VARCHAR(36) NOT NULL,
        order_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        hours_worked DECIMAL(5,2) NOT NULL,
        hourly_rate DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(100) DEFAULT 'direct_deposit',
        payment_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (transcriber_id) REFERENCES users (id),
        FOREIGN KEY (order_id) REFERENCES orders (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating payments table:', err);
        } else {
            console.log('Payments table ready');
        }
    });

    // Notifications table
    db.query(`CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating notifications table:', err);
        } else {
            console.log('Notifications table ready');
        }
    });

    // Password reset tokens table
    db.query(`CREATE TABLE IF NOT EXISTS password_resets (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error creating password_resets table:', err);
        } else {
            console.log('Password reset table ready');
        }
    });
    
    console.log('Database tables initialized');
}

// Create default admin user
function createDefaultAdmin() {
    const adminEmail = 'admin@jdreporting.com';
    const adminPassword = 'admin@new';

    db.query('SELECT id FROM users WHERE email = ?', [adminEmail], async (err, results) => {
        if (err) {
            console.error('Error checking admin user:', err);
            return;
        }

        if (!results || results.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            db.query(`INSERT INTO users (username, email, password, first_name, last_name, role, phone)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['jd.admin', adminEmail, hashedPassword, 'System', 'Administrator', 'admin', '+1234567890'],
                (err) => {
                    if (err) {
                        console.error('Error creating admin user:', err);
                    } else {
                        console.log('Default admin user created');
                        console.log('Admin Email:', adminEmail);
                        console.log('Admin Password:', adminPassword);
                    }
                }
            );
        }
    });
}

// Create default transcriber user
function createDefaultTranscriber() {
    const transcriberEmail = 'transcriber@jdreporting.com';
    const transcriberPassword = 'transcriber@new';

    db.query('SELECT id FROM users WHERE email = ?', [transcriberEmail], async (err, results) => {
        if (err) {
            console.error('Error checking transcriber user:', err);
            return;
        }

        if (!results || results.length === 0) {
            const hashedPassword = await bcrypt.hash(transcriberPassword, 10);

            db.query(`INSERT INTO users (username, email, password, first_name, last_name, role, phone)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['jd.transcriber', transcriberEmail, hashedPassword, 'Sample', 'Transcriber', 'transcriber', '+1234567890'],
                (err) => {
                    if (err) {
                        console.error('Error creating transcriber user:', err);
                    } else {
                        console.log('Default transcriber user created');
                        console.log('Transcriber Email:', transcriberEmail);
                        console.log('Transcriber Password:', transcriberPassword);
                    }
                }
            );
        }
    });
}

// Initialize database
createTables();
createDefaultAdmin();
createDefaultTranscriber();

// Middleware
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (reduced for security)
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp'),
    createParentPath: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
const adminRouter = require('./routes/admin-real');
app.use('/api/admin', adminRouter);

const transcriberRouter = require('./routes/transcriber');
app.use('/api/transcriber', transcriberRouter);

// Order routes are handled inline in this file (SQLite implementation)

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const emailRouter = require('./routes/email');
app.use('/api/email', emailRouter);

const careersRouter = require('./routes/careers');
app.use('/api/careers', careersRouter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'jd-reporting-secret-key', (err, user) => {
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

// Utility functions
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${random}`;
}

function createNotification(userId, title, message, type = 'info') {
    const notificationId = uuidv4();
    db.run(`INSERT INTO notifications (id, user_id, title, message, type) 
            VALUES (?, ?, ?, ?, ?)`, 
        [notificationId, userId, title, message, type], 
        (err) => {
            if (err) {
                console.error('Error creating notification:', err);
            } else {
                // Emit real-time notification
                io.to(userId).emit('notification', {
                    id: notificationId,
                    title,
                    message,
                    type,
                    created_at: new Date().toISOString()
                });
            }
        }
    );
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'JD Reporting Company API - Real Database Version',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'SQLite Connected',
        version: '3.0.0-real'
    });
});

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'JD Reporting Company API - Real Database Version',
        status: 'Running',
        version: '3.0.0-real',
        database: 'SQLite Connected',
        endpoints: [
            'GET /api/health - Health check',
            'POST /api/auth/register - Register new user',
            'POST /api/auth/login - User login',
            'GET /api/users - Get all users (admin)',
            'POST /api/orders - Create order',
            'GET /api/orders - Get orders',
            'PUT /api/orders/:id/assign - Assign order to transcriber',
            'GET /api/dashboard/stats - Get dashboard statistics',
            'GET /api/notifications - Get user notifications'
        ]
    });
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role = 'transcriber', phone, specializations } = req.body;

        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = uuidv4();

            // Insert new user
            db.run(`INSERT INTO users (id, email, password, name, role, phone, specializations) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [userId, email, hashedPassword, name, role, phone || '', JSON.stringify(specializations || [])], 
                function(err) {
                    if (err) {
                        console.error('Error creating user:', err);
                        return res.status(500).json({ success: false, message: 'Failed to create user' });
                    }

                    // Create welcome notification
                    createNotification(userId, 'Welcome!', `Welcome to JD Reporting Company, ${name}!`, 'success');

                    res.json({
                        success: true,
                        message: 'User registered successfully',
                        userId: userId
                    });
                }
            );
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        db.get('SELECT * FROM users WHERE email = ? AND status = "active"', [email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Update last login
            db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'jd-reporting-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    specializations: JSON.parse(user.specializations || '[]'),
                    availability_status: user.availability_status
                }
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Password reset: request token
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    db.get('SELECT id, email, name FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            console.error('Error finding user for reset:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        // Always respond success to prevent user enumeration
        if (!user) {
            return res.json({ success: true, message: 'If the account exists, a reset link will be sent.' });
        }

        const token = uuidv4();
        const resetId = uuidv4();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes

        db.run(`INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
            [resetId, user.id, token, expiresAt], (insertErr) => {
                if (insertErr) {
                    console.error('Error creating reset token:', insertErr);
                    return res.status(500).json({ success: false, message: 'Failed to create reset token' });
                }

                // In production, send email with link. For dev, return token.
                const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
                createNotification(user.id, 'Password Reset Requested', 'A password reset was requested for your account.', 'info');
                return res.json({ success: true, message: 'Reset link generated', token, resetLink });
            }
        );
    });
});

// Password reset: apply new password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ success: false, message: 'Token and password are required' });

        db.get('SELECT * FROM password_resets WHERE token = ? AND used = 0', [token], async (err, reset) => {
            if (err) {
                console.error('Error looking up reset token:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            if (!reset) return res.status(400).json({ success: false, message: 'Invalid or used token' });
            if (new Date(reset.expires_at) < new Date()) return res.status(400).json({ success: false, message: 'Token expired' });

            const hashed = await bcrypt.hash(password, 10);
            db.run('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hashed, reset.user_id], (uErr) => {
                if (uErr) {
                    console.error('Error updating password:', uErr);
                    return res.status(500).json({ success: false, message: 'Failed to update password' });
                }

                db.run('UPDATE password_resets SET used = 1 WHERE id = ?', [reset.id]);
                createNotification(reset.user_id, 'Password Changed', 'Your password has been updated successfully.', 'success');
                return res.json({ success: true, message: 'Password updated successfully' });
            });
        });
    } catch (e) {
        console.error('Reset password error:', e);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// USER ROUTES
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    const { role, status } = req.query;
    let query = 'SELECT id, email, name, role, phone, specializations, availability_status, total_earnings, completed_orders, average_rating, created_at, last_login FROM users WHERE status = "active"';
    const params = [];

    if (role) {
        query += ' AND role = ?';
        params.push(role);
    }

    if (status) {
        query += ' AND availability_status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch users' });
        }

        // Parse specializations JSON
        const formattedUsers = users.map(user => ({
            ...user,
            specializations: JSON.parse(user.specializations || '[]')
        }));

        res.json({ success: true, users: formattedUsers });
    });
});

app.get('/api/users/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;
    
    // Users can view their own profile, admins can view any profile
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    db.get('SELECT * FROM users WHERE id = ? AND status = "active"', [userId], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch user' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Remove password from response
        delete user.password;
        user.specializations = JSON.parse(user.specializations || '[]');

        res.json({ success: true, user });
    });
});

// ORDER ROUTES
app.post('/api/orders', async (req, res) => {
    try {
        const { clientName, clientEmail, serviceType, turnaround, estimatedCost, clientPhone, instructions, company, projectName } = req.body;

        // Calculate turnaround hours - handle both numeric strings and named values
        let turnaroundHours;
        if (typeof turnaround === 'string' && !isNaN(turnaround)) {
            // Numeric string like "24", "48"
            turnaroundHours = parseInt(turnaround);
        } else {
            // Named values
            const namedTurnaroundHours = {
                'same-day': 8,
                '24h': 24,
                '48h': 48,
                'standard': 72
            };
            turnaroundHours = namedTurnaroundHours[turnaround] || 72;
        }

        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + turnaroundHours);

        const orderId = uuidv4();
        const orderNumber = generateOrderNumber();

        db.run(`INSERT INTO orders (id, order_number, client_name, client_email, client_phone, 
                service_type, turnaround, estimated_cost, instructions, due_date) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [orderId, orderNumber, clientName, clientEmail, clientPhone || '', serviceType, turnaround, estimatedCost, instructions || '', dueDate.toISOString()],
            function(err) {
                if (err) {
                    console.error('Error creating order:', err);
                    return res.status(500).json({ success: false, message: 'Failed to create order' });
                }

                // Add to timeline
                const timelineId = uuidv4();
                db.run(`INSERT INTO order_timeline (id, order_id, action, performed_by, notes) 
                        VALUES (?, ?, ?, ?, ?)`, 
                    [timelineId, orderId, 'Order created', 'System', `Order submitted by ${clientName}`]
                );

                // Notify all admins about new order
                db.all('SELECT id FROM users WHERE role = "admin" AND status = "active"', [], (err, admins) => {
                    if (!err && admins) {
                        admins.forEach(admin => {
                            createNotification(admin.id, 'New Order', `New order ${orderNumber} received from ${clientName}`, 'info');
                        });
                    }
                });

                // Emit real-time update to all connected admins
                io.emit('new_order', {
                    id: orderId,
                    order_number: orderNumber,
                    client_name: clientName,
                    service_type: serviceType,
                    status: 'pending',
                    created_at: new Date().toISOString()
                });

                res.json({
                    success: true,
                    message: 'Order submitted successfully',
                    orderNumber: orderNumber,
                    orderId: orderId,
                    dueDate: dueDate
                });
            }
        );
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit order' });
    }
});

app.get('/api/orders', authenticateToken, (req, res) => {
    const { status, page = 1, limit = 10, transcriber_id } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];
    const conditions = [];

    // If user is transcriber, only show their assigned orders
    if (req.user.role === 'transcriber') {
        conditions.push('assigned_transcriber_id = ?');
        params.push(req.user.userId);
    }

    if (status) {
        conditions.push('status = ?');
        params.push(status);
    }

    if (transcriber_id && req.user.role === 'admin') {
        conditions.push('assigned_transcriber_id = ?');
        params.push(transcriber_id);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    db.all(query, params, (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
        }

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM orders';
        const countParams = [];
        
        if (req.user.role === 'transcriber') {
            countQuery += ' WHERE assigned_transcriber_id = ?';
            countParams.push(req.user.userId);
        }

        db.get(countQuery, countParams, (err, countResult) => {
            if (err) {
                console.error('Error counting orders:', err);
                return res.status(500).json({ success: false, message: 'Failed to count orders' });
            }

            res.json({
                success: true,
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult.total,
                    pages: Math.ceil(countResult.total / parseInt(limit))
                }
            });
        });
    });
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
    const orderId = req.params.id;
    
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
        if (err) {
            console.error('Error fetching order:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch order' });
        }

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check permissions
        if (req.user.role === 'transcriber' && order.assigned_transcriber_id !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Get order timeline
        db.all('SELECT * FROM order_timeline WHERE order_id = ? ORDER BY created_at ASC', [orderId], (err, timeline) => {
            if (err) {
                console.error('Error fetching timeline:', err);
                timeline = [];
            }

            res.json({ success: true, order: { ...order, timeline } });
        });
    });
});

app.put('/api/orders/:id/assign', authenticateToken, requireAdmin, (req, res) => {
    const orderId = req.params.id;
    const { transcriber_id, notes } = req.body;

    // Get transcriber info
    db.get('SELECT name FROM users WHERE id = ? AND role = "transcriber"', [transcriber_id], (err, transcriber) => {
        if (err || !transcriber) {
            return res.status(400).json({ success: false, message: 'Invalid transcriber' });
        }

        // Update order
        db.run(`UPDATE orders SET assigned_transcriber_id = ?, assigned_transcriber_name = ?, 
                status = 'assigned', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
            [transcriber_id, transcriber.name, orderId], 
            function(err) {
                if (err) {
                    console.error('Error assigning order:', err);
                    return res.status(500).json({ success: false, message: 'Failed to assign order' });
                }

                // Add to timeline
                const timelineId = uuidv4();
                db.run(`INSERT INTO order_timeline (id, order_id, action, performed_by, notes) 
                        VALUES (?, ?, ?, ?, ?)`, 
                    [timelineId, orderId, 'Order assigned', req.user.email, `Assigned to ${transcriber.name}. ${notes || ''}`]
                );

                // Notify transcriber
                createNotification(transcriber_id, 'New Assignment', `You have been assigned a new order`, 'info');

                // Emit real-time update
                io.emit('order_assigned', {
                    order_id: orderId,
                    transcriber_id: transcriber_id,
                    transcriber_name: transcriber.name
                });

                res.json({ success: true, message: 'Order assigned successfully' });
            }
        );
    });
});

// Notifications: list for current user
app.get('/api/notifications', authenticateToken, (req, res) => {
    const { only_unread = 'false', limit = 50 } = req.query;
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [req.user.userId];
    if (only_unread === 'true') query += ' AND is_read = 0';
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
        }
        res.json({ success: true, notifications: rows });
    });
});

// Notifications: mark as read
app.post('/api/notifications/:id/read', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, req.user.userId], function(err) {
        if (err) {
            console.error('Error marking notification as read:', err);
            return res.status(500).json({ success: false, message: 'Failed to update notification' });
        }
        return res.json({ success: true });
    });
});

// DASHBOARD STATS
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    if (req.user.role === 'admin') {
        // Admin dashboard stats
        const queries = [
            'SELECT COUNT(*) as total FROM orders',
            'SELECT COUNT(*) as pending FROM orders WHERE status = "pending"',
            'SELECT COUNT(*) as in_progress FROM orders WHERE status IN ("assigned", "in_progress")',
            'SELECT COUNT(*) as completed FROM orders WHERE status = "completed"',
            'SELECT COUNT(*) as total FROM users WHERE role = "transcriber" AND status = "active"',
            'SELECT COUNT(*) as available FROM users WHERE role = "transcriber" AND availability_status = "available" AND status = "active"',
            'SELECT SUM(actual_cost) as revenue FROM orders WHERE status = "completed"'
        ];

        Promise.all(queries.map(query => new Promise((resolve, reject) => {
            db.get(query, [], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }))).then(results => {
            res.json({
                success: true,
                stats: {
                    orders: {
                        total: results[0].total || 0,
                        pending: results[1].pending || 0,
                        in_progress: results[2].in_progress || 0,
                        completed: results[3].completed || 0
                    },
                    transcribers: {
                        total: results[4].total || 0,
                        available: results[5].available || 0
                    },
                    revenue: {
                        total: results[6].revenue || 0
                    }
                }
            });
        }).catch(err => {
            console.error('Error fetching admin stats:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch stats' });
        });
    } else {
        // Transcriber dashboard stats
        const userId = req.user.userId;
        const queries = [
            `SELECT COUNT(*) as total FROM orders WHERE assigned_transcriber_id = "${userId}"`,
            `SELECT COUNT(*) as pending FROM orders WHERE assigned_transcriber_id = "${userId}" AND status = "assigned"`,
            `SELECT COUNT(*) as in_progress FROM orders WHERE assigned_transcriber_id = "${userId}" AND status = "in_progress"`,
            `SELECT COUNT(*) as completed FROM orders WHERE assigned_transcriber_id = "${userId}" AND status = "completed"`,
            `SELECT SUM(amount) as earnings FROM payments WHERE transcriber_id = "${userId}" AND status = "paid"`
        ];

        Promise.all(queries.map(query => new Promise((resolve, reject) => {
            db.get(query, [], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        }))).then(results => {
            res.json({
                success: true,
                stats: {
                    orders: {
                        total: results[0].total || 0,
                        pending: results[1].pending || 0,
                        in_progress: results[2].in_progress || 0,
                        completed: results[3].completed || 0
                    },
                    earnings: {
                        total: results[4].earnings || 0
                    }
                }
            });
        }).catch(err => {
            console.error('Error fetching transcriber stats:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch stats' });
        });
    }
});

// NOTIFICATIONS
app.get('/api/notifications', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    
    db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [userId], (err, notifications) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
        }

        res.json({ success: true, notifications });
    });
});

app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
    const notificationId = req.params.id;
    const userId = req.user.userId;
    
    db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, userId], function(err) {
        if (err) {
            console.error('Error marking notification as read:', err);
            return res.status(500).json({ success: false, message: 'Failed to update notification' });
        }

        res.json({ success: true, message: 'Notification marked as read' });
    });
});

// ===== ADMIN ROUTES =====

// @route   GET /api/admin/dashboard/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
app.get('/api/admin/dashboard/stats', authenticateToken, requireAdmin, (req, res) => {
    const stats = {
        totalOrders: 0,
        pendingOrders: 0,
        activeTranscribers: 0,
        totalRevenue: 0,
        pendingApprovals: 0,
        todayOrders: 0,
        todayRevenue: 0,
        availableTranscribers: 0
    };

    // Get total orders
    db.get("SELECT COUNT(*) as count FROM orders", (err, row) => {
        if (!err && row) stats.totalOrders = row.count;
        
        // Get pending orders
        db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'", (err, row) => {
            if (!err && row) stats.pendingOrders = row.count;
            
            // Get active transcribers
            db.get("SELECT COUNT(*) as count FROM users WHERE role = 'transcriber' AND status = 'active'", (err, row) => {
                if (!err && row) {
                    stats.activeTranscribers = row.count;
                    stats.availableTranscribers = row.count;
                }
                
                // Get total revenue
                db.get("SELECT SUM(estimated_cost) as revenue FROM orders WHERE status = 'completed'", (err, row) => {
                    if (!err && row) stats.totalRevenue = row.revenue || 0;
                    
                    // Get pending approvals
                    db.get("SELECT COUNT(*) as count FROM users WHERE status = 'pending_approval'", (err, row) => {
                        if (!err && row) stats.pendingApprovals = row.count;
                        
                        // Get today's orders
                        db.get("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = DATE('now')", (err, row) => {
                            if (!err && row) stats.todayOrders = row.count;
                            
                            // Get today's revenue
                            db.get("SELECT SUM(estimated_cost) as revenue FROM orders WHERE DATE(created_at) = DATE('now')", (err, row) => {
                                if (!err && row) stats.todayRevenue = row.revenue || 0;
                                
                                res.json({
                                    success: true,
                                    stats: stats
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// @route   GET /api/admin/orders
// @desc    Get orders with filtering and pagination
// @access  Private (Admin)
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
    const { limit = 10, status, assigned } = req.query;
    
    let query = `
        SELECT o.*, u.name as assigned_transcriber_name 
        FROM orders o 
        LEFT JOIN users u ON o.assigned_transcriber_id = u.id
    `;
    let params = [];
    let conditions = [];

    if (status) {
        conditions.push("o.status = ?");
        params.push(status);
    }

    if (assigned === 'false') {
        conditions.push("o.assigned_transcriber_id IS NULL");
    } else if (assigned === 'true') {
        conditions.push("o.assigned_transcriber_id IS NOT NULL");
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY o.created_at DESC LIMIT ?";
    params.push(parseInt(limit));

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }

        res.json({
            success: true,
            orders: rows
        });
    });
});

// @route   GET /api/admin/orders/:id
// @desc    Get single order details
// @access  Private (Admin)
app.get('/api/admin/orders/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    
    db.query(`
        SELECT o.*, u.name as assigned_transcriber_name 
        FROM orders o 
        LEFT JOIN users u ON o.assigned_transcriber_id = u.id
        WHERE o.id = ? OR o.order_number = ?
    `, [id, id], (err, results) => {
        if (err) {
            console.error('Error fetching order:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch order'
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: results[0]
        });
    });
});

// @route   POST /api/admin/orders/:id/assign
// @desc    Assign order to transcriber
// @access  Private (Admin)
app.post('/api/admin/orders/:id/assign', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { transcriberIds, priority, notes } = req.body;
    
    if (!transcriberIds || transcriberIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Transcriber ID is required'
        });
    }

    const transcriberId = transcriberIds[0]; // Take first transcriber

    // Get transcriber name
    db.get("SELECT name FROM users WHERE id = ?", [transcriberId], (err, transcriber) => {
        if (err || !transcriber) {
            return res.status(404).json({
                success: false,
                message: 'Transcriber not found'
            });
        }

        // Update order
        db.run(`
            UPDATE orders 
            SET assigned_transcriber_id = ?, 
                status = 'assigned', 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? OR order_number = ?
        `, [transcriberId, id, id], function(err) {
            if (err) {
                console.error('Error assigning order:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to assign order'
                });
            }

            // Add timeline entry
            db.run(`
                INSERT INTO order_timeline (order_id, user_id, action, description)
                VALUES (?, ?, ?, ?)
            `, [id, req.user.id, 'Order Assigned', `Assigned to ${transcriber.name} by admin`], (err) => {
                if (err) console.error('Error adding timeline entry:', err);
            });

            // Create notification for transcriber
            createNotification(
                transcriberId,
                'New Order Assigned',
                `You have been assigned order #${id}. ${notes || ''}`,
                'assignment'
            );

            // Emit real-time notification
            io.emit('orderAssigned', {
                orderId: id,
                transcriberId: transcriberId,
                transcriberName: transcriber.name
            });

            res.json({
                success: true,
                message: 'Order assigned successfully'
            });
        });
    });
});

// @route   GET /api/admin/users
// @desc    Get users with filtering
// @access  Private (Admin)
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    const { status, role } = req.query;
    
    let query = "SELECT * FROM users WHERE 1=1";
    let params = [];

    if (status) {
        query += " AND status = ?";
        params.push(status);
    }

    if (role) {
        query += " AND role = ?";
        params.push(role);
    }

    query += " ORDER BY created_at DESC";

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch users'
            });
        }

        // Remove passwords from response
        const safeUsers = rows.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });

        res.json({
            success: true,
            users: safeUsers
        });
    });
});

// @route   GET /api/admin/users/stats
// @desc    Get user statistics
// @access  Private (Admin)
app.get('/api/admin/users/stats', authenticateToken, requireAdmin, (req, res) => {
    const stats = {
        total: 0,
        active: 0,
        pending: 0,
        suspended: 0
    };

    // Get total users (excluding admin)
    db.get("SELECT COUNT(*) as count FROM users WHERE role != 'admin'", (err, row) => {
        if (!err && row) stats.total = row.count;
        
        // Get active users
        db.get("SELECT COUNT(*) as count FROM users WHERE status = 'active' AND role != 'admin'", (err, row) => {
            if (!err && row) stats.active = row.count;
            
            // Get pending users
            db.get("SELECT COUNT(*) as count FROM users WHERE status = 'pending_approval'", (err, row) => {
                if (!err && row) stats.pending = row.count;
                
                // Get suspended users
                db.get("SELECT COUNT(*) as count FROM users WHERE status = 'suspended'", (err, row) => {
                    if (!err && row) stats.suspended = row.count;
                    
                    res.json({
                        success: true,
                        stats: stats
                    });
                });
            });
        });
    });
});

// @route   GET /api/admin/users/:id
// @desc    Get single user details
// @access  Private (Admin)
app.get('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user'
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove password from response
        const { password, ...safeUser } = results[0];

        res.json({
            success: true,
            user: safeUser
        });
    });
});

// @route   POST /api/admin/users/:id/approve
// @desc    Approve user application
// @access  Private (Admin)
app.post('/api/admin/users/:id/approve', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    
    // Update user status to active
    db.run(`
        UPDATE users 
        SET status = 'active', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `, [id], function(err) {
        if (err) {
            console.error('Error approving user:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to approve user'
            });
        }

        // Create notification for user
        createNotification(
            id,
            'Application Approved',
            'Congratulations! Your transcriber application has been approved. You can now start accepting orders.',
            'approval'
        );

        // Emit real-time notification
        io.emit('userApproved', { userId: id });

        res.json({
            success: true,
            message: 'User approved successfully'
        });
    });
});

// @route   POST /api/admin/users/:id/suspend
// @desc    Suspend user
// @access  Private (Admin)
app.post('/api/admin/users/:id/suspend', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    
    // Update user status to suspended
    db.run(`
        UPDATE users 
        SET status = 'suspended', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `, [id], function(err) {
        if (err) {
            console.error('Error suspending user:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to suspend user'
            });
        }

        // Create notification for user
        createNotification(
            id,
            'Account Suspended',
            'Your account has been suspended. Please contact support for more information.',
            'warning'
        );

        res.json({
            success: true,
            message: 'User suspended successfully'
        });
    });
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (reject application)
// @access  Private (Admin)
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    
    // Delete user
    db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete user'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    });
});

// @route   GET /api/admin/activity
// @desc    Get recent system activity
// @access  Private (Admin)
app.get('/api/admin/activity', authenticateToken, requireAdmin, (req, res) => {
    const { limit = 10 } = req.query;
    
    db.all(`
        SELECT ot.*, u.name as user_name, o.order_number
        FROM order_timeline ot
        LEFT JOIN users u ON ot.user_id = u.id
        LEFT JOIN orders o ON ot.order_id = o.id
        ORDER BY ot.created_at DESC
        LIMIT ?
    `, [parseInt(limit)], (err, rows) => {
        if (err) {
            console.error('Error fetching activity:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch activity'
            });
        }

        res.json({
            success: true,
            activities: rows
        });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Transcribers list (for admin dashboard)
// @route   GET /api/transcribers
// @access  Private (Admin)
app.get('/api/transcribers', authenticateToken, requireAdmin, (req, res) => {
    const query = "SELECT id, name, email, specializations as specialization, availability_status as availability, hourly_rate FROM users WHERE role = 'transcriber'";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching transcribers:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch transcribers' });
        }
        const normalized = (rows || []).map(r => ({
            id: r.id,
            transcriberID: r.id,
            name: r.name,
            email: r.email,
            specialization: r.specialization,
            availability: r.availability,
            hourly_rate: r.hourly_rate ?? null,
        }));
        res.json({ success: true, transcribers: normalized });
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`JD Reporting Company API - Real Database Version`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: SQLite (jd_reporting.db)`);
    console.log(`Real-time: Socket.IO enabled`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
    console.log('API ready for real users and orders!');
});

module.exports = db;

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.end((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});