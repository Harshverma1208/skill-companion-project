const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const Job = require('../models/Jobs');
const Skills = require('../models/Skills');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
}).single('resume');

// Upload and parse resume
exports.uploadResume = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const pdfData = await pdfParse(req.file.buffer);
      
      // Use Gemini AI to parse resume content
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `
        Parse the following resume content and extract structured information in JSON format:
        ${pdfData.text}
        
        Include:
        1. Personal information
        2. Education history
        3. Work experience
        4. Skills with categories
        5. Projects
        6. Certifications
      `;

      const result = await model.generateContent(prompt);
      const parsedData = JSON.parse(result.response.text());

      // Create or update resume record
      const resume = await Resume.findOneAndUpdate(
        { userId: req.user.uid },
        {
          $set: {
            originalFile: {
              filename: req.file.originalname,
              uploadDate: new Date()
            },
            parsedData,
            lastUpdated: new Date()
          }
        },
        { new: true, upsert: true }
      );

      // Perform initial analysis
      await analyzeResume(resume._id);

      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Analyze resume
exports.analyzeResume = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const analysis = await analyzeResume(resumeId);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get resume analysis
exports.getAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.uid });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume.analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to analyze resume
async function analyzeResume(resumeId) {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  // Get market trends and job requirements
  const jobs = await Job.find({
    'requiredSkills.name': { 
      $in: resume.parsedData.skills.map(s => s.name)
    }
  });

  // Use Gemini AI for comprehensive analysis
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `
    Analyze the resume and provide insights based on current job market:
    Resume: ${JSON.stringify(resume.parsedData)}
    Job Market Data: ${JSON.stringify(jobs)}
    
    Provide analysis in JSON format with:
    1. Skill gap analysis
    2. Career path recommendations
    3. Market alignment score and insights
  `;

  const result = await model.generateContent(prompt);
  const analysis = JSON.parse(result.response.text());

  // Update resume with analysis
  await Resume.findByIdAndUpdate(resumeId, {
    $set: {
      analysis,
      lastUpdated: new Date()
    }
  });

  return analysis;
}

// Get suggested improvements
exports.getSuggestedImprovements = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.uid });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Use Gemini AI for improvement suggestions
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      Suggest improvements for the resume based on:
      Current Resume: ${JSON.stringify(resume.parsedData)}
      Analysis: ${JSON.stringify(resume.analysis)}
      
      Provide suggestions in JSON format with:
      1. Content improvements
      2. Format enhancements
      3. Keyword optimization
      4. Skills highlighting
    `;

    const result = await model.generateContent(prompt);
    const suggestions = JSON.parse(result.response.text());

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 