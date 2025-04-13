const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  currentRole: {
    type: String
  },
  targetRole: {
    type: String
  },
  skills: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  }],
  completedCourses: [{
    courseId: String,
    platform: String,
    completionDate: Date
  }],
  savedCourses: [{
    courseId: String,
    platform: String,
    savedDate: Date
  }],
  analysisHistory: [{
    type: {
      type: String,
      enum: ['skill-gap', 'resume', 'job-trend']
    },
    date: Date,
    results: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 