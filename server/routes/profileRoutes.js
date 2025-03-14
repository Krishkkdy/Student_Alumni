const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getProfile, postProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = {
  resumes: 'uploads/resumes/',
  profileImages: 'uploads/profileImages/',
  coverImages: 'uploads/coverImages/'
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    if (file.fieldname === 'resume') {
      uploadPath = uploadDirs.resumes;
    } else if (file.fieldname === 'profileImage') {
      uploadPath = uploadDirs.profileImages;
    } else if (file.fieldname === 'coverImage') {
      uploadPath = uploadDirs.coverImages;
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// @route   GET /api/profile/:userId
// @desc    Get user profile
// @access  Private
router.get('/:userId', auth, getProfile);

// @route   POST /api/profile/:userId
// @desc    Create or update user profile
// @access  Private
router.post('/:userId', auth, postProfile);

// @route   PUT /api/profile/:userId
// @desc    Update user profile
// @access  Private
router.put('/:userId', auth, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), updateProfile);

// @route   DELETE /api/profile/:userId
// @desc    Delete user profile
// @access  Private
router.delete('/:userId', auth, deleteProfile);

module.exports = router;