const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Get skill analysis
router.get('/analyze', (req, res) => {
  res.json({ message: 'Skill analysis route working' });
});

module.exports = router; 