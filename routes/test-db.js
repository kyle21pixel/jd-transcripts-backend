const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Test DB connection and return all users
router.get('/users', async (req, res) => {
    try {
        const users = await query('SELECT * FROM users LIMIT 100');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test DB connection and return all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await query('SELECT * FROM orders LIMIT 100');
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
