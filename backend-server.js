const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simple file-based storage (will replace with WordPress later)
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const TRANSCRIBERS_FILE = path.join(DATA_DIR, 'transcribers.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize files if they don't exist
        try {
            await fs.access(ORDERS_FILE);
        } catch {
            await fs.writeFile(ORDERS_FILE, JSON.stringify([]));
        }
        
        try {
            await fs.access(TRANSCRIBERS_FILE);
        } catch {
            await fs.writeFile(TRANSCRIBERS_FILE, JSON.stringify([
                {
                    id: 1,
                    transcriberID: 'T-001',
                    name: 'Sarah Johnson',
                    email: 'sarah@jdtranscripts.com',
                    phone: '+1-555-0101',
                    specialization: 'Medical',
                    hourlyRate: 25,
                    availability: 'available'
                },
                {
                    id: 2,
                    transcriberID: 'T-002',
                    name: 'Mike Chen',
                    email: 'mike@jdtranscripts.com',
                    phone: '+1-555-0102',
                    specialization: 'Legal',
                    hourlyRate: 30,
                    availability: 'available'
                }
            ]));
        }
    } catch (error) {
        console.error('Error setting up data directory:', error);
    }
}

// Helper functions
async function readJSON(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function writeJSON(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'JD Transcripts Backend is running!',
        timestamp: new Date().toISOString()
    });
});

// Orders endpoints
app.post('/api/orders', async (req, res) => {
    try {
        const orders = await readJSON(ORDERS_FILE);
        const newOrder = {
            id: orders.length + 1,
            orderId: `JD-${String(orders.length + 1).padStart(4, '0')}`,
            clientName: req.body.clientName,
            email: req.body.email,
            phone: req.body.phone || '',
            serviceType: req.body.serviceType,
            turnaroundTime: req.body.turnaroundTime || '',
            audioLength: req.body.audioLength || '',
            specialInstructions: req.body.specialInstructions || '',
            estimatedCost: req.body.estimatedCost || 0,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        await writeJSON(ORDERS_FILE, orders);
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId: newOrder.orderId,
            data: newOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await readJSON(ORDERS_FILE);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const orders = await readJSON(ORDERS_FILE);
        const order = orders.find(o => o.id === parseInt(req.params.id));
        
        if (order) {
            res.json({ success: true, data: order });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch order' });
    }
});

// Admin endpoints
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple authentication - replace with proper auth later
    if (username === 'admin' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Login successful',
            token: 'admin-token-2024',
            user: { username: 'admin', role: 'administrator' }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const orders = await readJSON(ORDERS_FILE);
        
        const stats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            processingOrders: orders.filter(o => o.status === 'processing').length,
            completedOrders: orders.filter(o => o.status === 'completed').length,
            totalRevenue: orders
                .filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + (o.estimatedCost || 0), 0)
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
});

app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await readJSON(ORDERS_FILE);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

// Transcribers endpoints
app.get('/api/transcribers', async (req, res) => {
    try {
        const transcribers = await readJSON(TRANSCRIBERS_FILE);
        res.json({ success: true, data: transcribers });
    } catch (error) {
        console.error('Error fetching transcribers:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch transcribers' });
    }
});

app.post('/api/transcribers', async (req, res) => {
    try {
        const transcribers = await readJSON(TRANSCRIBERS_FILE);
        const newTranscriber = {
            id: transcribers.length + 1,
            transcriberID: `T-${String(transcribers.length + 1).padStart(3, '0')}`,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone || '',
            specialization: req.body.specialization,
            hourlyRate: req.body.hourlyRate || 0,
            availability: req.body.availability || 'available'
        };
        
        transcribers.push(newTranscriber);
        await writeJSON(TRANSCRIBERS_FILE, transcribers);
        
        res.status(201).json({
            success: true,
            message: 'Transcriber created successfully',
            data: newTranscriber
        });
    } catch (error) {
        console.error('Error creating transcriber:', error);
        res.status(500).json({ success: false, message: 'Failed to create transcriber' });
    }
});

app.delete('/api/transcribers/clear', async (req, res) => {
    try {
        await writeJSON(TRANSCRIBERS_FILE, []);
        res.json({ success: true, message: 'All transcribers cleared' });
    } catch (error) {
        console.error('Error clearing transcribers:', error);
        res.status(500).json({ success: false, message: 'Failed to clear transcribers' });
    }
});

// Start server
async function startServer() {
    await ensureDataDir();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log('🚀 JD Transcripts Backend Server Started!');
        console.log('=====================================');
        console.log(`📍 Server running on: http://0.0.0.0:${PORT}`);
        console.log(`🔧 API Base URL: http://0.0.0.0:${PORT}/api`);
        console.log(`📊 Health Check: http://0.0.0.0:${PORT}/api/health`);
        console.log('=====================================');
        console.log('📋 Available Endpoints:');
        console.log('  POST /api/orders - Create new order');
        console.log('  GET  /api/orders - Get all orders');
        console.log('  POST /api/admin/login - Admin login');
        console.log('  GET  /api/admin/dashboard - Dashboard stats');
        console.log('  GET  /api/transcribers - Get transcribers');
        console.log('=====================================');
    });
}

startServer().catch(console.error);