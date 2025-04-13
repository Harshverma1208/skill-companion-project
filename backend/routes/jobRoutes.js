const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Get job market trends
router.get('/trends', jobController.getMarketTrends);

// Get personalized job insights
router.get('/insights', jobController.getPersonalizedInsights);

// Sync job market data (admin only)
router.post('/sync', jobController.syncJobData);

module.exports = router; 