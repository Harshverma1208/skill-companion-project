/**
 * Trend Service
 * Uses Gemini API to get the latest job market trends and data
 */

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCa3VtgQ_M6Z0pvHAVrhYFNNvm64F4pi-E';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Fallback data to use when API calls fail
const fallbackData = {
  stats: [
    { "title": "Open Positions", "value": "186,500", "change": "4.8", "period": "vs last month" },
    { "title": "Average Salary", "value": "$105,800", "change": "2.3", "period": "vs last month" },
    { "title": "Demand Growth", "value": "9.5%", "change": "1.7", "period": "vs last month" },
    { "title": "Top Skills", "value": "25", "change": "3.2", "period": "vs last month" }
  ],
  salaryTrends: [
    { "role": "Full Stack Developer", "salary": 115000, "growth": 7.2, "openings": 45000 },
    { "role": "Frontend Developer", "salary": 102000, "growth": 5.8, "openings": 38000 },
    { "role": "Backend Developer", "salary": 112000, "growth": 6.4, "openings": 42000 },
    { "role": "DevOps Engineer", "salary": 125000, "growth": 9.1, "openings": 28000 },
    { "role": "Data Scientist", "salary": 130000, "growth": 8.5, "openings": 25000 },
    { "role": "Cloud Architect", "salary": 145000, "growth": 10.2, "openings": 18000 },
    { "role": "ML Engineer", "salary": 135000, "growth": 12.3, "openings": 15000 },
    { "role": "UI/UX Designer", "salary": 95000, "growth": 4.5, "openings": 30000 },
    { "role": "Security Engineer", "salary": 128000, "growth": 11.8, "openings": 22000 },
    { "role": "Mobile Developer", "salary": 108000, "growth": 5.3, "openings": 33000 }
  ],
  industryDistribution: [
    { "name": "Technology", "value": 42, "jobs": 350000 },
    { "name": "Finance", "value": 18, "jobs": 150000 },
    { "name": "Healthcare", "value": 15, "jobs": 125000 },
    { "name": "E-commerce", "value": 12, "jobs": 100000 },
    { "name": "Manufacturing", "value": 8, "jobs": 67000 },
    { "name": "Education", "value": 5, "jobs": 42000 }
  ],
  skillDemand: [
    { "month": "Jan", "React": 85, "Node": 78, "Python": 90, "AWS": 86, "DevOps": 84, "AI": 92, "Security": 88, "UI": 76, "Mobile": 74, "Cloud": 89 },
    { "month": "Feb", "React": 86, "Node": 79, "Python": 91, "AWS": 87, "DevOps": 85, "AI": 93, "Security": 89, "UI": 77, "Mobile": 75, "Cloud": 90 },
    { "month": "Mar", "React": 87, "Node": 80, "Python": 92, "AWS": 88, "DevOps": 86, "AI": 94, "Security": 90, "UI": 78, "Mobile": 76, "Cloud": 91 },
    { "month": "Apr", "React": 88, "Node": 82, "Python": 93, "AWS": 89, "DevOps": 87, "AI": 95, "Security": 91, "UI": 79, "Mobile": 77, "Cloud": 92 },
    { "month": "May", "React": 89, "Node": 83, "Python": 94, "AWS": 90, "DevOps": 88, "AI": 96, "Security": 92, "UI": 80, "Mobile": 78, "Cloud": 93 },
    { "month": "Jun", "React": 90, "Node": 85, "Python": 95, "AWS": 91, "DevOps": 89, "AI": 97, "Security": 93, "UI": 81, "Mobile": 79, "Cloud": 94 }
  ],
  trendingTech: [
    { "name": "Generative AI", "growth": 152 },
    { "name": "Web3", "growth": 73 },
    { "name": "Serverless Architecture", "growth": 48 },
    { "name": "Edge Computing", "growth": 37 },
    { "name": "Low-Code Development", "growth": 29 }
  ],
  jobDetails: [
    { 
      "role": "Full Stack Developer", 
      "skills": ["JavaScript", "React", "Node.js", "MongoDB"], 
      "avgExperience": "3-5 years", 
      "remotePercentage": 68, 
      "topLocations": ["San Francisco", "New York", "Austin"] 
    },
    { 
      "role": "Frontend Developer", 
      "skills": ["React", "TypeScript", "CSS", "HTML"], 
      "avgExperience": "2-4 years", 
      "remotePercentage": 72, 
      "topLocations": ["Seattle", "Boston", "Denver"] 
    },
    { 
      "role": "Backend Developer", 
      "skills": ["Python", "Java", "Go", "SQL"], 
      "avgExperience": "3-5 years", 
      "remotePercentage": 65, 
      "topLocations": ["New York", "Chicago", "Atlanta"] 
    },
    { 
      "role": "DevOps Engineer", 
      "skills": ["Docker", "Kubernetes", "AWS", "CI/CD"], 
      "avgExperience": "4-6 years", 
      "remotePercentage": 58, 
      "topLocations": ["San Francisco", "Seattle", "Austin"] 
    },
    { 
      "role": "Data Scientist", 
      "skills": ["Python", "SQL", "Machine Learning", "Statistics"], 
      "avgExperience": "3-6 years", 
      "remotePercentage": 62, 
      "topLocations": ["San Francisco", "New York", "Boston"] 
    },
    { 
      "role": "Cloud Architect", 
      "skills": ["AWS", "Azure", "GCP", "Infrastructure as Code"], 
      "avgExperience": "5-8 years", 
      "remotePercentage": 55, 
      "topLocations": ["Seattle", "San Francisco", "Chicago"] 
    }
  ]
};

