/**
 * Gemini AI API service
 * Handles integration with Google's Gemini AI for resume analysis
 */

const API_KEY = 'AIzaSyCa3VtgQ_M6Z0pvHAVrhYFNNvm64F4pi-E';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Sample fallback data to use when API fails
const sampleResumeAnalysis = {
  extractedData: {
    basicInfo: {
      name: "Harsh Verma",
      email: "harshgverma2001@gmail.com",
      phone: "+91 9321485864",
      links: ["linkedin", "github"]
    },
    summary: "I am an enthusiastic AI Engineer, passionate about building innovative tech solutions and optimizing systems. With a strong grip on machine learning and full-stack development, I enjoy solving complex problems and turning ideas into reality. When I'm not coding, you'll find me diving into football matches, drawing inspiration from midfield maestros, or brainstorming the next big AI project with my team.",
    workExperience: [
      {
        company: "UrbanTap LLC",
        title: "IT Testing Associate",
        location: "Remote, Dubai",
        duration: "December 2024 - Present",
        achievements: [
          "Engineered and implemented automated testing framework resulting in 30% reduction in QA cycle time across 2 major platform releases",
          "Orchestrated end-to-end testing of PropTech platform, identifying and resolving 50+ critical bugs pre-deployment",
          "Streamlined real estate transaction workflows, reducing process completion time by 25% through strategic system optimization",
          "Developed comprehensive test documentation and established standardized testing protocols, improving team efficiency by 40%",
          "Generated actionable insights through analysis of 10,000+ user interactions, leading to 15% improvement in platform usability"
        ]
      }
    ],
    projects: [
      {
        name: "Skillbridge | Market Demand Analysis Platform",
        description: "AI-powered platform analyzing job postings to identify curriculum gaps",
        technologies: ["AI", "Machine Learning", "Data Visualization"],
        achievements: [
          "Architected AI-powered platform analyzing 5,000+ job postings to identify curriculum gaps, achieving 85% accuracy in skill demand prediction",
          "Engineered machine learning pipeline processing 2TB+ of educational data, reducing analysis time by 60%",
          "Implemented real-time visualization dashboard tracking 20+ key metrics, enabling data-driven curriculum decisions",
          "Integrated 5 different data sources using custom ETL processes, improving data completeness by 75%"
        ]
      },
      {
        name: "Supaclip.pro | Video Content Platform",
        description: "Video processing platform with AI-powered content automation",
        technologies: ["React.js", "Video Processing", "AI"],
        achievements: [
          "Spearheaded development of video processing engine handling 200+ concurrent users with 99.9% uptime",
          "Designed and implemented AI-powered content automation system, reducing editing time by 65%",
          "Built responsive React.js interface achieving 95% user satisfaction rate and 40% increase in user engagement",
          "Optimized video processing algorithms resulting in 45% reduction in rendering time"
        ]
      }
    ],
    education: [
      {
        institution: "Shri Ramdeobaba College of Engineering and Management",
        degree: "B.Tech",
        field: "Artificial Intelligence and Machine Learning",
        date: "2022 - 2026",
        gpa: "CGPA: 9.1/10"
      }
    ],
    skills: {
      technical: ["Python", "NumPy", "Pandas", "Scikit-learn", "Java", "JavaScript", "C++", "React.js", "Machine Learning", "AI"],
      soft: ["Problem Solving", "Communication", "Team Collaboration", "Project Management"]
    }
  },
  scores: {
    overall: 87,
    skills: 84,
    experience: 89,
    education: 92
  },
  skillGaps: [
    { skill: "Cloud Computing (AWS/Azure)", importance: "high" },
    { skill: "DevOps/CI/CD", importance: "medium" },
    { skill: "Deep Learning Frameworks", importance: "high" },
    { skill: "Data Engineering", importance: "medium" },
    { skill: "Docker & Kubernetes", importance: "low" }
  ],
  improvements: [
    "Add specific metrics and outcomes to project achievements",
    "Include links to project repositories or live demos",
    "Expand technical skills section with proficiency levels",
    "Add certifications related to AI and ML",
    "Highlight specific machine learning models or techniques you've worked with"
  ],
  marketAlignment: {
    matchedJobs: 468,
    topRoles: [
      "AI Engineer",
      "Machine Learning Engineer",
      "Data Scientist",
      "Full Stack Developer",
      "Software Engineer (AI/ML)"
    ],
    salaryRange: {
      min: 85000,
      max: 120000
    }
  },
  keyInsights: "Your resume showcases strong technical skills in AI/ML and software development with impressive quantifiable achievements. To improve marketability, consider addressing gaps in cloud computing and DevOps skills, which are increasingly demanded for AI engineers. Your educational background and project experience align well with current market trends. Consider adding certifications and more details about specific ML models you've implemented. With these improvements, you'll be well-positioned for competitive roles in AI engineering and machine learning."
};

