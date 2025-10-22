/**
 * Main API Router
 * Connects all API endpoints
 */

const express = require('express');
const router = express.Router();
const config = require('../config');

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const orderRoutes = require('./orders');
const transcriptionRoutes = require('./transcriptions');

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/transcriptions', transcriptionRoutes);

// API health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    version: config.apiVersion,
    timestamp: new Date()
  });
});

module.exports = router;