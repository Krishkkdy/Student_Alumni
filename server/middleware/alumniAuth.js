const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const alumniAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'harshhhh');
        
        // Get user from database
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if user is an alumni
        if (user.role !== 'alumni') {
            return res.status(403).json({ message: 'Access denied. Alumni privileges required.' });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Token is invalid' });
    }
};

module.exports = alumniAuth; 