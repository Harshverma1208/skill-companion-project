const jobTrendsService = require('../services/jobTrendsService');

exports.getJobTrends = async (req, res) => {
  try {
    console.log('Fetching job trends data...');
    const trends = await jobTrendsService.getJobTrends();
    console.log('Successfully retrieved job trends');
    res.json(trends);
  } catch (error) {
    console.error('Error in getJobTrends controller:', error);
    res.status(500).json({ message: 'Error fetching job trends', error: error.message });
  }
}; 