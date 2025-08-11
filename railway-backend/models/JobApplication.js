const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true,
        default: () => 'APP-' + Date.now()
    },
    position: {
        type: String,
        required: true,
        enum: [
            'Legal Transcriber',
            'Medical Transcriber', 
            'Business Transcriber',
            'Academic Transcriber',
            'General Transcriber',
            'Senior Transcriber',
            'Quality Assurance Specialist',
            'Project Manager',
            'Customer Service Representative'
        ]
    },
    personalInfo: {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: { type: String, default: 'United States' }
        },
        dateOfBirth: Date,
        linkedIn: String,
        website: String
    },
    experience: {
        yearsOfExperience: {
            type: Number,
            required: true,
            min: 0,
            max: 50
        },
        transcriptionExperience: {
            type: Number,
            required: true,
            min: 0,
            max: 50
        },
        previousEmployers: [{
            company: String,
            position: String,
            startDate: Date,
            endDate: Date,
            responsibilities: String,
            reasonForLeaving: String
        }],
        relevantExperience: String,
        typingSpeed: {
            wpm: { type: Number, min: 30, max: 200 },
            accuracy: { type: Number, min: 80, max: 100 }
        }
    },
    skills: {
        specializations: [{
            type: String,
            enum: ['Legal', 'Medical', 'Business', 'Academic', 'Technical', 'General']
        }],
        transcriptionTypes: [{
            type: String,
            enum: ['Verbatim', 'Clean Read', 'Time Coded', 'Speaker Identification', 'Rush Orders']
        }],
        software: [{
            name: String,
            proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
        }],
        languages: [{
            language: String,
            proficiency: { type: String, enum: ['basic', 'intermediate', 'fluent', 'native'] }
        }],
        certifications: [{
            name: String,
            issuer: String,
            dateObtained: Date,
            expiryDate: Date
        }]
    },
    availability: {
        workType: {
            type: String,
            required: true,
            enum: ['full-time', 'part-time', 'contract', 'freelance']
        },
        hoursPerWeek: {
            type: Number,
            min: 5,
            max: 60
        },
        preferredSchedule: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night', 'flexible']
        },
        timeZone: String,
        startDate: Date,
        canWorkWeekends: { type: Boolean, default: false },
        canWorkHolidays: { type: Boolean, default: false }
    },
    compensation: {
        expectedHourlyRate: {
            type: Number,
            min: 10,
            max: 100
        },
        paymentPreference: {
            type: String,
            enum: ['hourly', 'per-audio-minute', 'per-page', 'project-based']
        },
        negotiable: { type: Boolean, default: true }
    },
    equipment: {
        hasComputer: { type: Boolean, required: true },
        computerSpecs: String,
        hasHeadphones: { type: Boolean, required: true },
        headphoneType: String,
        hasReliableInternet: { type: Boolean, required: true },
        internetSpeed: String,
        hasQuietWorkspace: { type: Boolean, required: true },
        additionalEquipment: String
    },
    documents: [{
        type: {
            type: String,
            enum: ['resume', 'cover-letter', 'portfolio', 'certificate', 'transcript', 'reference', 'other']
        },
        filename: String,
        originalName: String,
        size: Number,
        uploadDate: { type: Date, default: Date.now }
    }],
    testResults: {
        transcriptionTest: {
            completed: { type: Boolean, default: false },
            score: { type: Number, min: 0, max: 100 },
            accuracy: { type: Number, min: 0, max: 100 },
            speed: { type: Number, min: 0, max: 200 },
            completedDate: Date,
            feedback: String
        },
        typingTest: {
            completed: { type: Boolean, default: false },
            wpm: { type: Number, min: 0, max: 200 },
            accuracy: { type: Number, min: 0, max: 100 },
            completedDate: Date
        }
    },
    references: [{
        name: String,
        relationship: String,
        company: String,
        phone: String,
        email: String,
        contacted: { type: Boolean, default: false },
        feedback: String
    }],
    applicationStatus: {
        status: {
            type: String,
            enum: ['submitted', 'under-review', 'test-sent', 'test-completed', 'interview-scheduled', 'interviewed', 'reference-check', 'approved', 'rejected', 'withdrawn'],
            default: 'submitted'
        },
        statusHistory: [{
            status: String,
            date: { type: Date, default: Date.now },
            updatedBy: String,
            notes: String
        }],
        rejectionReason: String,
        interviewDate: Date,
        interviewNotes: String,
        finalDecision: String,
        decisionDate: Date
    },
    questionnaire: {
        whyInterested: String,
        strengths: String,
        challenges: String,
        workFromHome: String,
        deadlinePressure: String,
        additionalInfo: String
    },
    source: {
        type: String,
        enum: ['website', 'job-board', 'referral', 'social-media', 'other'],
        default: 'website'
    },
    notes: [{
        note: String,
        addedBy: String,
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['general', 'interview', 'test', 'reference'] }
    }]
}, {
    timestamps: true
});

// Add status history entry before saving
jobApplicationSchema.pre('save', function(next) {
    if (this.isModified('applicationStatus.status') && !this.isNew) {
        this.applicationStatus.statusHistory.push({
            status: this.applicationStatus.status,
            updatedBy: 'System',
            notes: `Status changed to ${this.applicationStatus.status}`
        });
    }
    next();
});

// Virtual for full name
jobApplicationSchema.virtual('fullName').get(function() {
    return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Method to calculate application score
jobApplicationSchema.methods.calculateScore = function() {
    let score = 0;
    
    // Experience scoring (0-30 points)
    score += Math.min(this.experience.transcriptionExperience * 3, 30);
    
    // Skills scoring (0-25 points)
    score += this.skills.specializations.length * 3;
    score += this.skills.transcriptionTypes.length * 2;
    score += this.skills.certifications.length * 5;
    
    // Equipment scoring (0-20 points)
    if (this.equipment.hasComputer) score += 5;
    if (this.equipment.hasHeadphones) score += 5;
    if (this.equipment.hasReliableInternet) score += 5;
    if (this.equipment.hasQuietWorkspace) score += 5;
    
    // Test results scoring (0-25 points)
    if (this.testResults.transcriptionTest.completed) {
        score += (this.testResults.transcriptionTest.score / 100) * 15;
        score += (this.testResults.transcriptionTest.accuracy / 100) * 10;
    }
    
    return Math.min(score, 100);
};

// Method to check if application is complete
jobApplicationSchema.methods.isComplete = function() {
    return !!(
        this.personalInfo.firstName &&
        this.personalInfo.lastName &&
        this.personalInfo.email &&
        this.personalInfo.phone &&
        this.experience.yearsOfExperience !== undefined &&
        this.experience.transcriptionExperience !== undefined &&
        this.skills.specializations.length > 0 &&
        this.availability.workType &&
        this.equipment.hasComputer !== undefined &&
        this.equipment.hasHeadphones !== undefined &&
        this.equipment.hasReliableInternet !== undefined &&
        this.equipment.hasQuietWorkspace !== undefined
    );
};

module.exports = mongoose.model('JobApplication', jobApplicationSchema);