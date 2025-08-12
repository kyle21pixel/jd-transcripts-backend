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
                                email: user.email,
                                name: user.name
                            }
                        }
                    });
                }
            }
        } catch (dbError) {
            console.log('Database not available, using fallback users:', dbError.message);
        }

        // Fallback to hardcoded users if database is not available or user not found
        if (!user || !isMatch) {
            const fallbackUser = fallbackAdminUsers.find(u => u.username === username || u.email === username);
            if (fallbackUser) {
                const fallbackMatch = await bcrypt.compare(password, fallbackUser.password);
                if (fallbackMatch) {
                    const token = jwt.sign(
                        { 
                            id: fallbackUser.id, 
                            username: fallbackUser.username, 
                            role: fallbackUser.role 
                        },
                        process.env.JWT_SECRET || 'fallback-secret',
                        { expiresIn: process.env.JWT_EXPIRE || '7d' }
                    );

                    return res.json({
                        success: true,
                        message: 'Login successful (fallback mode)',
                        data: {
                            token,
                            user: {
                                id: fallbackUser.id,
                                username: fallbackUser.username,
                                role: fallbackUser.role,
                                email: fallbackUser.email
                            }
                        }
                    });
                }
            }
        }

        // If we get here, credentials are invalid
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
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
        let user = null;

        try {
            // Try to find user in MongoDB first
            user = await User.findById(decoded.id);
            
            if (user) {
                return res.json({
                    success: true,
                    data: {
                        user: {
                            id: user._id,
                            username: user.username || user.email,
                            role: user.role || (user.isAdmin ? 'admin' : 'user'),
                            email: user.email,
                            name: user.name
                        }
                    }
                });
            }
        } catch (dbError) {
            console.log('Database not available for token verification, using fallback');
        }

        // Fallback to hardcoded users
        const fallbackUser = fallbackAdminUsers.find(u => u.id === decoded.id);
        if (fallbackUser) {
            return res.json({
                success: true,
                data: {
                    user: {
                        id: fallbackUser.id,
                        username: fallbackUser.username,
                        role: fallbackUser.role,
                        email: fallbackUser.email
                    }
                }
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid token'
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