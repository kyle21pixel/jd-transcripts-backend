/**
 * Transcription Model
 * Defines the schema for transcription data
 */

const mongoose = require('mongoose');

const TranscriptionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  file: {
    originalName: String,
    fileName: String,
    fileSize: Number,
    duration: Number,
    mimeType: String,
    path: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'review', 'completed', 'cancelled'],
    default: 'pending'
  },
  content: {
    type: String
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1
  },
  metadata: {
    speakers: [{
      id: String,
      name: String
    }],
    language: String,
    audioQuality: String
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  startedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to update status with timeline entry
TranscriptionSchema.methods.updateStatus = function(status, userId, note = '') {
  this.status = status;
  
  // Add timeline entry
  this.timeline.push({
    status,
    timestamp: new Date(),
    note,
    user: userId
  });
  
  // Update timestamps based on status
  if (status === 'in_progress' && !this.startedAt) {
    this.startedAt = new Date();
  } else if (status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
};

module.exports = mongoose.model('Transcription', TranscriptionSchema);