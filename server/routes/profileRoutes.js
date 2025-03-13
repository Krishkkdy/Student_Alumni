const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getProfile, postProfile,updateProfile,deleteProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// @route   GET /api/profile/:userId
// @desc    Get user profile
// @access  Private

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
const upload = multer({ storage });

router.get('/:userId', auth, getProfile);

// @route   PUT /api/profile/:userId
// @desc    Create or update user profile
// @access  Private
router.post('/:userId', auth, postProfile);

router.put('/:userId', auth, upload.single('resume'), updateProfile);

router.delete('/:userId',auth,deleteProfile);

module.exports = router; 