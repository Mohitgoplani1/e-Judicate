const express = require('express');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Example: Route accessible by **Judges only**
router.get('/judge-dashboard', authenticateUser, authorizeRole(['judge']), (req, res) => {
    res.json({ msg: 'Welcome to the Judge Dashboard' });
});

// Example: Route accessible by **Petitioners & Defendants**
router.get('/case-files', authenticateUser, authorizeRole(['petitioner', 'defendant']), (req, res) => {
    res.json({ msg: 'Accessing case files...' });
});

module.exports = router;