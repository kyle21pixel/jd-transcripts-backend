const express = require('express');
const router = express.Router();
const CustomerModel = require('../models/customer');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Create new customer
router.post('/',
    authenticateToken,
    body('first_name').isString().notEmpty(),
    body('last_name').isString().notEmpty(),
    body('email').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { first_name, last_name, email, phone, company } = req.body;

            // Check if customer already exists
            const existingCustomer = await CustomerModel.getByEmail(email);
            if (existingCustomer) {
                return res.status(400).json({ message: 'Customer already exists' });
            }

            const customerId = await CustomerModel.create({
                first_name,
                last_name,
                email,
                phone,
                company
            });

            res.status(201).json({ message: 'Customer created successfully', customerId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating customer', error: error.message });
        }
    });

// Get customer by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const customer = await CustomerModel.getById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
});

// Update customer
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { first_name, last_name, phone, company } = req.body;
        const success = await CustomerModel.update(req.params.id, {
            first_name,
            last_name,
            phone,
            company
        });
        
        if (!success) {
            return res.status(400).json({ message: 'Failed to update customer' });
        }
        
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
});

// Search customers
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { email } = req.query;
        if (email) {
            const customer = await CustomerModel.getByEmail(email);
            return res.json(customer ? [customer] : []);
        }
        // Additional search functionality can be added here
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Error searching customers', error: error.message });
    }
});

module.exports = router;