import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

// Stats Card Component
const StatCard = ({ title, value, change, period }) => (
  <Card sx={{ 
    height: '100%',
    boxShadow: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'visible',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '30%',
      height: '100%',
      backgroundColor: '#3b82f6',
      opacity: 0.1,
      borderTopRightRadius: '12px',
      borderBottomRightRadius: '12px',
    }
  }}>
    <CardContent>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 700 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ color: '#10b981', display: 'flex', alignItems: 'center' }}>
          <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
          {change}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {period}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// Skill Gap Card Component
const SkillGapCard = ({ title, description, skills, recommendations }) => (
  <Card sx={{ 
    height: '100%',
    boxShadow: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
  }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#1e293b' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: '#64748b' }}>
        {description}
      </Typography>

      {/* Skills Gap Analysis */}
      <Typography variant="subtitle2" sx={{ mb: 3, color: '#1e293b', fontWeight: 600 }}>
        Skills Gap Analysis
      </Typography>
      {skills.map((skill, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                {skill.name}
              </Typography>
              {skill.yourLevel >= skill.requiredLevel ? (
                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 16 }} />
              ) : (
                <ErrorIcon sx={{ color: '#ef4444', fontSize: 16 }} />
              )}
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Your Level: {skill.yourLevel}% / Required: {skill.requiredLevel}%
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', position: 'relative' }}>
            <LinearProgress 
              variant="determinate" 
              value={skill.yourLevel} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e2e8f0',
                flexGrow: 1,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: skill.yourLevel >= skill.requiredLevel ? '#10b981' : '#3b82f6',
                }
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute',
                left: `${skill.requiredLevel}%`,
                height: '100%',
                width: 2,
                backgroundColor: '#ef4444',
              }}
            />
          </Box>
        </Box>
      ))}

      {/* Course Recommendations */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: '#1e293b',
          fontWeight: 600
        }}>
          <SchoolIcon fontSize="small" />
          Recommended Courses
        </Typography>
        {recommendations.map((course, index) => (
          <Box key={index} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b', mb: 0.5 }}>
                  {course.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                  {course.platform} • {course.duration}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {course.skills.map((skill, idx) => (
                    <Chip 
                      key={idx} 
                      label={skill} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        fontSize: '0.75rem',
                      }} 
                    />
                  ))}
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                sx={{ 
                  minWidth: 100,
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#f1f5f9',
                  }
                }}
              >
                Enroll
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

// Market data
const marketData = {
  stats: [
    { title: 'Open Positions', value: '127,500', change: '12', period: 'vs last month' },
    { title: 'Average Salary', value: '$98,500', change: '5', period: 'vs last month' },
    { title: 'Demand Growth', value: '18%', change: '8', period: 'vs last month' },
    { title: 'Top Skills', value: '12', change: '2', period: 'vs last month' },
  ],
  salaryTrends: [
    { role: 'Full Stack Developer', salary: 98500, growth: 12, openings: 15000 },
    { role: 'Frontend Developer', salary: 92000, growth: 8, openings: 12000 },
    { role: 'Backend Developer', salary: 95000, growth: 10, openings: 13000 },
    { role: 'DevOps Engineer', salary: 105000, growth: 15, openings: 8000 },
    { role: 'Data Scientist', salary: 110000, growth: 18, openings: 7000 },
    { role: 'Cloud Architect', salary: 125000, growth: 20, openings: 5000 },
    { role: 'ML Engineer', salary: 115000, growth: 22, openings: 4500 },
    { role: 'UI/UX Designer', salary: 88000, growth: 9, openings: 6000 },
    { role: 'Security Engineer', salary: 108000, growth: 16, openings: 4000 },
    { role: 'Mobile Developer', salary: 94000, growth: 11, openings: 7500 }
  ],
  industryDistribution: [
    { name: 'Technology', value: 35, jobs: 45000 },
    { name: 'Finance', value: 25, jobs: 32000 },
    { name: 'Healthcare', value: 15, jobs: 19000 },
    { name: 'E-commerce', value: 12, jobs: 15000 },
    { name: 'Manufacturing', value: 8, jobs: 10000 },
    { name: 'Education', value: 5, jobs: 6500 }
  ],
  skillDemand: [
    { month: 'Jan', React: 82, Node: 75, Python: 78, AWS: 80, DevOps: 72, AI: 70, Security: 68, UI: 74, Mobile: 76, Cloud: 79 },
    { month: 'Feb', React: 85, Node: 78, Python: 80, AWS: 83, DevOps: 75, AI: 73, Security: 70, UI: 76, Mobile: 78, Cloud: 82 },
    { month: 'Mar', React: 88, Node: 82, Python: 85, AWS: 86, DevOps: 79, AI: 77, Security: 74, UI: 79, Mobile: 81, Cloud: 85 },
    { month: 'Apr', React: 92, Node: 85, Python: 88, AWS: 89, DevOps: 83, AI: 82, Security: 78, UI: 82, Mobile: 84, Cloud: 88 },
    { month: 'May', React: 95, Node: 88, Python: 90, AWS: 92, DevOps: 86, AI: 86, Security: 82, UI: 85, Mobile: 87, Cloud: 91 },
    { month: 'Jun', React: 97, Node: 90, Python: 92, AWS: 94, DevOps: 89, AI: 89, Security: 85, UI: 87, Mobile: 89, Cloud: 93 }
  ],
  jobDetails: [
    {
      role: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'SQL', 'AWS'],
      avgExperience: '3-5 years',
      remotePercentage: 75,
      topLocations: ['San Francisco', 'New York', 'London']
    },
    {
      role: 'Frontend Developer',
      skills: ['React', 'TypeScript', 'CSS', 'UI/UX'],
      avgExperience: '2-4 years',
      remotePercentage: 80,
      topLocations: ['New York', 'Berlin', 'Toronto']
    },
    {
      role: 'Backend Developer',
      skills: ['Node.js', 'Python', 'SQL', 'MongoDB'],
      avgExperience: '3-5 years',
      remotePercentage: 70,
      topLocations: ['London', 'Amsterdam', 'Singapore']
    },
    {
      role: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      avgExperience: '4-6 years',
      remotePercentage: 65,
      topLocations: ['Seattle', 'Austin', 'Sydney']
    },
    {
      role: 'Data Scientist',
      skills: ['Python', 'ML', 'Statistics', 'SQL'],
      avgExperience: '3-5 years',
      remotePercentage: 60,
      topLocations: ['Boston', 'Toronto', 'Munich']
    },
    {
      role: 'Cloud Architect',
      skills: ['AWS', 'Azure', 'GCP', 'Security'],
      avgExperience: '5-8 years',
      remotePercentage: 55,
      topLocations: ['San Francisco', 'London', 'Singapore']
    },
    {
      role: 'ML Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
      avgExperience: '3-6 years',
      remotePercentage: 50,
      topLocations: ['Seattle', 'Boston', 'Berlin']
    },
    {
      role: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'HTML/CSS', 'Design Systems'],
      avgExperience: '2-4 years',
      remotePercentage: 85,
      topLocations: ['New York', 'London', 'Paris']
    },
    {
      role: 'Security Engineer',
      skills: ['Network Security', 'Cloud Security', 'Penetration Testing'],
      avgExperience: '4-7 years',
      remotePercentage: 45,
      topLocations: ['Washington DC', 'London', 'Tel Aviv']
    },
    {
      role: 'Mobile Developer',
      skills: ['React Native', 'iOS', 'Android', 'Flutter'],
      avgExperience: '2-5 years',
      remotePercentage: 70,
      topLocations: ['San Francisco', 'Berlin', 'Tokyo']
    }
  ]
};

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f97316'];

