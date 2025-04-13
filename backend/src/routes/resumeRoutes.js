const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Analyze resume
router.post('/analyze', (req, res) => {
  res.json({ message: 'Resume analysis route working' });
});

module.exports = router; 