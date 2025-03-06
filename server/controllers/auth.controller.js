const Auth = require("../models/authSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const profile = require("../models/Profile");

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
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

        const profiledata = await profile.create({
            user : newUser._id,
            username,
            email,
        })

        // Return user data without sensitive information
        const userData = {
            name: newUser.username,
            email: newUser.email,
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

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // Prepare user data without sensitive information
        const userData = {
            name: user.username,
            email: user.email,
            role: 'student', // You can add role management later
            created_at: user.created_at
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