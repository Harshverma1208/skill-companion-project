const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Upload and parse resume
router.post('/upload', resumeController.uploadResume);

// Analyze resume
router.post('/:resumeId/analyze', resumeController.analyzeResume);

// Get resume analysis
router.get('/analysis', resumeController.getAnalysis);

// Get suggested improvements
router.get('/improvements', resumeController.getSuggestedImprovements);

module.exports = router; 