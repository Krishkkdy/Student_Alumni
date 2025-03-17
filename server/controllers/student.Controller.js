const StudentProfile = require('../models/StudentProfile');
const mongoose = require('mongoose');

exports.getAllprofile = async (req,res) => {
    try {
        // Fetch all alumni profiles from the database
        const studentProfiles = await StudentProfile.find({}, 'username'); // Only fetch the 'name' field

        // Extract the names from the profiles
        const studentNames = studentProfiles.map(profile => profile.username);

        // Send the response with the alumni names
        res.status(200).json({ success: true, data: studentNames });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ success: false, message: 'Error fetching students profiles', error: error.message });
    }
};