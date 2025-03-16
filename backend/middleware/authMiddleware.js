const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify token
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ msg: 'Access denied. No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

// Middleware to restrict access based on role
const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Forbidden: You do not have access to this resource' });
    }
    next();
};

module.exports = { authenticateUser, authorizeRole };
