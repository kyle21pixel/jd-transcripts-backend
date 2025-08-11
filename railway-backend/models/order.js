const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => 'ORD-' + Date.now()
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    clientPhone: {
        type: String,
        trim: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['Legal Transcription', 'Medical Transcription', 'Business Meetings', 'Academic & Research']
    },
    turnaround: {
        type: String,
        required: true
    },
    estimatedCost: {
        type: String,
        required: true
    },
    actualCost: {
        type: Number,
        default: 0
    },
    instructions: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled', 'revision-requested'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['normal', 'high', 'urgent'],
        default: 'normal'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transcriber',
        default: null
    },
    assignedTranscriberName: {
        type: String,
        default: null
    },
    audioFiles: [{
        filename: String,
        originalName: String,
        size: Number,
        uploadDate: { type: Date, default: Date.now },
        s3Key: String,
        s3Url: String
    }],
    transcriptFiles: [{
        filename: String,
        originalName: String,
        size: Number,
        uploadDate: { type: Date, default: Date.now },
        s3Key: String,
        s3Url: String
    }],
    paymentIntentId: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        required: true
    },
    completedDate: {
        type: Date,
        default: null
    },
    qualityScore: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    clientFeedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now }
    },
    revisionRequests: [{
        reason: String,
        requestDate: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false },
        resolvedDate: Date
    }],
    timeline: [{
        action: String,
        timestamp: { type: Date, default: Date.now },
        performedBy: String,
        notes: String
    }]
}, {
    timestamps: true
});

// Add timeline entry before saving
orderSchema.pre('save', function(next) {
    if (this.isNew) {
        this.timeline.push({
            action: 'Order Created',
            performedBy: 'System',
            notes: `Order created by ${this.clientName}`
        });
    }
    next();
});

// Calculate estimated duration based on service type
orderSchema.methods.calculateEstimatedDuration = function() {
    const baseDurations = {
        'Legal Transcription': 24,
        'Medical Transcription': 48,
        'Business Meetings': 24,
        'Academic & Research': 72
    };
    
    return baseDurations[this.serviceType] || 24;
};

// Check if order is overdue
orderSchema.methods.isOverdue = function() {
    return this.status !== 'completed' && new Date() > this.dueDate;
};

module.exports = mongoose.model('Order', orderSchema);