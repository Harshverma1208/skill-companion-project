const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  originalFile: {
    filename: String,
    uploadDate: Date
  },
  parsedData: { type: mongoose.Schema.Types.Mixed },
  analysis: { type: mongoose.Schema.Types.Mixed },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema); 