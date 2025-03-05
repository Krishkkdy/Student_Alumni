const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Information
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'alumni', 'admin'], 
        default: 'student' 
    },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Profile Information
    profile: {
        firstName: { type: String },
        lastName: { type: String },
        avatar: { type: String }, // URL to profile picture
        bio: { type: String },
        dateOfBirth: { type: Date },
        gender: { 
            type: String, 
            enum: ['male', 'female', 'other', 'prefer not to say'] 
        },
        contactNumber: { type: String },
        location: {
            city: String,
            state: String,
            country: String
        }
    },

    // Academic Information
    academic: {
        degree: String,
        major: String,
        graduationYear: Number,
        enrollmentYear: Number,
        university: String,
        studentId: String, // For current students
    },

    // Professional Information
    professional: {
        currentPosition: String,
        company: String,
        industry: String,
        experience: Number, // in years
        skills: [String],
        linkedinUrl: String,
        portfolioUrl: String
    },

    // Preferences
    preferences: {
        emailNotifications: {
            messages: { type: Boolean, default: true },
            events: { type: Boolean, default: true },
            jobs: { type: Boolean, default: true },
            mentorship: { type: Boolean, default: true }
        },
        profileVisibility: {
            email: { type: Boolean, default: false },
            phone: { type: Boolean, default: false },
            profile: { type: Boolean, default: true }
        }
    },

    // System Fields
    lastLogin: { type: Date },
    accountStatus: { 
        type: String, 
        enum: ['active', 'inactive', 'suspended'], 
        default: 'active' 
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Pre-save middleware to update the updated_at field
userSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

// Instance method to get full name
userSchema.methods.getFullName = function() {
    return `${this.profile.firstName} ${this.profile.lastName}`;
};

// Static method to find active users
userSchema.statics.findActive = function() {
    return this.find({ accountStatus: 'active' });
};

const User = mongoose.model('User', userSchema);

module.exports = User;