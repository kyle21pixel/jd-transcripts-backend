const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Fallback admin users (used when database is not available)
const fallbackAdminUsers = [
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

        let user = null;
        let isMatch = false;

        try {
            // Try to find user in MongoDB first
            user = await User.findOne({ 
                $or: [
                    { email: username },
                    { username: username }
                ]
            });

            if (user) {
                // Check password against MongoDB user
                isMatch = await bcrypt.compare(password, user.password);
                
                if (isMatch) {
                    // Generate JWT token
                    const token = jwt.sign(
                        { 
                            id: user._id, 
                            username: user.username || user.email, 
                            role: user.role || (user.isAdmin ? 'admin' : 'user'),
                            email: user.email
                        },
                        process.env.JWT_SECRET || 'fallback-secret',
                        { expiresIn: process.env.JWT_EXPIRE || '7d' }
                    );

                    return res.json({
                        success: true,
                        message: 'Login successful',
                        data: {
                            token,
                            user: {
                                id: user._id,
                                username: user.username || user.email,
                                role: user.role || (user.isAdmin ? 'admin' : 'user'),
                                email: user.email
                            }
                        }
                    });
                }
            }
        } catch (err) {
            // Ignore DB errors, fallback to static users
        }

        // Fallback to static admin users
        for (const admin of fallbackAdminUsers) {
            if (admin.username === username || admin.email === username) {
                isMatch = await bcrypt.compare(password, admin.password);
                if (isMatch) {
                    const token = jwt.sign(
                        {
                            id: admin.id,
                            username: admin.username,
                            role: admin.role,
                            email: admin.email
                        },
                        process.env.JWT_SECRET || 'fallback-secret',
                        { expiresIn: process.env.JWT_EXPIRE || '7d' }
                    );
                    return res.json({
                        success: true,
                        message: 'Login successful',
                        data: {
                            token,
                            user: {
                                id: admin.id,
                                username: admin.username,
                                role: admin.role,
                                email: admin.email
                            }
                        }
                    });
                }
            }
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Public
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ isLoggedIn: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        res.json({ isLoggedIn: true, user: decoded });
    } catch (err) {
        res.json({ isLoggedIn: false });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout (client-side only)
// @access  Public
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
