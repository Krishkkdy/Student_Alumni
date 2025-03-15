const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true,
    default: function () {
      return this.username;
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Alumni-specific fields
  graduationYear: {
    type: String,
    required: true,
    default: ''
  },
  degree: {
    type: String,
    default: ''
  },
  major: {
    type: String,
    default: ''
  },
  currentPosition: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  industry: {
    type: String,
    default: ''
  },
  workExperience: [{
    title: String,
    company: String,
    location: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  // Mentorship preferences
  mentorshipAvailability: {
    type: Boolean,
    default: false
  },
  mentorshipAreas: [{
    type: String
  }],
  // Common fields
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  profileImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  resume: {
    type: String
  },
  linkedinProfile: {
    type: String,
    default: ''
  },
  // Contact preferences
  contactPreferences: {
    allowDirectMessage: {
      type: Boolean,
      default: true
    },
    allowEmailContact: {
      type: Boolean,
      default: false
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'platform', 'linkedin'],
      default: 'platform'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema); 