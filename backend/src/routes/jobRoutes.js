const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const jobController = require('../controllers/jobController');

// Protect all routes
router.use(authMiddleware);

// Get job trends
router.get('/trends', jobController.getJobTrends);

module.exports = router; 