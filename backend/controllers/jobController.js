const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Job = require('../models/Jobs');
const User = require('../models/User');
const Skills = require('../models/Skills');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get job market trends
exports.getMarketTrends = async (req, res) => {
  try {
    const { category, location } = req.query;
    
    // Get trending jobs based on growth rate and demand
    const trendingJobs = await Job.find({
      ...(category && { category }),
      ...(location && { 'marketInsights.locationDemand.location': location }),
      'demandMetrics.growthRate': { $gt: 0 }
    })
    .sort({ 'demandMetrics.growthRate': -1 })
    .limit(10);

    // Aggregate skill trends across jobs
    const skillTrends = await Job.aggregate([
      {
        $unwind: '$skillTrends'
      },
      {
        $group: {
          _id: '$skillTrends.skill',
          averageScore: { $avg: '$skillTrends.trendScore' },
          averageGrowth: { $avg: '$skillTrends.growthRate' }
        }
      },
      {
        $sort: { averageScore: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get salary insights
    const salaryInsights = await Job.aggregate([
      {
        $group: {
          _id: '$category',
          averageSalaryMin: { $avg: '$salaryRange.min' },
          averageSalaryMax: { $avg: '$salaryRange.max' },
          jobCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      trendingJobs,
      skillTrends,
      salaryInsights
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personalized job insights
exports.getPersonalizedInsights = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    // Get user's skills
    const userSkills = user.skills.map(s => s.name);

    // Find matching jobs based on user's skills
    const matchingJobs = await Job.find({
      'requiredSkills.name': { $in: userSkills }
    }).limit(10);

    // Use Gemini AI for career path analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      Analyze career opportunities based on:
      Current skills: ${JSON.stringify(userSkills)}
      Matching jobs: ${JSON.stringify(matchingJobs)}
      Provide analysis in JSON format with:
      1. Best matching roles
      2. Potential career paths
      3. Skill development priorities
    `;

    const result = await model.generateContent(prompt);
    const analysis = JSON.parse(result.response.text());

    res.json({
      matchingJobs,
      careerPathAnalysis: analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sync job market data
exports.syncJobData = async (req, res) => {
  try {
    // Example integration with LinkedIn API
    const linkedInJobs = await axios.get(
      'https://api.linkedin.com/v2/jobs-search',
      {
        headers: {
          'Authorization': `Bearer ${process.env.LINKEDIN_API_KEY}`
        },
        params: {
          // Add necessary parameters
        }
      }
    );

    // Process and update job data
    const jobs = linkedInJobs.data.elements.map(job => ({
      title: job.title,
      category: job.category,
      description: job.description,
      requiredSkills: job.skills.map(skill => ({
        name: skill.name,
        importance: skill.importance
      })),
      // ... map other fields
    }));

    // Bulk upsert jobs
    await Job.bulkWrite(
      jobs.map(job => ({
        updateOne: {
          filter: { title: job.title, category: job.category },
          update: { $set: job },
          upsert: true
        }
      }))
    );

    // Update skill demand scores
    await updateSkillDemandScores();

    res.json({ message: 'Job market data synced successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update skill demand scores
async function updateSkillDemandScores() {
  const skillCounts = await Job.aggregate([
    { $unwind: '$requiredSkills' },
    {
      $group: {
        _id: '$requiredSkills.name',
        count: { $sum: 1 },
        importanceScore: {
          $avg: {
            $switch: {
              branches: [
                { case: { $eq: ['$requiredSkills.importance', 'must-have'] }, then: 1.0 },
                { case: { $eq: ['$requiredSkills.importance', 'preferred'] }, then: 0.6 },
                { case: { $eq: ['$requiredSkills.importance', 'nice-to-have'] }, then: 0.3 }
              ],
              default: 0.5
            }
          }
        }
      }
    }
  ]);

  // Update market demand scores for skills
  for (const skillCount of skillCounts) {
    await Skills.updateOne(
      { name: skillCount._id },
      {
        $set: {
          'marketDemand.score': Math.min(10, (skillCount.count * skillCount.importanceScore) / 10),
          'marketDemand.lastUpdated': new Date()
        }
      }
    );
  }
} 