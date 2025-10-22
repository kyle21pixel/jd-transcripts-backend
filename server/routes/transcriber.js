const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../app-real'); // Assuming db is exported from app-real.js

// Middleware to verify transcriber JWT
const verifyTranscriber = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        if (decoded.role !== 'transcriber') {
            return res.status(403).json({ error: 'Access denied. Transcriber role required.' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// Get transcriber dashboard stats
router.get('/dashboard', verifyTranscriber, (req, res) => {
    const transcriberId = req.user.id;

    // Get assigned orders count
    const assignedQuery = `SELECT COUNT(*) as count FROM orders WHERE assigned_transcriber_id = ?`;
    db.query(assignedQuery, [transcriberId], (err, assignedResult) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Get in progress orders
        const inProgressQuery = `SELECT COUNT(*) as count FROM orders WHERE assigned_transcriber_id = ? AND status IN ('assigned', 'in-progress')`;
        db.query(inProgressQuery, [transcriberId], (err, inProgressResult) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            // Get completed orders
            const completedQuery = `SELECT COUNT(*) as count FROM orders WHERE assigned_transcriber_id = ? AND status = 'completed'`;
            db.query(completedQuery, [transcriberId], (err, completedResult) => {
                if (err) return res.status(500).json({ error: 'Database error' });

                // Get total earnings (sum of actual_cost for completed orders)
                const earningsQuery = `SELECT COALESCE(SUM(actual_cost), 0) as total FROM orders WHERE assigned_transcriber_id = ? AND status = 'completed'`;
                db.query(earningsQuery, [transcriberId], (err, earningsResult) => {
                    if (err) return res.status(500).json({ error: 'Database error' });

                    res.json({
                        data: {
                            assignedOrders: assignedResult[0].count,
                            inProgressOrders: inProgressResult[0].count,
                            completedOrders: completedResult[0].count,
                            totalEarnings: parseFloat(earningsResult[0].total)
                        }
                    });
                });
            });
        });
    });
});

// Get assigned orders for transcriber
router.get('/orders', verifyTranscriber, (req, res) => {
    const transcriberId = req.user.id;
    const query = `
        SELECT id, order_number, client_name, service_type, status, estimated_cost, actual_cost, due_date, created_at
        FROM orders
        WHERE assigned_transcriber_id = ?
        ORDER BY created_at DESC
    `;
    db.query(query, [transcriberId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ data: results });
    });
});

// Update order status
router.put('/orders/:id/status', verifyTranscriber, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const transcriberId = req.user.id;

    // First check if order is assigned to this transcriber
    const checkQuery = `SELECT id FROM orders WHERE id = ? AND assigned_transcriber_id = ?`;
    db.query(checkQuery, [id, transcriberId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.length === 0) return res.status(403).json({ error: 'Order not assigned to you' });

        // Update status
        const updateQuery = `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        db.query(updateQuery, [status, id], (err, updateResult) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            // If completed, set completed_date
            if (status === 'completed') {
                const completeQuery = `UPDATE orders SET completed_date = CURRENT_TIMESTAMP WHERE id = ?`;
                db.query(completeQuery, [id], (err) => {
                    if (err) console.error('Error setting completed date:', err);
                });
            }

            res.json({ success: true, message: 'Status updated' });
        });
    });
});

// Get transcriber profile
router.get('/profile', verifyTranscriber, (req, res) => {
    const query = `SELECT id, username, email, name, phone, specialization, hourly_rate, availability FROM users WHERE id = ?`;
    db.query(query, [req.user.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.length === 0) return res.status(404).json({ error: 'Profile not found' });
        res.json({ data: result[0] });
    });
});

// Update transcriber profile
router.put('/profile', verifyTranscriber, (req, res) => {
    const { name, phone, specialization, hourly_rate, availability } = req.body;
    const query = `UPDATE users SET name = ?, phone = ?, specialization = ?, hourly_rate = ?, availability = ? WHERE id = ?`;
    db.query(query, [name, phone, specialization, hourly_rate, availability, req.user.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, message: 'Profile updated' });
    });
});

module.exports = router;