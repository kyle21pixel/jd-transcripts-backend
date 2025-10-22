const express = require('express');
const User = require('../models/user');
const { authenticateToken, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const { page, limit, role } = req.query;

        const result = await User.getAll({
            page,
            limit,
            role
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// @route   POST /api/admin/users/staff
// @desc    Create staff account
// @access  Private (Admin only)
router.post('/users/staff', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const user = await User.create({
            ...req.body,
            role: 'staff'
        });

        res.status(201).json({
            success: true,
            message: 'Staff account created successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create staff account',
            error: error.message
        });
    }
});

module.exports = router;