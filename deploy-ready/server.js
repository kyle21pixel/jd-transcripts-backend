const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock API endpoints
app.post('/api/orders', (req, res) => {
  console.log('Order received:', req.body);
  res.json({
    success: true,
    message: 'Order received successfully',
    orderNumber: 'JD' + Date.now().toString().slice(-8),
    estimatedCost: Math.floor(Math.random() * 5000) + 1000
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    orders: [
      {
        id: 1,
        orderNumber: 'JD20250001',
        clientName: 'John Doe',
        serviceType: 'legal',
        status: 'pending',
        createdAt: '2025-08-10T10:30:00Z',
        estimatedCost: 2500
      },
      {
        id: 2,
        orderNumber: 'JD20250002',
        clientName: 'Jane Smith',
        serviceType: 'medical',
        status: 'processing',
        createdAt: '2025-08-11T14:15:00Z',
        estimatedCost: 3200
      },
      {
        id: 3,
        orderNumber: 'JD20250003',
        clientName: 'Robert Johnson',
        serviceType: 'zoom',
        status: 'completed',
        createdAt: '2025-08-12T09:45:00Z',
        estimatedCost: 1800
      }
    ]
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple mock authentication
  if (username === 'admin' && password === 'password123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-for-testing',
      user: {
        id: 1,
        username: 'admin',
        name: 'Admin User',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
  console.log(`Admin credentials: username: admin, password: password123`);
});