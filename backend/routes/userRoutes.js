const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// All routes are protected with authentication
router.use(authMiddleware);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Add completed course
router.post('/courses/complete', userController.addCompletedCourse);

// Save course for later
router.post('/courses/save', userController.saveCourse);

// Add analysis to history
router.post('/analysis', userController.addAnalysis);

module.exports = router; 