/**
 * Fetches latest job market statistics
 * @returns {Promise<Object>} Market stats data
 */
export const fetchMarketStats = async () => {
  try {
    const prompt = `
      Act as a job market data analyst. Please provide the latest statistics for the tech job market in JSON format.
      Include information about:
      1. Total open positions in tech
      2. Average salary for tech positions
      3. Overall demand growth percentage
      4. Number of top in-demand skills

      Return ONLY a valid JSON object with this exact format:
      {
        "stats": [
          { "title": "Open Positions", "value": "NUMBER_WITH_COMMAS", "change": "PERCENTAGE_NUMBER", "period": "vs last month" },
          { "title": "Average Salary", "value": "$NUMBER_WITH_COMMAS", "change": "PERCENTAGE_NUMBER", "period": "vs last month" },
          { "title": "Demand Growth", "value": "PERCENTAGE_NUMBER%", "change": "PERCENTAGE_NUMBER", "period": "vs last month" },
          { "title": "Top Skills", "value": "NUMBER", "change": "PERCENTAGE_NUMBER", "period": "vs last month" }
        ]
      }

      Use the most recent data available from 2024. Make sure all numbers are realistic.
    `;

    return await fetchGeminiData(prompt);
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return { stats: fallbackData.stats };
  }
};

/**
 * Fetches latest salary trends for different tech roles
 * @returns {Promise<Object>} Salary trends data
 */
export const fetchSalaryTrends = async () => {
  try {
    const prompt = `
      Act as a compensation analyst for the tech industry. Please provide the latest salary trends for different tech roles.
      Include information about:
      1. Role name
      2. Average salary in USD
      3. Salary growth percentage
      4. Number of job openings

      Include these roles: Full Stack Developer, Frontend Developer, Backend Developer, DevOps Engineer, 
      Data Scientist, Cloud Architect, ML Engineer, UI/UX Designer, Security Engineer, Mobile Developer.

      Return ONLY a valid JSON object with this exact format:
      {
        "salaryTrends": [
          { "role": "ROLE_NAME", "salary": NUMBER, "growth": NUMBER, "openings": NUMBER },
          ...
        ]
      }

      Use the most recent data available from 2024. Make sure all numbers are realistic.
    `;

    return await fetchGeminiData(prompt);
  } catch (error) {
    console.error('Error fetching salary trends:', error);
    return { salaryTrends: fallbackData.salaryTrends };
  }
};

/**
 * Fetches latest industry distribution of tech jobs
 * @returns {Promise<Object>} Industry distribution data
 */
