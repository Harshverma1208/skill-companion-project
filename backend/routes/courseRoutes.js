const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddleware } = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Search courses
router.get('/search', courseController.searchCourses);

// Get personalized recommendations
router.get('/recommendations', courseController.getRecommendations);

// Sync courses from external platforms (admin only)
router.post('/sync', courseController.syncCourses);

// Track course progress
router.post('/:courseId/progress', courseController.trackProgress);

module.exports = router; 