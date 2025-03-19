const StudentProfile = require('../models/StudentProfile');
const mongoose = require('mongoose');

exports.getAllprofile = async (req, res) => {
    try {
        // Fetch all student profiles from the database, including the 'username', 'bio', and 'skills' fields
        const studentProfiles = await StudentProfile.find({}, '_id username bio skills interests');

        // Map the profiles to include username, bio, and skills
        const studentData = studentProfiles.map(profile => ({
            _id: profile._id,
            username: profile.username,
            bio: profile.bio,
            skills: profile.skills || [],
            interests: profile.interests || [], // Default to an empty array if skills are missing
        }));

        // Send the response with the student data
        res.status(200).json({ success: true, data: studentData });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ success: false, message: 'Error fetching student profiles', error: error.message });
    }
};