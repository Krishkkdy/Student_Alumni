const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  graduationYear: {
    type: String,
    required: true
  },
  currentPosition: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  linkedinProfile: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema); 