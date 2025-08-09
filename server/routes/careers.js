const express = require('express');
const router = express.Router();

// Simplified careers routes for deployment
// @route   POST /api/careers/apply
// @desc    Submit job application (simplified)
// @access  Public
router.post('/apply', async (req, res) => {
    try {
        console.log('Job application received:', req.body);
        
        const applicationData = {
            applicationId: 'APP' + Date.now(),
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationId: applicationData.applicationId,
                status: applicationData.status
            }
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
});

// @route   GET /api/careers/positions
// @desc    Get available positions
// @access  Public
router.get('/positions', async (req, res) => {
    try {
        const positions = [
            {
                id: 'legal-transcriber',
                title: 'Legal Transcriber',
                department: 'Transcription',
                type: 'Full-time / Part-time',
                location: 'Remote',
                description: 'Transcribe legal proceedings, depositions, and court hearings with high accuracy.',
                requirements: [
                    '2+ years of legal transcription experience',
                    'Knowledge of legal terminology',
                    'Typing speed of 75+ WPM with 98% accuracy',
                    'Familiarity with legal document formats'
                ],
                salary: '$18-28/hour'
            },
            {
                id: 'medical-transcriber',
                title: 'Medical Transcriber',
                department: 'Transcription',
                type: 'Full-time / Part-time',
                location: 'Remote',
                description: 'Transcribe medical reports, patient consultations, and clinical notes.',
                requirements: [
                    '1+ years of medical transcription experience',
                    'Knowledge of medical terminology and anatomy',
                    'Typing speed of 70+ WPM with 98% accuracy',
                    'Understanding of HIPAA compliance'
                ],
                salary: '$20-30/hour'
            }
        ];

        res.json({
            success: true,
            data: positions
        });
    } catch (error) {
        console.error('Error fetching positions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch positions',
            error: error.message
        });
    }
});

module.exports = router;