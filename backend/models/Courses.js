const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  externalId: {
    type: String,
    required: true
  },
  description: String,
  url: String,
  instructor: String,
  duration: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  rating: {
    score: Number,
    count: Number
  },
  price: {
    amount: Number,
    currency: String
  },
  skills: [{
    type: String
  }],
  topics: [{
    type: String
  }],
  lastUpdated: Date,
  enrollmentCount: Number,
  completionRate: Number,
  reviews: [{
    rating: Number,
    comment: String,
    date: Date
  }]
}, {
  timestamps: true
});

// Compound index for platform and externalId
courseSchema.index({ platform: 1, externalId: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema); 