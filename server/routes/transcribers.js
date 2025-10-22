const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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

// GET /api/transcribers
// List transcribers with optional filters
router.get('/', async (req, res) => {
  try {
    const { specialization, availability, search, limit = 50, page = 1 } = req.query;

    let query = 'SELECT id, name, email, specialization, availability_status as availability, hourly_rate FROM users WHERE role = ? AND is_active = 1';
    let params = ['transcriber'];

    if (specialization && specialization !== 'all') {
      query += ' AND specialization = ?';
      params.push(specialization);
    }
    if (availability && availability !== 'all') {
      query += ' AND availability_status = ?';
      params.push(availability);
    }
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const [rows] = await global.db.promise().query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE role = ? AND is_active = 1';
    let countParams = ['transcriber'];
    if (specialization && specialization !== 'all') {
      countQuery += ' AND specialization = ?';
      countParams.push(specialization);
    }
    if (availability && availability !== 'all') {
      countQuery += ' AND availability_status = ?';
      countParams.push(availability);
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const [countRows] = await global.db.promise().query(countQuery, countParams);
    const total = countRows[0].total;

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transcribers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/transcribers
// Create new transcriber (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, specialization, hourlyRate, availability } = req.body;

    if (!name || !email || !specialization) {
      return res.status(400).json({ success: false, message: 'name, email, and specialization are required' });
    }

    // Check if email or username already exists
    const [existing] = await global.db.promise().query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email.toLowerCase(), email.toLowerCase()]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const id = uuidv4();
    const query = `INSERT INTO users (id, email, username, password, name, role, phone, specialization, hourly_rate, availability_status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      id,
      email.toLowerCase(),
      email.toLowerCase(), // username as email for now
      hashedPassword,
      name,
      'transcriber',
      phone || '',
      specialization,
      hourlyRate ? Number(hourlyRate) : 25,
      availability || 'available'
    ];

    await global.db.promise().query(query, params);

    res.status(201).json({
      success: true,
      data: {
        id,
        name,
        email: email.toLowerCase(),
        specialization,
        availability: availability || 'available',
        hourlyRate: hourlyRate ? Number(hourlyRate) : 25
      },
      message: 'Transcriber created successfully'
    });
  } catch (error) {
    console.error('Error creating transcriber:', error);
    res.status(500).json({ success: false, message: 'Failed to create transcriber' });
  }
});

// DELETE /api/transcribers/clear
// Remove all transcribers (Admin only)
router.delete('/clear', authenticate, requireAdmin, async (req, res) => {
  try {
    const [result] = await global.db.promise().query('DELETE FROM users WHERE role = ?', ['transcriber']);
    res.json({ success: true, message: 'Transcribers cleared', removed: result.affectedRows });
  } catch (error) {
    console.error('Error clearing transcribers:', error);
    res.status(500).json({ success: false, message: 'Failed to clear transcribers' });
  }
});

module.exports = router;