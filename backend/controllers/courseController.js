const axios = require('axios');
const Course = require('../models/Courses');
const User = require('../models/User');

// Search courses
exports.searchCourses = async (req, res) => {
  try {
    const { query, skills, platform, difficulty } = req.query;
    
    const filter = {};
    if (skills) filter.skills = { $in: skills.split(',') };
    if (platform) filter.platform = platform;
    if (difficulty) filter.difficulty = difficulty;
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .sort({ rating: -1, enrollmentCount: -1 })
      .limit(20);

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personalized recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    // Get user's skill levels and gaps
    const userSkills = new Set(user.skills.map(s => s.name));
    const completedCourses = new Set(user.completedCourses.map(c => c.courseId));

    // Find courses that match user's skill gaps
    const recommendedCourses = await Course.find({
      externalId: { $nin: Array.from(completedCourses) },
      $or: [
        { skills: { $nin: Array.from(userSkills) } },
        { 
          skills: { 
            $in: user.skills
              .filter(s => s.proficiency === 'beginner')
              .map(s => s.name)
          }
        }
      ]
    })
    .sort({ rating: -1, enrollmentCount: -1 })
    .limit(10);

    res.json(recommendedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sync courses from external platforms
exports.syncCourses = async (req, res) => {
  try {
    const { platform } = req.query;
    
    // Example integration with Coursera API
    if (platform === 'coursera') {
      const response = await axios.get(
        `https://api.coursera.org/api/courses.v1`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.COURSERA_API_KEY}`
          }
        }
      );

      // Process and save courses
      const courses = response.data.elements.map(course => ({
        title: course.name,
        platform: 'coursera',
        externalId: course.id,
        description: course.description,
        url: `https://www.coursera.org/learn/${course.slug}`,
        // ... map other fields
      }));

      await Course.bulkWrite(
        courses.map(course => ({
          updateOne: {
            filter: { platform: 'coursera', externalId: course.externalId },
            update: { $set: course },
            upsert: true
          }
        }))
      );
    }

    // Add similar blocks for other platforms (Udemy, edX, etc.)

    res.json({ message: 'Courses synced successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track course progress
exports.trackProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;
    const user = await User.findOne({ uid: req.user.uid });

    if (progress === 100) {
      // Mark course as completed
      await user.updateOne({
        $push: {
          completedCourses: {
            courseId,
            completionDate: new Date()
          }
        }
      });
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 