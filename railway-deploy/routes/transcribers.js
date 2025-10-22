const express = require('express');
const router = express.Router();

// Simplified transcribers route for deployment
// @route   GET /api/transcribers
// @desc    Get all transcribers (simplified)
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        // Mock data for now
        const transcribers = [
            {
                id: 1,
                name: 'John Doe',
                specialization: 'legal',
                status: 'active',
                isAvailable: true
            },
            {
                id: 2,
                name: 'Jane Smith',
                specialization: 'medical',
                status: 'active',
                isAvailable: false
            }
        ];

        res.json({
            success: true,
            data: transcribers
        });
    } catch (error) {
        console.error('Error fetching transcribers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transcribers',
            error: error.message
        });
    }
});

module.exports = router;