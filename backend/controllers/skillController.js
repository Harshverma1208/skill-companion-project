const { GoogleGenerativeAI } = require('@google/generative-ai');
const Skills = require('../models/Skills');
const User = require('../models/User');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze skill gap
exports.analyzeSkillGap = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get required skills for target role
    const requiredSkills = await Skills.find({
      'jobRoles.role': targetRole,
      'jobRoles.importance': 'required'
    });

    // Prepare data for AI analysis
    const userSkills = user.skills.map(s => ({
      name: s.name,
      proficiency: s.proficiency
    }));

    // Use Gemini AI for gap analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      Analyze the skill gap between current skills and required skills:
      Current skills: ${JSON.stringify(userSkills)}
      Required skills: ${JSON.stringify(requiredSkills)}
      Provide analysis in JSON format with:
      1. Missing critical skills
      2. Skills that need improvement
      3. Recommended learning path
    `;

    const result = await model.generateContent(prompt);
    const analysis = JSON.parse(result.response.text());

    // Save analysis to user history
    await user.updateOne({
      $push: {
        analysisHistory: {
          type: 'skill-gap',
          date: new Date(),
          results: analysis
        }
      }
    });

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get skill recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const { category, level } = req.query;
    const user = await User.findOne({ uid: req.user.uid });

    // Get skills based on user's profile and market demand
    const recommendedSkills = await Skills.find({
      category,
      'marketDemand.score': { $gte: 7 },
      name: { $nin: user.skills.map(s => s.name) }
    }).sort({ 'marketDemand.score': -1 });

    res.json(recommendedSkills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update market demand
exports.updateMarketDemand = async (req, res) => {
  try {
    const { skillId, score } = req.body;
    
    const skill = await Skills.findByIdAndUpdate(
      skillId,
      {
        $set: {
          'marketDemand.score': score,
          'marketDemand.lastUpdated': new Date()
        }
      },
      { new: true }
    );

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add learning resource
exports.addLearningResource = async (req, res) => {
  try {
    const { skillId, platform, courseId, difficulty } = req.body;
    
    const skill = await Skills.findByIdAndUpdate(
      skillId,
      {
        $push: {
          learningResources: {
            platform,
            courseId,
            difficulty
          }
        }
      },
      { new: true }
    );

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 