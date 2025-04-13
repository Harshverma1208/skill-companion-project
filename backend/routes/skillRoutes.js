const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Analyze skill gap
router.post('/analyze', skillController.analyzeSkillGap);

// Get skill recommendations
router.get('/recommendations', skillController.getRecommendations);

// Update market demand (admin only)
router.put('/market-demand/:skillId', skillController.updateMarketDemand);

// Add learning resource
router.post('/:skillId/resources', skillController.addLearningResource);

module.exports = router; 