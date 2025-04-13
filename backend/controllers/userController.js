const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, currentRole, targetRole, skills } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { 
        $set: {
          name,
          currentRole,
          targetRole,
          skills
        }
      },
      { new: true, upsert: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add completed course
exports.addCompletedCourse = async (req, res) => {
  try {
    const { courseId, platform } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $push: {
          completedCourses: {
            courseId,
            platform,
            completionDate: new Date()
          }
        }
      },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save course for later
exports.saveCourse = async (req, res) => {
  try {
    const { courseId, platform } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $push: {
          savedCourses: {
            courseId,
            platform,
            savedDate: new Date()
          }
        }
      },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add analysis to history
exports.addAnalysis = async (req, res) => {
  try {
    const { type, results } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $push: {
          analysisHistory: {
            type,
            date: new Date(),
            results
          }
        }
      },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 