export const fetchIndustryDistribution = async () => {
  try {
    const prompt = `
      Act as a job market researcher. Please provide the latest distribution of tech jobs across different industries.
      Include information about:
      1. Industry name
      2. Percentage of tech jobs in that industry
      3. Approximate number of jobs

      Include these industries: Technology, Finance, Healthcare, E-commerce, Manufacturing, Education.

      Return ONLY a valid JSON object with this exact format:
      {
        "industryDistribution": [
          { "name": "INDUSTRY_NAME", "value": PERCENTAGE_NUMBER, "jobs": NUMBER },
          ...
        ]
      }

      Use the most recent data available from 2024. Make sure all numbers are realistic.
    `;

    return await fetchGeminiData(prompt);
  } catch (error) {
    console.error('Error fetching industry distribution:', error);
    return { industryDistribution: fallbackData.industryDistribution };
  }
};

/**
 * Fetches latest skill demand trends
 * @returns {Promise<Object>} Skill demand data
 */
export const fetchSkillDemand = async () => {
  try {
    const prompt = `
      Act as a tech skills analyst. Please provide the latest demand trends for different tech skills.
      Include monthly demand scores (0-100) for the past 6 months (Jan-Jun 2024) for these skills:
      React, Node, Python, AWS, DevOps, AI, Security, UI, Mobile, Cloud

      Return ONLY a valid JSON object with this exact format:
      {
        "skillDemand": [
          { "month": "Jan", "React": NUMBER, "Node": NUMBER, "Python": NUMBER, "AWS": NUMBER, "DevOps": NUMBER, "AI": NUMBER, "Security": NUMBER, "UI": NUMBER, "Mobile": NUMBER, "Cloud": NUMBER },
          ...for all 6 months
        ]
      }

      Use the most recent data available. Make sure all numbers are realistic and show appropriate trends.
    `;

    return await fetchGeminiData(prompt);
  } catch (error) {
    console.error('Error fetching skill demand:', error);
    return { skillDemand: fallbackData.skillDemand };
  }
};

/**
 * Fetches latest trending technologies in tech
 * @returns {Promise<Object>} Trending tech data
 */
export const fetchTrendingTech = async () => {
  try {
    const prompt = `
      Act as a technology trend analyst. Please provide the latest trending technologies in the tech industry.
      Include information about:
      1. Technology name
      2. Year-over-year growth percentage

      Include 5 of the most trending technologies in 2024.

      Return ONLY a valid JSON object with this exact format:
      {
        "trendingTech": [
          { "name": "TECHNOLOGY_NAME", "growth": NUMBER },
          ...
        ]
      }

      Use the most recent data available. Make sure all numbers are realistic.
    `;

    return await fetchGeminiData(prompt);
  } catch (error) {
    console.error('Error fetching trending tech:', error);
    return { trendingTech: fallbackData.trendingTech };
  }
};

/**
 * Fetches latest job details for different tech roles
 * @returns {Promise<Object>} Job details data
 */
export const fetchJobDetails = async () => {
  try {
    const prompt = `
      Act as a job market specialist. Please provide the latest details for different tech roles.
      Include information about:
      1. Role name
      2. Required skills (as array of strings)
      3. Average years of experience required
      4. Percentage of remote opportunities
      5. Top locations for the role (as array of strings)

      Include these roles: Full Stack Developer, Frontend Developer, Backend Developer, DevOps Engineer, 
      Data Scientist, Cloud Architect, ML Engineer, UI/UX Designer, Security Engineer, Mobile Developer.

      Return ONLY a valid JSON object with this exact format:
      {
        "jobDetails": [
          { 
            "role": "ROLE_NAME", 
            "skills": ["SKILL1", "SKILL2", "SKILL3", "SKILL4"], 
            "avgExperience": "X-Y years", 
            "remotePercentage": NUMBER, 
            "topLocations": ["LOCATION1", "LOCATION2", "LOCATION3"] 
          },
          ...
        ]
      }

      Use the most recent data available from 2024. Make sure all values are realistic.
    `;

    return await fetchGeminiData(prompt);
  } catch (error) {
    console.error('Error fetching job details:', error);
    return { jobDetails: fallbackData.jobDetails };
  }
};

/**
 * Helper function to fetch data from Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<Object>} Parsed JSON response
 */
const fetchGeminiData = async (prompt) => {
  try {
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
          temperature: 0.1,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the JSON from the response text
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response');
    }
    
    const resultData = JSON.parse(jsonMatch[0]);
    return resultData;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}; 