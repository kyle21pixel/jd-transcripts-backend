const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Create order
router.post('/',
    body('client_name').isString().notEmpty(),
    body('client_email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {
                client_name, client_email, client_phone,
                service_type, turnaround, file_name, file_path,
                file_size, duration_minutes, estimated_cost,
                special_instructions, status, assigned_to, assigned_by,
                assigned_at, deadline
            } = req.body;

            const sql = `
                INSERT INTO orders (
                    order_number, client_name, client_email, client_phone,
                    service_type, turnaround, file_name, file_path, file_size,
                    duration_minutes, estimated_cost, special_instructions, status,
                    assigned_to, assigned_by, assigned_at, deadline
                ) VALUES (
                    UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )
            `;
            await query(sql, [
                client_name, client_email, client_phone,
                service_type, turnaround, file_name, file_path,
                file_size, duration_minutes, estimated_cost,
                special_instructions, status || 'pending', assigned_to, assigned_by,
                assigned_at, deadline
            ]);
            res.status(201).json({ message: 'Order created' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;