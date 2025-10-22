const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Create a test order
router.post('/create',
    body('client_name').isString().notEmpty(),
    body('client_email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const sql = `INSERT INTO orders (order_number, client_name, client_email, client_phone, service_type, turnaround, file_name, file_path, file_size, duration_minutes, estimated_cost, special_instructions, status, assigned_to, assigned_by, assigned_at, deadline)
            VALUES (UUID(), ?, ?, ?, 'legal', '24h', 'testfile.mp3', '/uploads/testfile.mp3', 12345, 60, 100.00, 'Test order from API', 'pending', NULL, NULL, NOW(), NOW())`;
            const { client_name, client_email, client_phone } = req.body;
            await query(sql, [client_name, client_email, client_phone]);
            res.json({ success: true, message: 'Test order created!' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

module.exports = router;
