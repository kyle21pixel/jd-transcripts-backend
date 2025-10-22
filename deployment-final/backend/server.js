const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Mock database
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$X/QQFJfQQW9LR9CXY2hN.O5XJ/qPVEbRv7wh9GvP1oMHxFv8r5Fvy', // password123
    name: 'Admin User',
    email: 'admin@jdreporting.org',
    role: 'admin'
  },
  {
    id: 2,
    username: 'manager',
    password: '$2b$10$X/QQFJfQQW9LR9CXY2hN.O5XJ/qPVEbRv7wh9GvP1oMHxFv8r5Fvy', // password123
    name: 'Manager User',
    email: 'manager@jdreporting.org',
    role: 'manager'
  }
];

const orders = [
  {
    id: 1,
    order_number: 'JD20250001',
    client_name: 'John Doe',
    client_email: 'john@example.com',
    client_phone: '1234567890',
    service_type: 'legal',
    turnaround: '24h',
    file_name: 'deposition.mp3',
    file_path: '/uploads/deposition.mp3',
    duration_minutes: 60,
    estimated_cost: 2500,
    special_instructions: 'Please include timestamps',
    status: 'pending',
    created_at: '2025-08-10T10:30:00Z'
  },
  {
    id: 2,
    order_number: 'JD20250002',
    client_name: 'Jane Smith',
    client_email: 'jane@example.com',
    client_phone: '0987654321',
    service_type: 'medical',
    turnaround: 'same-day',
    file_name: 'patient-notes.mp3',
    file_path: '/uploads/patient-notes.mp3',
    duration_minutes: 45,
    estimated_cost: 3200,
    special_instructions: 'Medical terminology expertise required',
    status: 'processing',
    created_at: '2025-08-11T14:15:00Z'
  },
  {
    id: 3,
    order_number: 'JD20250003',
    client_name: 'Robert Johnson',
    client_email: 'robert@example.com',
    client_phone: '5551234567',
    service_type: 'zoom',
    turnaround: '48h',
    file_name: 'meeting-recording.mp4',
    file_path: '/uploads/meeting-recording.mp4',
    duration_minutes: 90,
    estimated_cost: 1800,
    special_instructions: 'Please identify speakers',
    status: 'completed',
    created_at: '2025-08-12T09:45:00Z'
  }
];

// Helper functions
function generateOrderNumber() {
  return 'JD' + new Date().getFullYear() + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

function calculateCost(serviceType, durationMinutes, turnaround) {
  const baseRates = {
    'legal': 1.50,
    'medical': 1.75,
    'zoom': 1.25,
    'academic': 1.25
  };
  
  const turnaroundMultipliers = {
    'same-day': 1.50,
    '24h': 1.25,
    '48h': 1.10,
    '3-5': 1.00
  };
  
  const baseRate = baseRates[serviceType] || 1.25;
  const multiplier = turnaroundMultipliers[turnaround] || 1.00;
  
  return Math.round(durationMinutes * baseRate * multiplier);
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.user = user;
    next();
  });
}

// Admin middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
  
  next();
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'JD Reporting Company API' });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => false);
  
  // For demo purposes, also allow direct password comparison
  const isPasswordMatch = password === 'password123';
  
  if (!isPasswordValid && !isPasswordMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

// Order routes
app.get('/api/orders', authenticateToken, (req, res) => {
  res.json({ orders });
});

app.post('/api/orders', upload.single('file'), (req, res) => {
  const { 
    client_name, 
    client_email, 
    client_phone, 
    service_type, 
    turnaround, 
    duration_minutes, 
    special_instructions 
  } = req.body;
  
  const file = req.file;
  const order_number = generateOrderNumber();
  const estimated_cost = calculateCost(
    service_type || 'legal',
    duration_minutes || 60,
    turnaround || '24h'
  );
  
  const newOrder = {
    id: orders.length + 1,
    order_number,
    client_name,
    client_email,
    client_phone,
    service_type,
    turnaround,
    file_name: file ? file.originalname : 'sample-file.mp3',
    file_path: file ? file.path : '/uploads/sample-file.mp3',
    file_size: file ? file.size : 1000000,
    duration_minutes: duration_minutes || 60,
    estimated_cost,
    special_instructions,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  orders.push(newOrder);
  
  res.json({
    success: true,
    message: 'Order received successfully',
    order_number,
    estimated_cost
  });
});

// Admin dashboard routes
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  
  res.json({
    stats: {
      total_orders: orders.length,
      pending_orders: pendingOrders,
      processing_orders: processingOrders,
      completed_orders: completedOrders
    },
    recent_orders: orders.slice(0, 5)
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});