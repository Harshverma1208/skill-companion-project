const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  requiredSkills: [{
    name: String,
    importance: {
      type: String,
      enum: ['must-have', 'preferred', 'nice-to-have']
    }
  }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  demandMetrics: {
    openPositions: Number,
    growthRate: Number, // Percentage growth YoY
    competitionScore: Number, // 1-10 scale
    lastUpdated: Date
  },
  marketInsights: {
    topCompanies: [{
      name: String,
      openings: Number
    }],
    locationDemand: [{
      location: String,
      openings: Number,
      averageSalary: Number
    }],
    industryTrends: [{
      trend: String,
      impact: {
        type: String,
        enum: ['high', 'medium', 'low']
      }
    }]
  },
  skillTrends: [{
    skill: String,
    trendScore: Number, // 1-10 scale
    growthRate: Number, // Percentage
    period: {
      start: Date,
      end: Date
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
jobSchema.index({ title: 'text', category: 1 });
jobSchema.index({ 'requiredSkills.name': 1 });
jobSchema.index({ 'demandMetrics.growthRate': -1 });

module.exports = mongoose.model('Job', jobSchema); 