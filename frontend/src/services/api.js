import axios from 'axios';

// Use environment variable for API URL if available
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  async (config) => {
    console.log('Making API request to:', config.url);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      console.log('Adding auth token to request');
      config.headers.Authorization = `Bearer ${user.token}`;
    } else {
      console.log('No auth token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API error response:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('Unauthorized access, clearing user data');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const userAPI = {
  getProfile: () => {
    console.log('Fetching user profile');
    return api.get('/user/profile');
  },
};

export const skillsAPI = {
  analyze: () => {
    console.log('Fetching skill analysis');
    return api.get('/skills/analyze');
  },
};

export const coursesAPI = {
  getRecommendations: () => {
    console.log('Fetching course recommendations');
    return api.get('/courses/recommendations');
  },
};

export const jobsAPI = {
  getTrends: () => {
    console.log('Fetching job trends');
    return api.get('/jobs/trends');
  },
};

export const resumeAPI = {
  analyze: (data) => {
    console.log('Sending resume for analysis');
    return api.post('/resume/analyze', data);
  },
};

export default api; 