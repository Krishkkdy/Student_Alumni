const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// @route   GET /api/profile/:userId
// @desc    Get user profile
// @access  Private
router.get('/:userId', auth, getProfile);

// @route   PUT /api/profile/:userId
// @desc    Create or update user profile
// @access  Private
router.put('/:userId', auth, updateProfile);

module.exports = router; 