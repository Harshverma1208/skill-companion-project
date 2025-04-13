const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', (req, res) => {
  res.json({ message: 'Profile route working' });
});

module.exports = router; 