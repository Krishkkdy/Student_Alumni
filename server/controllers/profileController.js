const Profile = require('../models/Profile');
const StudentProfile = require('../models/StudentProfile');
const AlumniProfile = require('../models/AlumniProfile');

// Get profile
const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Try to find profile in all collections
    const generalProfile = await Profile.findOne({ email: userId });
    const studentProfile = await StudentProfile.findOne({ email: userId });
    const alumniProfile = await AlumniProfile.findOne({ email: userId });
    
    // Determine which profile to return based on availability and role
    let profile = null;
    
    if (generalProfile && generalProfile.role === 'alumni' && alumniProfile) {
      profile = alumniProfile;
    } else if (generalProfile && generalProfile.role === 'student' && studentProfile) {
      profile = studentProfile;
    } else if (alumniProfile) {
      profile = alumniProfile;
    } else if (studentProfile) {
      profile = studentProfile;
    } else if (generalProfile) {
      profile = generalProfile;
    }
    
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
    const { role = 'student', _id } = req.body;
    
    // Check if profile already exists in any collection
    const existingGeneralProfile = _id ? await Profile.findOne({ _id }) : null;
    const existingStudentProfile = await StudentProfile.findOne({ email: req.body.email });
    const existingAlumniProfile = await AlumniProfile.findOne({ email: req.body.email });
    
    if (existingGeneralProfile || existingStudentProfile || existingAlumniProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }
    
    let savedProfile;
    
    // Create profile based on role
    if (role === 'alumni') {
      // Create alumni profile
      const newAlumniProfile = new AlumniProfile({
        user: req.body.user_id,
        username: req.body.username,
        fullName: req.body.fullName,
        email: req.body.email,
        graduationYear: req.body.graduationYear || '',
        degree: req.body.degree || '',
        major: req.body.major || '',
        currentPosition: req.body.currentPosition || '',
        company: req.body.company || '',
        industry: req.body.industry || '',
        linkedinProfile: req.body.linkedinProfile || '',
        bio: req.body.bio || '',
        skills: req.body.skills || [],
        interests: req.body.interests || []
      });
      
      savedProfile = await newAlumniProfile.save();
    } else {
      // Create student profile
      const newStudentProfile = new StudentProfile({
        user: req.body.user_id,
        username: req.body.username,
        fullName: req.body.fullName,
        email: req.body.email,
        enrollmentYear: req.body.enrollmentYear || '',
        expectedGraduationYear: req.body.expectedGraduationYear || '',
        major: req.body.major || '',
        minor: req.body.minor || '',
        currentSemester: req.body.currentSemester || 1,
        studentId: req.body.studentId || '',
        linkedinProfile: req.body.linkedinProfile || '',
        bio: req.body.bio || '',
        skills: req.body.skills || [],
        interests: req.body.interests || []
      });
      
      savedProfile = await newStudentProfile.save();
    }
    
    // Also create/update general profile for backward compatibility
    const newGeneralProfile = new Profile({
      user: req.body.user_id,
      username: req.body.username,
      fullName: req.body.fullName,
      email: req.body.email,
      role: role,
      graduationYear: req.body.graduationYear || '',
      currentPosition: req.body.currentPosition || '',
      company: req.body.company || '',
      linkedinProfile: req.body.linkedinProfile || '',
      bio: req.body.bio || '',
      skills: req.body.skills || [],
      interests: req.body.interests || []
    });
    
    await newGeneralProfile.save();
    
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find the general profile to determine role
    const generalProfile = await Profile.findOne({ email: userId });
    
    if (!generalProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    const role = generalProfile.role || 'student';
    let profile;
    
    // Find the specific profile based on role
    if (role === 'alumni') {
      profile = await AlumniProfile.findOne({ email: userId });
      if (!profile) {
        // If alumni profile doesn't exist yet, create it from general profile
        profile = new AlumniProfile({
          user: generalProfile.user,
          username: generalProfile.username,
          fullName: generalProfile.fullName,
          email: generalProfile.email,
          // Copy other relevant fields
        });
      }
    } else {
      profile = await StudentProfile.findOne({ email: userId });
      if (!profile) {
        // If student profile doesn't exist yet, create it from general profile
        profile = new StudentProfile({
          user: generalProfile.user,
          username: generalProfile.username,
          fullName: generalProfile.fullName,
          email: generalProfile.email,
          // Copy other relevant fields
        });
      }
    }
    
    // Update common fields for both profile types
    profile.username = req.body.username || profile.username;
    profile.fullName = req.body.fullName || profile.fullName;
    profile.email = req.body.email || profile.email;
    profile.bio = req.body.bio || profile.bio;
    profile.skills = req.body.skills || profile.skills;
    profile.interests = req.body.interests || profile.interests;
    profile.linkedinProfile = req.body.linkedinProfile || profile.linkedinProfile;
    
    // Update role-specific fields
    if (role === 'alumni') {
      profile.graduationYear = req.body.graduationYear || profile.graduationYear;
      profile.currentPosition = req.body.currentPosition || profile.currentPosition;
      profile.company = req.body.company || profile.company;
      profile.industry = req.body.industry || profile.industry;
      profile.degree = req.body.degree || profile.degree;
      profile.major = req.body.major || profile.major;
      // Update other alumni-specific fields
    } else {
      profile.enrollmentYear = req.body.enrollmentYear || profile.enrollmentYear;
      profile.expectedGraduationYear = req.body.expectedGraduationYear || profile.expectedGraduationYear;
      profile.major = req.body.major || profile.major;
      profile.minor = req.body.minor || profile.minor;
      profile.currentSemester = req.body.currentSemester || profile.currentSemester;
      profile.studentId = req.body.studentId || profile.studentId;
      // Update other student-specific fields
    }
    
    // Handle file uploads
    if (req.files) {
      if (req.files.resume) {
        profile.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
      if (req.files.profileImage) {
        profile.profileImage = `/uploads/profileImages/${req.files.profileImage[0].filename}`;
      }
      if (req.files.coverImage) {
        profile.coverImage = `/uploads/coverImages/${req.files.coverImage[0].filename}`;
      }
    }
    
    // Save the updated profile
    const updatedProfile = await profile.save();
    
    // Also update the general profile for backward compatibility
    generalProfile.username = req.body.username || generalProfile.username;
    generalProfile.fullName = req.body.fullName || generalProfile.fullName;
    generalProfile.email = req.body.email || generalProfile.email;
    generalProfile.bio = req.body.bio || generalProfile.bio;
    generalProfile.skills = req.body.skills || generalProfile.skills;
    generalProfile.interests = req.body.interests || generalProfile.interests;
    generalProfile.linkedinProfile = req.body.linkedinProfile || generalProfile.linkedinProfile;
    
    if (role === 'alumni') {
      generalProfile.graduationYear = req.body.graduationYear || generalProfile.graduationYear;
      generalProfile.currentPosition = req.body.currentPosition || generalProfile.currentPosition;
      generalProfile.company = req.body.company || generalProfile.company;
    }
    
    // Handle file uploads for general profile
    if (req.files) {
      if (req.files.resume) {
        generalProfile.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
      if (req.files.profileImage) {
        generalProfile.profileImage = `/uploads/profileImages/${req.files.profileImage[0].filename}`;
      }
      if (req.files.coverImage) {
        generalProfile.coverImage = `/uploads/coverImages/${req.files.coverImage[0].filename}`;
      }
    }
    
    await generalProfile.save();
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    
    // Try to find and delete profile in all collections
    const generalProfile = await Profile.findById(profileId);
    const studentProfile = await StudentProfile.findById(profileId);
    const alumniProfile = await AlumniProfile.findById(profileId);
    
    let deleted = false;
    
    if (generalProfile) {
      await generalProfile.deleteOne();
      deleted = true;
    }
    
    if (studentProfile) {
      await studentProfile.deleteOne();
      deleted = true;
    }
    
    if (alumniProfile) {
      await alumniProfile.deleteOne();
      deleted = true;
    }
    
    if (!deleted) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
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