// Skill gap data
const skillGapData = {
  categories: [
    {
      title: 'Full Stack Development',
      description: 'Compare your full stack development skills with market requirements',
      skills: [
        { 
          name: 'React', 
          yourLevel: 65, 
          requiredLevel: 92,
        },
        { 
          name: 'Node.js', 
          yourLevel: 45, 
          requiredLevel: 85,
        },
        { 
          name: 'SQL', 
          yourLevel: 78, 
          requiredLevel: 78,
        }
      ],
      recommendations: [
        {
          title: 'Complete React Developer in 2024',
          platform: 'Udemy',
          duration: '40 hours',
          skills: ['React', 'Redux', 'Hooks', 'Context API'],
        },
        {
          title: 'Node.js: The Complete Guide',
          platform: 'Coursera',
          duration: '32 hours',
          skills: ['Node.js', 'Express', 'REST APIs'],
        }
      ]
    },
    {
      title: 'Cloud Computing',
      description: 'Essential cloud platform skills and certifications',
      skills: [
        { 
          name: 'AWS', 
          yourLevel: 40, 
          requiredLevel: 88,
        },
        { 
          name: 'Azure', 
          yourLevel: 82, 
          requiredLevel: 82,
        },
        { 
          name: 'Kubernetes', 
          yourLevel: 35, 
          requiredLevel: 70,
        }
      ],
      recommendations: [
        {
          title: 'AWS Certified Solutions Architect',
          platform: 'AWS Training',
          duration: '60 hours',
          skills: ['AWS', 'Cloud Architecture', 'Security'],
        },
        {
          title: 'Kubernetes for Developers',
          platform: 'Linux Foundation',
          duration: '25 hours',
          skills: ['Kubernetes', 'Docker', 'Container Orchestration'],
        }
      ]
    },
    {
      title: 'Data Science',
      description: 'Data analysis and machine learning skills assessment',
      skills: [
        { 
          name: 'Python', 
          yourLevel: 90, 
          requiredLevel: 90,
        },
        { 
          name: 'TensorFlow', 
          yourLevel: 45, 
          requiredLevel: 82,
        },
        { 
          name: 'Statistics', 
          yourLevel: 55, 
          requiredLevel: 75,
        }
      ],
      recommendations: [
        {
          title: 'Deep Learning Specialization',
          platform: 'Coursera',
          duration: '80 hours',
          skills: ['TensorFlow', 'Neural Networks', 'Deep Learning'],
        },
        {
          title: 'Statistics for Data Science',
          platform: 'edX',
          duration: '30 hours',
          skills: ['Statistics', 'Probability', 'Data Analysis'],
        }
      ]
    },
    {
      title: 'Frontend Development',
      description: 'Modern UI development skills comparison',
      skills: [
        { 
          name: 'React', 
          yourLevel: 65, 
          requiredLevel: 92,
        },
        { 
          name: 'CSS', 
          yourLevel: 85, 
          requiredLevel: 85,
        },
        { 
          name: 'TypeScript', 
          yourLevel: 50, 
          requiredLevel: 80,
        }
      ],
      recommendations: [
        {
          title: 'TypeScript Masterclass',
          platform: 'Frontend Masters',
          duration: '24 hours',
          skills: ['TypeScript', 'Advanced Types', 'React with TS'],
        },
        {
          title: 'Advanced CSS and Sass',
          platform: 'Udemy',
          duration: '28 hours',
          skills: ['CSS', 'Sass', 'Flexbox', 'Grid'],
        }
      ]
    }
  ]
};

