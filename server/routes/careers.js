const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const emailController = require('../controllers/emailController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/applications/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow specific file types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images, PDFs, and document files are allowed'));
        }
    }
});

// @route   POST /api/careers/apply
// @desc    Submit job application
// @access  Public
router.post('/apply', upload.array('documents', 5), async (req, res) => {
    try {
        const applicationData = JSON.parse(req.body.applicationData);
        
        // Process uploaded files
        const documents = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                documents.push({
                    type: file.fieldname.includes('resume') ? 'resume' : 
                          file.fieldname.includes('cover') ? 'cover-letter' :
                          file.fieldname.includes('portfolio') ? 'portfolio' : 'other',
                    filename: file.filename,
                    originalName: file.originalname,
                    size: file.size
                });
            });
        }

        const application = new JobApplication({
            ...applicationData,
            documents
        });

        await application.save();

        // Send confirmation email to applicant
        await emailController.sendApplicationConfirmation({
            applicationId: application.applicationId,
            applicantName: application.fullName,
            position: application.position
        }, {
            name: application.fullName,
            email: application.personalInfo.email
        });

        // Send notification to admin
        await emailController.sendNewApplicationNotification({
            applicationId: application.applicationId,
            applicantName: application.fullName,
            position: application.position,
            email: application.personalInfo.email,
            phone: application.personalInfo.phone,
            experience: application.experience.transcriptionExperience,
            specializations: application.skills.specializations
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationId: application.applicationId,
                status: application.applicationStatus.status
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

// @route   GET /api/careers/applications
// @desc    Get all job applications (admin only)
// @access  Private
router.get('/applications', auth, async (req, res) => {
    try {
        const { status, position, page = 1, limit = 10, search } = req.query;
        
        let query = {};
        
        // Filter by status
        if (status && status !== 'all') {
            query['applicationStatus.status'] = status;
        }
        
        // Filter by position
        if (position && position !== 'all') {
            query.position = position;
        }
        
        // Search functionality
        if (search) {
            query.$or = [
                { applicationId: { $regex: search, $options: 'i' } },
                { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
                { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
                { 'personalInfo.email': { $regex: search, $options: 'i' } }
            ];
        }

        const applications = await JobApplication.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await JobApplication.countDocuments(query);

        res.json({
            success: true,
            data: applications,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
});

// @route   GET /api/careers/applications/:id
// @desc    Get single job application
// @access  Private
router.get('/applications/:id', auth, async (req, res) => {
    try {
        const application = await JobApplication.findOne({ 
            applicationId: req.params.id 
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application',
            error: error.message
        });
    }
});

// @route   PUT /api/careers/applications/:id/status
// @desc    Update application status
// @access  Private
router.put('/applications/:id/status', auth, async (req, res) => {
    try {
        const { status, notes = '', interviewDate, rejectionReason } = req.body;

        const application = await JobApplication.findOne({ 
            applicationId: req.params.id 
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const oldStatus = application.applicationStatus.status;
        application.applicationStatus.status = status;
        
        if (rejectionReason) {
            application.applicationStatus.rejectionReason = rejectionReason;
        }
        
        if (interviewDate) {
            application.applicationStatus.interviewDate = new Date(interviewDate);
        }

        // Add note if provided
        if (notes) {
            application.notes.push({
                note: notes,
                addedBy: req.user.username,
                type: 'general'
            });
        }

        await application.save();

        // Send status update email to applicant
        await emailController.sendApplicationStatusUpdate({
            applicationId: application.applicationId,
            applicantName: application.fullName,
            position: application.position,
            oldStatus,
            newStatus: status,
            interviewDate: application.applicationStatus.interviewDate,
            rejectionReason: application.applicationStatus.rejectionReason,
            notes
        }, {
            name: application.fullName,
            email: application.personalInfo.email
        });

        res.json({
            success: true,
            message: 'Application status updated successfully',
            data: {
                applicationId: application.applicationId,
                status: application.applicationStatus.status
            }
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application status',
            error: error.message
        });
    }
});

// @route   POST /api/careers/applications/:id/notes
// @desc    Add note to application
// @access  Private
router.post('/applications/:id/notes', auth, async (req, res) => {
    try {
        const { note, type = 'general' } = req.body;

        const application = await JobApplication.findOne({ 
            applicationId: req.params.id 
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        application.notes.push({
            note,
            addedBy: req.user.username,
            type
        });

        await application.save();

        res.json({
            success: true,
            message: 'Note added successfully',
            data: application.notes[application.notes.length - 1]
        });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add note',
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
                responsibilities: [
                    'Transcribe legal audio recordings accurately',
                    'Ensure proper formatting and legal terminology',
                    'Meet strict deadlines for court proceedings',
                    'Maintain confidentiality of sensitive information'
                ],
                salary: '$18-28/hour',
                benefits: [
                    'Flexible working hours',
                    'Work from home',
                    'Performance bonuses',
                    'Professional development opportunities'
                ]
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
                responsibilities: [
                    'Transcribe medical dictations and reports',
                    'Ensure accuracy of medical terminology',
                    'Maintain patient confidentiality',
                    'Follow medical formatting standards'
                ],
                salary: '$20-30/hour',
                benefits: [
                    'Flexible scheduling',
                    'Remote work opportunity',
                    'Health insurance (full-time)',
                    'Continuing education support'
                ]
            },
            {
                id: 'general-transcriber',
                title: 'General Transcriber',
                department: 'Transcription',
                type: 'Part-time / Contract',
                location: 'Remote',
                description: 'Transcribe various types of audio content including business meetings and interviews.',
                requirements: [
                    'Excellent listening and typing skills',
                    'Typing speed of 60+ WPM with 95% accuracy',
                    'Attention to detail',
                    'Reliable internet connection'
                ],
                responsibilities: [
                    'Transcribe business meetings and interviews',
                    'Ensure accurate speaker identification',
                    'Meet project deadlines',
                    'Communicate with project managers'
                ],
                salary: '$15-22/hour',
                benefits: [
                    'Flexible hours',
                    'Work from anywhere',
                    'Weekly payments',
                    'Growth opportunities'
                ]
            },
            {
                id: 'qa-specialist',
                title: 'Quality Assurance Specialist',
                department: 'Quality Control',
                type: 'Full-time',
                location: 'Remote',
                description: 'Review and ensure quality of transcribed documents before delivery to clients.',
                requirements: [
                    '3+ years of transcription experience',
                    'Excellent proofreading skills',
                    'Knowledge of multiple transcription specialties',
                    'Leadership and training abilities'
                ],
                responsibilities: [
                    'Review transcribed documents for accuracy',
                    'Provide feedback to transcribers',
                    'Maintain quality standards',
                    'Train new team members'
                ],
                salary: '$25-35/hour',
                benefits: [
                    'Full benefits package',
                    'Paid time off',
                    'Professional development',
                    'Leadership opportunities'
                ]
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

// @route   GET /api/careers/stats
// @desc    Get career statistics (admin only)
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const totalApplications = await JobApplication.countDocuments();
        const pendingApplications = await JobApplication.countDocuments({ 
            'applicationStatus.status': 'submitted' 
        });
        const underReviewApplications = await JobApplication.countDocuments({ 
            'applicationStatus.status': 'under-review' 
        });
        const approvedApplications = await JobApplication.countDocuments({ 
            'applicationStatus.status': 'approved' 
        });
        const rejectedApplications = await JobApplication.countDocuments({ 
            'applicationStatus.status': 'rejected' 
        });

        // Applications by position
        const applicationsByPosition = await JobApplication.aggregate([
            {
                $group: {
                    _id: '$position',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Recent applications
        const recentApplications = await JobApplication.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('applicationId personalInfo.firstName personalInfo.lastName position applicationStatus.status createdAt');

        res.json({
            success: true,
            data: {
                totalApplications,
                pendingApplications,
                underReviewApplications,
                approvedApplications,
                rejectedApplications,
                applicationsByPosition,
                recentApplications
            }
        });
    } catch (error) {
        console.error('Error fetching career stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch career statistics',
            error: error.message
        });
    }
});

module.exports = router;