const StudentProfile = require('../models/StudentProfile');
const mongoose = require('mongoose');

exports.getAllprofile = async (req, res) => {
    try {
        // Fetch all student profiles from the database, including the 'username' and 'bio' fields
        const studentProfiles = await StudentProfile.find({}, 'username bio');

        // Map the profiles to include both username and bio
        const studentData = studentProfiles.map(profile => ({
            username: profile.username,
            bio: profile.bio,
        }));

        // Send the response with the student data
        res.status(200).json({ success: true, data: studentData });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ success: false, message: 'Error fetching student profiles', error: error.message });
    }
};