// Charts Section Component
const ChartsSection = ({ selectedTab }) => {
  if (selectedTab === 'SALARY TRENDS') {
    return (
      <Box sx={{ height: 500, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={marketData.salaryTrends} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="salary" fill="#3b82f6" name="Average Salary ($)" />
            <Bar yAxisId="right" dataKey="growth" fill="#10b981" name="Growth (%)" />
            <Bar yAxisId="right" dataKey="openings" fill="#8b5cf6" name="Job Openings" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  if (selectedTab === 'INDUSTRY DISTRIBUTION') {
    return (
      <Box sx={{ height: 500, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={marketData.industryDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={200}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value, jobs }) => `${name} (${value}%) - ${jobs} jobs`}
            >
              {marketData.industryDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  if (selectedTab === 'SKILL DEMAND') {
    return (
      <Box sx={{ height: 500, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={marketData.skillDemand} margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="React" stroke="#3b82f6" />
            <Line type="monotone" dataKey="Node" stroke="#10b981" />
            <Line type="monotone" dataKey="Python" stroke="#8b5cf6" />
            <Line type="monotone" dataKey="AWS" stroke="#f59e0b" />
            <Line type="monotone" dataKey="DevOps" stroke="#ef4444" />
            <Line type="monotone" dataKey="AI" stroke="#6366f1" />
            <Line type="monotone" dataKey="Security" stroke="#ec4899" />
            <Line type="monotone" dataKey="UI" stroke="#14b8a6" />
            <Line type="monotone" dataKey="Mobile" stroke="#f97316" />
            <Line type="monotone" dataKey="Cloud" stroke="#8b5cf6" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  if (selectedTab === 'DOMAIN ANALYSIS') {
    return (
      <Grid container spacing={3}>
        {marketData.jobDetails.map((job, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ 
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              borderRadius: '12px',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {job.role}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Required Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {job.skills.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill} 
                        size="small" 
                        sx={{ backgroundColor: '#f1f5f9' }} 
                      />
                    ))}
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Average Experience: {job.avgExperience}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remote Work: {job.remotePercentage}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Top Locations: {job.topLocations.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return null;
};

function Trends() {
  const [selectedTab, setSelectedTab] = useState('DOMAIN ANALYSIS');
  const [loading, setLoading] = useState(false);
  const [trendingTech, setTrendingTech] = useState([]);

  useEffect(() => {
    const fetchTrendingTech = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const mockData = [
          { name: 'AI/ML', growth: 45 },
          { name: 'Web3', growth: 38 },
          { name: 'Cloud Native', growth: 32 },
          { name: 'Edge Computing', growth: 28 },
          { name: 'Cybersecurity', growth: 25 },
        ];
        setTrendingTech(mockData);
      } catch (error) {
        console.error('Error fetching trending tech:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTech();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {marketData.stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              period={stat.period}
            />
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }
          }}
        >
          <Tab value="DOMAIN ANALYSIS" label="Domain Analysis" />
          <Tab value="TRENDING TECHNOLOGIES" label="Trending Technologies" />
          <Tab value="SKILL DEMAND" label="Skill Demand" />
          <Tab value="SALARY TRENDS" label="Salary Trends" />
          <Tab value="INDUSTRY DISTRIBUTION" label="Industry Distribution" />
        </Tabs>
      </Box>

      {/* Charts Section */}
      <ChartsSection selectedTab={selectedTab} />

      {/* Trending Technologies Section */}
      {selectedTab === 'TRENDING TECHNOLOGIES' && (
        <Box sx={{ mb: 4 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              {trendingTech.map((tech, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ 
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    borderRadius: '12px',
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {tech.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon sx={{ color: '#10b981' }} />
                        <Typography variant="body2" color="text.secondary">
                          {tech.growth}% YoY Growth
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Skill Gap Analysis Cards */}
      <Grid container spacing={3}>
        {skillGapData.categories.map((category, index) => (
          <Grid item xs={12} md={6} key={index}>
            <SkillGapCard
              title={category.title}
              description={category.description}
              skills={category.skills}
              recommendations={category.recommendations}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Trends;