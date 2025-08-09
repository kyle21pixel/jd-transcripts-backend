const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const transcriberSchema = new mongoose.Schema({
    transcriberID: {
        type: String,
        required: true,
        unique: true,
        default: () => 'T' + Date.now().toString().slice(-6)
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    specialization: {
        type: String,
        required: true,
        enum: ['Legal', 'Medical', 'Business', 'Academic', 'General']
    },
    experience: {
        type: String,
        required: true,
        enum: ['junior', 'intermediate', 'senior']
    },
    hourlyRate: {
        type: Number,
        required: true,
        min: 10,
        max: 100
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    availability: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
    },
    maxConcurrentOrders: {
        type: Number,
        default: 3,
        min: 1,
        max: 10
    },
    skills: [{
        type: String,
        enum: ['Verbatim Transcription', 'Clean Read', 'Time Coding', 'Speaker ID', 'Rush Orders', 'Multiple Speakers', 'Technical Terminology', 'Foreign Accents']
    }],
    languages: [{
        language: String,
        proficiency: { type: String, enum: ['basic', 'intermediate', 'fluent', 'native'] }
    }],
    certifications: [{
        name: String,
        issuer: String,
        dateObtained: Date,
        expiryDate: Date,
        verified: { type: Boolean, default: false }
    }],
    statistics: {
        totalOrders: { type: Number, default: 0 },
        completedOrders: { type: Number, default: 0 },
        cancelledOrders: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalRatings: { type: Number, default: 0 },
        averageTurnaround: { type: Number, default: 0 }, // in hours
        totalRevenue: { type: Number, default: 0 },
        onTimeDelivery: { type: Number, default: 100 }, // percentage
        qualityScore: { type: Number, default: 0, min: 0, max: 5 }
    },
    bankDetails: {
        accountName: String,
        accountNumber: String,
        bankName: String,
        routingNumber: String,
        paypalEmail: String
    },
    documents: [{
        type: String, // 'resume', 'certificate', 'id', 'contract'
        filename: String,
        originalName: String,
        uploadDate: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false }
    }],
    notes: [{
        note: String,
        addedBy: String,
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['general', 'performance', 'disciplinary', 'praise'] }
    }],
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    accountLocked: {
        type: Boolean,
        default: false
    },
    lockUntil: Date
}, {
    timestamps: true
});

// Hash password before saving
transcriberSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
transcriberSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Calculate current active orders
transcriberSchema.methods.getCurrentActiveOrders = async function() {
    const Order = mongoose.model('Order');
    return await Order.countDocuments({
        assignedTo: this._id,
        status: { $in: ['pending', 'in-progress'] }
    });
};

// Check if transcriber can take more orders
transcriberSchema.methods.canTakeMoreOrders = async function() {
    const activeOrders = await this.getCurrentActiveOrders();
    return activeOrders < this.maxConcurrentOrders && this.availability === 'available' && this.status === 'active';
};

// Update statistics
transcriberSchema.methods.updateStatistics = async function() {
    const Order = mongoose.model('Order');
    
    const stats = await Order.aggregate([
        { $match: { assignedTo: this._id } },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                completedOrders: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                averageRating: { $avg: '$qualityScore' },
                totalRatings: { $sum: { $cond: [{ $ne: ['$qualityScore', null] }, 1, 0] } },
                totalRevenue: { $sum: '$actualCost' }
            }
        }
    ]);

    if (stats.length > 0) {
        const stat = stats[0];
        this.statistics.totalOrders = stat.totalOrders;
        this.statistics.completedOrders = stat.completedOrders;
        this.statistics.cancelledOrders = stat.cancelledOrders;
        this.statistics.averageRating = stat.averageRating || 0;
        this.statistics.totalRatings = stat.totalRatings;
        this.statistics.totalRevenue = stat.totalRevenue || 0;
        this.statistics.onTimeDelivery = stat.completedOrders > 0 ? 
            ((stat.completedOrders / stat.totalOrders) * 100) : 100;
    }

    await this.save();
};

// Virtual for active orders count
transcriberSchema.virtual('activeOrdersCount').get(async function() {
    return await this.getCurrentActiveOrders();
});

module.exports = mongoose.model('Transcriber', transcriberSchema);