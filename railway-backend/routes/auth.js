const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Simple admin users (in production, this would be in database)
const adminUsers = [
    {
        id: 1,
        username: 'jd.admin',
        password: '$2b$12$imSdL4Rndd0qEo.5hmyQAO85Z5PlqHOUpiIlZWJWAKx2yeUnWT6Gi', // admin123
        role: 'admin',
        email: 'admin@jdlegaltranscripts.com'
    },
    {
        id: 2,
        username: 'jd.manager',
        password: '$2b$12$RV2yXQFj1zIGPExOl3.y2eyMWhk3XOeb0FXClgdYnaXp97tOeacki', // manager123
        role: 'manager',
        email: 'manager@jdlegaltranscripts.com'
    },
    {
        id: 3,
        username: 'jd.supervisor',
        password: '$2b$12$Vc8agHULoc3l4D5K.5GH3OskaJ1ugG3akn3Pj9wx6lSjmKU/S./dO', // super123
        role: 'supervisor',
        email: 'supervisor@jdlegaltranscripts.com'
    }
];

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user
        const user = adminUsers.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// @route   POST /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.post('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = adminUsers.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
});

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const { currentPassword, newPassword } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const userIndex = adminUsers.findIndex(u => u.id === decoded.id);

        if (userIndex === -1) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = adminUsers[userIndex];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password (in production, this would update the database)
        adminUsers[userIndex].password = hashedPassword;

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password change',
            error: error.message
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout (client-side token removal)
// @access  Private
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

module.exports = router;