/**
 * Transcription Routes
 * Handles transcription-related API endpoints
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, isAdmin, isTranscriber } = require('../middleware/auth');
const Transcription = require('../models/Transcription');
const Order = require('../models/Order');
const transcriptionService = require('../services/transcriptionService');
const config = require('../config');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(config.uploads.storageDir)) {
      fs.mkdirSync(config.uploads.storageDir, { recursive: true });
    }
    cb(null, config.uploads.storageDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `audio-${uniqueSuffix}${ext}`);
  }
});

// File filter to only allow audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.uploads.allowedFileTypes;
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.uploads.maxFileSize }
});

/**
 * @route   POST /api/transcriptions/upload
 * @desc    Upload audio file for transcription
 * @access  Private
 */
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get file info
    const fileInfo = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      path: req.file.path
    };

    // Return file info to be used when creating an order
    res.json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Server error uploading file' });
  }
});

/**
 * @route   POST /api/transcriptions/process/:id
 * @desc    Process transcription for an order
 * @access  Private (admin or transcriber)
 */
router.post('/process/:id', authenticate, isTranscriber, async (req, res) => {
  try {
    const transcription = await Transcription.findById(req.params.id);
    
    if (!transcription) {
      return res.status(404).json({ message: 'Transcription not found' });
    }
    
    // Check if already being processed
    if (transcription.status !== 'pending' && transcription.status !== 'assigned') {
      return res.status(400).json({ message: `Transcription is already ${transcription.status}` });
    }
    
    // Update status to in_progress
    transcription.updateStatus('in_progress', req.user.id, 'Processing started');
    transcription.assignedTo = req.user.id;
    await transcription.save();
    
    // In a real application, we would submit to the transcription service here
    // For demo purposes, we'll use the mock service
    const mockResult = transcriptionService.mockTranscription(transcription.file);
    
    // Update transcription with mock result
    transcription.content = mockResult.text;
    transcription.confidenceScore = mockResult.confidence;
    transcription.metadata = {
      speakers: mockResult.speakers,
      language: 'en',
      audioQuality: 'good'
    };
    
    // Update status to completed
    transcription.updateStatus('completed', req.user.id, 'Processing completed');
    await transcription.save();
    
    // Check if all transcriptions for this order are complete
    const order = await Order.findById(transcription.order);
    const allTranscriptions = await Transcription.find({ order: order._id });
    const allCompleted = allTranscriptions.every(t => t.status === 'completed');
    
    // If all complete, update order status
    if (allCompleted) {
      order.status = 'completed';
      await order.save();
    }
    
    res.json({
      message: 'Transcription processed successfully',
      transcription: {
        id: transcription._id,
        status: transcription.status,
        completedAt: transcription.completedAt
      }
    });
  } catch (error) {
    console.error('Process transcription error:', error);
    res.status(500).json({ message: 'Server error processing transcription' });
  }
});

/**
 * @route   GET /api/transcriptions/assigned
 * @desc    Get transcriptions assigned to current user
 * @access  Private (transcriber)
 */
router.get('/assigned', authenticate, isTranscriber, async (req, res) => {
  try {
    const transcriptions = await Transcription.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber serviceType');
    
    res.json({ transcriptions });
  } catch (error) {
    console.error('Get assigned transcriptions error:', error);
    res.status(500).json({ message: 'Server error retrieving transcriptions' });
  }
});

/**
 * @route   GET /api/transcriptions/:id
 * @desc    Get transcription by ID
 * @access  Private (admin or assigned transcriber)
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const transcription = await Transcription.findById(req.params.id)
      .populate('order', 'orderNumber serviceType user')
      .populate('assignedTo', 'username');
    
    if (!transcription) {
      return res.status(404).json({ message: 'Transcription not found' });
    }
    
    // Check if user is admin, assigned transcriber, or order owner
    const isAdmin = req.user.role === 'admin';
    const isAssigned = transcription.assignedTo && 
                      transcription.assignedTo._id.toString() === req.user.id;
    const isOrderOwner = transcription.order.user.toString() === req.user.id;
    
    if (!isAdmin && !isAssigned && !isOrderOwner) {
      return res.status(403).json({ message: 'Not authorized to view this transcription' });
    }
    
    res.json({ transcription });
  } catch (error) {
    console.error('Get transcription error:', error);
    res.status(500).json({ message: 'Server error retrieving transcription' });
  }
});

module.exports = router;