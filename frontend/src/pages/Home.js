import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Stack,
  IconButton,
  Link,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  School,
  Description,
  Timeline,
  GitHub,
  LinkedIn,
  Twitter,
  Facebook,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

// Custom SkillGraph component
const SkillGraph = () => {
  const theme = useTheme();
  
  return (
    <svg
      viewBox="0 0 400 300"
      style={{
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
      }}
    >
      {/* Background circle */}
      <circle
        cx="200"
        cy="150"
        r="120"
        fill={theme.palette.primary.light}
        fillOpacity="0.1"
      />

      {/* Grid lines */}
      <g stroke={theme.palette.primary.main} strokeOpacity="0.2" strokeWidth="1">
        <circle cx="200" cy="150" r="40" fill="none" />
        <circle cx="200" cy="150" r="80" fill="none" />
        <circle cx="200" cy="150" r="120" fill="none" />
        <line x1="80" y1="150" x2="320" y2="150" />
        <line x1="200" y1="30" x2="200" y2="270" />
      </g>

      {/* Data points and connections */}
      <g>
        {/* Main skill points */}
        <circle cx="200" cy="70" r="8" fill={theme.palette.primary.main} />
        <circle cx="120" cy="190" r="8" fill={theme.palette.primary.main} />
        <circle cx="280" cy="190" r="8" fill={theme.palette.primary.main} />
        
        {/* Connection lines */}
        <path
          d={`M 200 70 L 120 190 L 280 190 Z`}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="3"
        />
        
        {/* Secondary skill points */}
        <circle cx="200" cy="130" r="5" fill={theme.palette.secondary.main} />
        <circle cx="160" cy="170" r="5" fill={theme.palette.secondary.main} />
        <circle cx="240" cy="170" r="5" fill={theme.palette.secondary.main} />
        
        {/* Animated pulse effect */}
        <circle
          cx="200"
          cy="70"
          r="12"
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          opacity="0.5"
          style={{
            animation: 'pulse 2s infinite',
          }}
        >
          <animate
            attributeName="r"
            values="8;16;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Labels */}
      <g fill={theme.palette.primary.main} fontSize="14px" fontWeight="bold">
        <text x="190" y="55" textAnchor="middle">Skills</text>
        <text x="100" y="205" textAnchor="middle">Experience</text>
        <text x="300" y="205" textAnchor="middle">Growth</text>
      </g>
    </svg>
  );
};

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      title: 'Skill Gap Analysis',
      description: 'Get detailed insights about your professional skills and areas for improvement',
      icon: <TrendingUp />,
      action: () => navigate('/skill-gap'),
      buttonText: 'Get Started'
    },
    {
      title: 'Course Recommendations',
      description: 'Personalized courses based on your skill development needs',
      icon: <School />,
      action: () => navigate('/courses'),
      buttonText: 'View Courses'
    },
    {
      title: 'Job Market Trends',
      description: 'Stay up-to-date with the latest job market trends and demands',
      icon: <Timeline />,
      action: () => navigate('/trends'),
      buttonText: 'See Trends'
    },
    {
      title: 'Resume Analysis',
      description: 'Get suggestions and improvements for your resume',
      icon: <Description />,
      action: () => navigate('/resume'),
      buttonText: 'Get Started'
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: '#ffffff',
    }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          mb: { xs: 6, md: 12 }, 
          py: { xs: 4, md: 8 },
          px: { xs: 3, md: 6 },
          borderRadius: 4,
          background: '#ffffff',
          color: theme.palette.primary.main,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    color: theme.palette.primary.main,
                    mb: 3
                  }}
                >
                  Accelerate Your Career Growth
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, lineHeight: 1.6, color: theme.palette.text.primary }}>
                  Skill Bridge helps you identify skill gaps, find relevant courses, track job market trends, and improve your resume - all in one place.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/skill-gap')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600
                    }}
                  >
                    Analyze Skills
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/courses')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600
                    }}
                  >
                    View Courses
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  transform: { xs: 'scale(0.9)', md: 'scale(1)' },
                  filter: 'drop-shadow(0px 10px 30px rgba(0,0,0,0.08))'
                }}
              >
                <SkillGraph />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: { xs: 6, md: 12 } }}>
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              mb: 6,
              fontWeight: 700,
              color: theme.palette.primary.main
            }}
          >
            Our Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={1}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    background: '#ffffff',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)'
                    }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={feature.action}
                    sx={{ 
                      alignSelf: 'flex-start',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2
                      }
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* About Section */}
        <Box sx={{ 
          mt: { xs: 6, md: 12 }, 
          mb: { xs: 4, md: 8 },
          py: { xs: 4, md: 8 },
          px: { xs: 3, md: 6 },
          borderRadius: 4,
          background: '#ffffff',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
        }}>
          <Typography variant="h4" gutterBottom>
            About Skill Bridge
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Skill Bridge is your comprehensive career development platform designed to help you navigate the ever-evolving job market. Our intelligent system combines data-driven insights with personalized recommendations to guide your professional growth.
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Learning Paths</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Customized learning journeys based on your career goals
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Skill Certification</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Get certified in the skills that matter most
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Career Support</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Ongoing guidance for your professional development
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 6, 
          bgcolor: '#fafafa',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Skill Bridge
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                Empowering careers through skill development and market insights. Join us in building the future of professional growth.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <GitHub />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <LinkedIn />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <Twitter />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <Facebook />
                </IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Links
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Link href="/skill-gap" color="inherit" sx={{ opacity: 0.7, display: 'block', textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Skill Assessment
                  </Link>
                  <Link href="/courses" color="inherit" sx={{ opacity: 0.7, display: 'block', textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Courses
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Link href="/trends" color="inherit" sx={{ opacity: 0.7, display: 'block', textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Job Trends
                  </Link>
                  <Link href="/resume" color="inherit" sx={{ opacity: 0.7, display: 'block', textDecoration: 'none', '&:hover': { opacity: 1 } }}>
                    Resume Builder
                  </Link>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Contact Us
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1, opacity: 0.7 }} />
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    support@skillbridge.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1, opacity: 0.7 }} />
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, opacity: 0.7 }} />
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    123 Tech Street, Innovation City, 12345
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Skill Bridge. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home; 