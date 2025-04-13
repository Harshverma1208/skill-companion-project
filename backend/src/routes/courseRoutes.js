const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Get course recommendations
router.get('/recommendations', (req, res) => {
  res.json({ message: 'Course recommendations route working' });
});

module.exports = router; 