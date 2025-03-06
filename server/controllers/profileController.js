const Profile = require('../models/Profile');

// Get profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or update profile
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      graduationYear,
      currentPosition,
      company,
      linkedinProfile,
      bio,
      skills,
      interests
    } = req.body;

    // Build profile object
    const profileFields = {
      user: req.params.userId,
      fullName,
      email,
      graduationYear,
      currentPosition,
      company,
      linkedinProfile,
      bio,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
      interests: Array.isArray(interests) ? interests : interests.split(',').map(interest => interest.trim())
    };

    let profile = await Profile.findOne({ user: req.params.userId });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.params.userId },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Create
      profile = new Profile(profileFields);
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
}; 