const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../app-real');

// Middleware to check JWT token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// GET /api/admin/dashboard
// Get dashboard stats
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    // Total orders
    const [totalOrdersRows] = await db.promise().query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = totalOrdersRows[0].count;

    // Pending orders
    const [pendingRows] = await db.promise().query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    const pendingOrders = pendingRows[0].count;

    // Processing orders (in-progress)
    const [processingRows] = await db.promise().query("SELECT COUNT(*) as count FROM orders WHERE status IN ('processing', 'in-progress')");
    const processingOrders = processingRows[0].count;

    // Completed orders
    const [completedRows] = await db.promise().query("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'");
    const completedOrders = completedRows[0].count;

    // Total revenue
    const [revenueRows] = await db.promise().query('SELECT SUM(estimated_cost) as total FROM orders WHERE status = \'completed\'');
    const totalRevenue = revenueRows[0].total || 0;

    // Active transcribers
    const [activeTranscribersRows] = await db.promise().query("SELECT COUNT(*) as count FROM users WHERE role = 'transcriber' AND is_active = 1 AND availability = 'available'");
    const activeTranscribers = activeTranscribersRows[0].count;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        inProgressOrders: processingOrders,
        processingOrders,
        completedOrders,
        totalRevenue: parseFloat(totalRevenue).toFixed(2),
        activeTranscribers
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/reports/daily
// Return today's KPIs and recent orders for reporting cards
router.get('/reports/daily', authenticate, requireAdmin, async (req, res) => {
  try {
    const [summary] = await db.promise().query(`
      SELECT 
        COUNT(*)                               AS totalOrders,
        SUM(CASE WHEN DATE(created_at)=CURDATE() THEN 1 ELSE 0 END) AS ordersToday,
        SUM(CASE WHEN status='completed' AND DATE(updated_at)=CURDATE() THEN 1 ELSE 0 END) AS completedToday,
        COALESCE(SUM(CASE WHEN status='completed' THEN estimated_cost ELSE 0 END),0) AS totalRevenue
      FROM orders
    `);

    const [recent] = await db.promise().query(`
      SELECT order_number, client_name, service_type, status, estimated_cost, created_at
      FROM orders
      WHERE DATE(created_at)=CURDATE()
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json({ success: true, data: { ...summary[0], recentOrders: recent } });
  } catch (error) {
    console.error('Error building daily report:', error);
    res.status(500).json({ success: false, message: 'Failed to load daily report' });
  }
});

// GET /api/admin/orders
// Get orders list
router.get('/orders', authenticate, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT id as orderId, client_name as clientName, service_type as serviceType,
             status, created_at as createdAt, estimated_cost as estimatedCost
      FROM orders
      ORDER BY created_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/admin/users
// Get all users (Admin only)
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role, search } = req.query;

    let query = 'SELECT id, username, role, created_at FROM users WHERE is_active = 1';
    const params = [];

    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      query += ' AND (username LIKE ? OR name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.promise().query(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// POST /api/admin/users
// Create new user (Admin only)
router.post('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: 'username, password, and role are required' });
    }

    // Check if username exists
    const [existing] = await db.promise().query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid');

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const email = `${username}@jdreporting.local`; // Default email
    const name = username; // Use username as name

    await db.promise().query(
      'INSERT INTO users (id, email, username, password, name, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, username, hashedPassword, name, role]
    );

    res.status(201).json({
      success: true,
      data: { id, username, role },
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// PUT /api/admin/orders/:id/assign
// Assign order to transcriber
router.put('/orders/:id/assign', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { transcriberId } = req.body;

    if (!transcriberId) {
      return res.status(400).json({ success: false, message: 'Transcriber ID is required' });
    }

    // Check if transcriber exists and is active
    const [transcriberRows] = await db.promise().query('SELECT id, name FROM users WHERE id = ? AND role = ? AND is_active = 1', [transcriberId, 'transcriber']);
    if (transcriberRows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid transcriber' });
    }

    // Update order
    await db.promise().query(
      'UPDATE orders SET assigned_transcriber_id = ?, assigned_transcriber_name = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [transcriberId, transcriberRows[0].name, 'assigned', id]
    );

    res.json({
      success: true,
      message: 'Order assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning order:', error);
    res.status(500).json({ success: false, message: 'Failed to assign order' });
  }
});

module.exports = router;