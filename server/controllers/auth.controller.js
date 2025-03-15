const Auth = require("../models/authSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");  // Keep for backward compatibility
const StudentProfile = require("../models/StudentProfile");
const AlumniProfile = require("../models/AlumniProfile");

exports.signup = async (req, res) => {
    try {
        const { username, email, password, role = 'student', graduationYear } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Auth.create({
            username,
            email,
            password_hash: hashedPassword,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Create profile based on role
        let profileData;
        
        if (role === 'alumni') {
            profileData = await AlumniProfile.create({
                user: newUser._id,
                username,
                email,
                fullName: username,
                graduationYear: graduationYear || new Date().getFullYear().toString() // Use provided value or current year
            });
        } else {
            // Default to student profile
            profileData = await StudentProfile.create({
                user: newUser._id,
                username,
                email,
                fullName: username
            });
        }

        // For backward compatibility, also create a general profile
        await Profile.create({
            user: newUser._id,
            username,
            email,
            role,
        });

        const userData = {
            name: newUser.username,
            email: newUser.email,
            role: role,
            created_at: newUser.created_at
        };

        res.status(201).json({ 
            message: "✅ User registered successfully!", 
            user: userData 
        });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.createProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const { role = 'student', graduationYear } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required in params" });
        }

        const user_details = await Auth.findById(id);
        if (!user_details) {
            return res.status(404).json({ message: "User not found in database" });
        }

        // Check if profiles already exist
        const existingGeneralProfile = await Profile.findOne({ user: id });
        const existingStudentProfile = await StudentProfile.findOne({ user: id });
        const existingAlumniProfile = await AlumniProfile.findOne({ user: id });

        if (existingGeneralProfile || existingStudentProfile || existingAlumniProfile) {
            return res.status(400).json({ message: "Profile already exists for this user" });
        }

        // Create profile based on role
        let profileData;
        
        // Create role-specific profile
        if (role === 'alumni') {
            profileData = await AlumniProfile.create({
                user: user_details._id,
                username: user_details.username,
                email: user_details.email,
                fullName: user_details.username,
                graduationYear: graduationYear || new Date().getFullYear().toString() // Use provided value or current year
            });
        } else {
            // Default to student profile
            profileData = await StudentProfile.create({
                user: user_details._id,
                username: user_details.username,
                email: user_details.email,
                fullName: user_details.username
            });
        }

        // For backward compatibility, also create a general profile
        await Profile.create({
            username: user_details.username,
            email: user_details.email,
            fullName: user_details.username,
            role: role,
            user: user_details._id
        });

        res.status(201).json({
            message: "✅ User Profile created successfully!",
            id: profileData._id
        });

    } catch (error) {
        console.error("❌ Error creating user profile:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.login = async (req, res) => {
    const JWT_SECRET = "harshhhh" // Note: In production, use environment variables for secrets
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check for admin email
        if (email === 'admin@example.com') {
            const role = 'admin';
            
            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email, role }, 
                JWT_SECRET, 
                { expiresIn: "1h" }
            );

            // Update last login
            user.updated_at = new Date();
            await user.save();

            // Prepare user data without sensitive information
            const userData = {
                name: user.username,
                email: user.email,
                role: role,
                created_at: user.created_at
            };

            // Return both token and user data
            return res.status(200).json({
                message: "✅ Login successful",
                token,
                user: userData
            });
        }

        // Check for role in specific profile collections
        let role = 'student'; // Default role
        let profileData = null;

        // Check if user has an alumni profile
        const alumniProfile = await AlumniProfile.findOne({ user: user._id });
        if (alumniProfile) {
            role = 'alumni';
            profileData = alumniProfile;
        } else {
            // Check if user has a student profile
            const studentProfile = await StudentProfile.findOne({ user: user._id });
            if (studentProfile) {
                role = 'student';
                profileData = studentProfile;
            } else {
                // Fallback to general profile for backward compatibility
                const generalProfile = await Profile.findOne({ user: user._id });
                if (generalProfile) {
                    role = generalProfile.role || 'student';
                }
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Update last login
        user.updated_at = new Date();
        await user.save();

        // Prepare user data without sensitive information
        const userData = {
            name: user.username,
            email: user.email,
            role: role,
            created_at: user.created_at,
            profileId: profileData ? profileData._id : null
        };

        // Return both token and user data
        res.status(200).json({
            message: "✅ Login successful",
            token,
            user: userData
        });
    } catch (error) {
        console.error("❌ Error logging in:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}