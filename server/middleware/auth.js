const jwt = require('jsonwebtoken');

// Authentication middleware
const auth = (req, res, next) => {
    try {
        // Check for token in multiple places
        let token = req.cookies?.token || 
                   req.header('Authorization')?.replace('Bearer ', '') ||
                   req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Invalid token.' 
        });
    }
};

// Admin role middleware
const admin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false,
            message: 'Access denied. Authentication required.' 
        });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({ 
            success: false,
            message: 'Access denied. Admin privileges required.' 
        });
    }

    next();
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
    try {
        let token = req.cookies?.token || 
                   req.header('Authorization')?.replace('Bearer ', '') ||
                   req.header('x-auth-token');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
            req.user = decoded;
        }
        next();
    } catch (error) {
        // Continue without user if token is invalid
        next();
    }
};

module.exports = auth;
module.exports.admin = admin;
module.exports.optionalAuth = optionalAuth;