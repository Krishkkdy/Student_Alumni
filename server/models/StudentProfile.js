const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
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
  // Student-specific fields
  enrollmentYear: {
    type: String,
    default: ''
  },
  expectedGraduationYear: {
    type: String,
    default: ''
  },
  major: {
    type: String,
    default: ''
  },
  minor: {
    type: String,
    default: ''
  },
  currentSemester: {
    type: Number,
    default: 1
  },
  studentId: {
    type: String,
    default: ''
  },
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
    type: String, // Stores the URL of the uploaded PDF file
  },
  linkedinProfile: {
    type: String,
    default: ''
  },
  // Academic achievements
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  // Projects
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema); 