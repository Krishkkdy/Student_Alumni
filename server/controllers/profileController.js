const Profile = require('../models/Profile');

// Get profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.userId });
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
const postProfile = async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ _id: req.body._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }
    
    // Create new profile
    const newProfile = new Profile({
      user_id: req.body.user_id,
      username: req.body.username,
      fullName: req.body.fullName,
      email: req.body.email,
      graduationYear: req.body.graduationYear || '',
      currentPosition: req.body.currentPosition || '',
      company: req.body.company || '',
      linkedinProfile: req.body.linkedinProfile || '',
      bio: req.body.bio || '',
      skills: req.body.skills || [],
      interests: req.body.interests || []
    });
    
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ email: req.params.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Parse skills and interests from form data
    let skills = [];
    let interests = [];
    
    try {
      if (req.body.skills) {
        skills = JSON.parse(req.body.skills);
        if (!Array.isArray(skills)) {
          skills = [];
        }
      }
      if (req.body.interests) {
        interests = JSON.parse(req.body.interests);
        if (!Array.isArray(interests)) {
          interests = [];
        }
      }
    } catch (e) {
      console.error('Error parsing skills/interests:', e);
    }

    // Update profile fields
    profile.username = req.body.username || profile.username;
    profile.fullName = req.body.fullName || profile.fullName;
    profile.email = req.body.email || profile.email;
    profile.graduationYear = req.body.graduationYear || profile.graduationYear;
    profile.currentPosition = req.body.currentPosition || profile.currentPosition;
    profile.company = req.body.company || profile.company;
    profile.linkedinProfile = req.body.linkedinProfile || profile.linkedinProfile;
    profile.bio = req.body.bio || profile.bio;
    profile.skills = skills;
    profile.interests = interests;

    // Handle resume
    if (req.body.removeResume === 'true') {
      // If resume removal is requested
      const fs = require('fs');
      const path = require('path');
      
      // Delete the file if it exists
      if (profile.resume) {
        const resumePath = path.join(__dirname, '..', profile.resume);
        try {
          if (fs.existsSync(resumePath)) {
            fs.unlinkSync(resumePath);
          }
        } catch (err) {
          console.error('Error deleting resume file:', err);
        }
      }
      profile.resume = '';
    } else if (req.file) {
      // If a new resume is uploaded
      // Delete old resume file if it exists
      if (profile.resume) {
        const fs = require('fs');
        const path = require('path');
        const oldResumePath = path.join(__dirname, '..', profile.resume);
        try {
          if (fs.existsSync(oldResumePath)) {
            fs.unlinkSync(oldResumePath);
          }
        } catch (err) {
          console.error('Error deleting old resume file:', err);
        }
      }
      profile.resume = `/uploads/resumes/${req.file.filename}`;
    }

    // Handle profile and cover images
    if (req.body.profileImage && typeof req.body.profileImage === 'object') {
      profile.profileImage = {
        url: req.body.profileImage.url || profile.profileImage.url,
        publicId: req.body.profileImage.publicId || profile.profileImage.publicId,
      };
    }

    if (req.body.coverImage && typeof req.body.coverImage === 'object') {
      profile.coverImage = {
        url: req.body.coverImage.url || profile.coverImage.url,
        publicId: req.body.coverImage.publicId || profile.coverImage.publicId,
      };
    }

    // Save the updated profile
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    await profile.deleteOne();
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  postProfile,
  updateProfile,
  deleteProfile,
}; 