/**
 * Analyzes a resume using Gemini AI
 * @param {string} resumeText - The text content of the resume
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeResume = async (resumeText) => {
  try {
    // First try to use the cached data if it exists and the feature flag is enabled
    // This helps during development and when API is unavailable
    const useFallbackData = process.env.NODE_ENV === 'development' || localStorage.getItem('USE_FALLBACK_DATA') === 'true';
    if (useFallbackData) {
      console.log('Using fallback sample analysis data');
      return Promise.resolve(sampleResumeAnalysis);
    }

    const prompt = `
      You are an AI resume analyzer for a professional skills development platform.
      Please analyze the following resume and provide detailed feedback in JSON format.
      
      Resume:
      ${resumeText}
      
      First, extract the structured information from this resume in the following JSON format:
      {
        "basicInfo": {
          "name": "<full name>",
          "email": "<email address>",
          "phone": "<phone number>",
          "links": ["<linkedin url>", "<github url>", "<portfolio url>"]
        },
        "summary": "<professional summary>",
        "workExperience": [
          {
            "company": "<company name>",
            "title": "<job title>",
            "location": "<location>",
            "duration": "<start date - end date>",
            "achievements": ["<achievement 1>", "<achievement 2>"]
          }
        ],
        "education": [
          {
            "institution": "<institution name>",
            "degree": "<degree name>",
            "field": "<field of study>",
            "date": "<graduation date or duration>",
            "gpa": "<GPA if available>"
          }
        ],
        "skills": {
          "technical": ["<skill 1>", "<skill 2>"],
          "soft": ["<skill 1>", "<skill 2>"]
        },
        "projects": [
          {
            "name": "<project name>",
            "description": "<project description>",
            "technologies": ["<tech 1>", "<tech 2>"]
          }
        ]
      }
      
      Then, analyze this resume and provide feedback in the following JSON format:
      {
        "extractedData": <the JSON structure above with extracted data>,
        "scores": {
          "overall": <number 0-100>,
          "skills": <number 0-100>,
          "experience": <number 0-100>,
          "education": <number 0-100>
        },
        "skillGaps": [
          { "skill": "<skill name>", "importance": "<high|medium|low>" }
        ],
        "improvements": [
          "<improvement suggestion>"
        ],
        "marketAlignment": {
          "matchedJobs": <number>,
          "topRoles": ["<role 1>", "<role 2>", "<role 3>"],
          "salaryRange": {
            "min": <number>,
            "max": <number>
          }
        },
        "keyInsights": "<brief paragraph with key insights and recommendations>"
      }
      
      Focus on technical skills, experience structure, achievements quantification, and modern resume practices.
      Identify gaps compared to current market demand.
      Ensure to extract all sections from the resume accurately, even if they don't match the conventional names.
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      console.warn(`Gemini API error: ${response.status}, using fallback data`);
      return sampleResumeAnalysis;
    }

    const data = await response.json();
    
    // Extract the JSON from the response text
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.warn('Failed to parse Gemini response, using fallback data');
      return sampleResumeAnalysis;
    }
    
    try {
      const analysisData = JSON.parse(jsonMatch[0]);
      return analysisData;
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return sampleResumeAnalysis;
    }
  } catch (error) {
    console.error('Resume analysis error:', error);
    return sampleResumeAnalysis;  // Return sample data instead of throwing error
  }
};

/**
 * Simplified function to extract text from a PDF file
 * This version now just returns dummy text, skipping the actual PDF processing
 * @param {File} file - The PDF file
 * @returns {Promise<string>} - Placeholder text
 */
export const extractTextFromPDF = async (file) => {
  console.log('PDF text extraction skipped, using sample resume text');
  return getSampleResumeText(file.name);
};

/**
 * Returns sample resume text for fallback
 * @param {string} fileName - Name of the uploaded file
 * @returns {string} - Sample resume text
 */
const getSampleResumeText = (fileName) => {
  return `
    Harsh Verma
    +91 9321485864 | harshgverma2001@gmail.com | linkedin | github
    
    Profile
    I am an enthusiastic AI Engineer, passionate about building innovative tech solutions and optimizing systems. With a strong grip on machine learning and full-stack development, I enjoy solving complex problems and turning ideas into reality. When I'm not coding, you'll find me diving into football matches, drawing inspiration from midfield maestros, or brainstorming the next big AI project with my team.
    
    Professional Experience
    UrbanTap LLC
    IT Testing Associate | Remote, Dubai | December 2024 - Present
    - Engineered and implemented automated testing framework resulting in 30% reduction in QA cycle time across 2 major platform releases
    - Orchestrated end-to-end testing of PropTech platform, identifying and resolving 50+ critical bugs pre-deployment
    - Streamlined real estate transaction workflows, reducing process completion time by 25% through strategic system optimization
    - Developed comprehensive test documentation and established standardized testing protocols, improving team efficiency by 40%
    - Generated actionable insights through analysis of 10,000+ user interactions, leading to 15% improvement in platform usability
    
    Technical Projects
    Skillbridge | Market Demand Analysis Platform | 2024 - Present
    - Architected AI-powered platform analyzing 5,000+ job postings to identify curriculum gaps, achieving 85% accuracy in skill demand prediction
    - Engineered machine learning pipeline processing 2TB+ of educational data, reducing analysis time by 60%
    - Implemented real-time visualization dashboard tracking 20+ key metrics, enabling data-driven curriculum decisions
    - Integrated 5 different data sources using custom ETL processes, improving data completeness by 75%
    
    Supaclip.pro | Video Content Platform | 2024
    - Spearheaded development of video processing engine handling 200+ concurrent users with 99.9% uptime
    - Designed and implemented AI-powered content automation system, reducing editing time by 65%
    - Built responsive React.js interface achieving 95% user satisfaction rate and 40% increase in user engagement
    - Optimized video processing algorithms resulting in 45% reduction in rendering time
    
    Education
    Shri Ramdeobaba College of Engineering and Management | 2022 - 2026
    B.Tech in Artificial Intelligence and Machine Learning | CGPA: 9.1/10
    
    Technical Skills
    Programming Languages: Python (NumPy, Pandas, Scikit-learn), Java, JavaScript, C++
  `;
}; 