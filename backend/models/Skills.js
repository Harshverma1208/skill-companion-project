const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'soft', 'domain', 'tool']
  },
  description: String,
  relatedSkills: [{
    type: String
  }],
  jobRoles: [{
    role: String,
    importance: {
      type: String,
      enum: ['required', 'preferred', 'optional']
    }
  }],
  marketDemand: {
    score: {
      type: Number,
      min: 0,
      max: 10
    },
    lastUpdated: Date
  },
  learningResources: [{
    platform: String,
    courseId: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    }
  }]
}, {
  timestamps: true
}); 