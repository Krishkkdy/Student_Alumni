const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('No token provided'); // Debugging
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debugging

        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('User not found for token:', decoded.id); // Debugging
            return res.status(401).json({ message: 'Invalid token, user not found' });
        }

        console.log('User found:', user); // Debugging
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error); // Debugging
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;