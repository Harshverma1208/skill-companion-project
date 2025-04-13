import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  School,
  WorkOutline,
  Description,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// Progress card component
const ProgressCard = ({ title, value, total, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.primary">
        {value}/{total}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={(value / total) * 100}
      sx={{
        height: 8,
        borderRadius: 4,
        backgroundColor: `${color}20`,
        '& .MuiLinearProgress-bar': {
          backgroundColor: color,
        },
      }}
    />
  </Box>
);

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sample data - In real app, this would come from Redux store
  const stats = {
    skillsMatched: 15,
    totalSkills: 20,
    coursesCompleted: 3,
    totalCourses: 5,
    resumeScore: 85,
  };

  const actionCards = [
    {
      title: 'Skill Gap Analysis',
      description: 'Analyze your skills and get personalized recommendations',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#2563eb',
      path: '/skill-gap',
    },
    {
      title: 'Course Recommendations',
      description: 'Find courses tailored to your skill development needs',
      icon: <School sx={{ fontSize: 40 }} />,
      color: '#7c3aed',
      path: '/courses',
    },
    {
      title: 'Job Market Trends',
      description: 'Stay updated with the latest industry requirements',
      icon: <WorkOutline sx={{ fontSize: 40 }} />,
      color: '#059669',
      path: '/trends',
    },
    {
      title: 'Resume Analysis',
      description: 'Get insights and improvements for your resume',
      icon: <Description sx={{ fontSize: 40 }} />,
      color: '#dc2626',
      path: '/resume',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.displayName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Let's continue enhancing your skills and career prospects.
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Progress
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ProgressCard
                title="Skills Matched"
                value={stats.skillsMatched}
                total={stats.totalSkills}
                color="#2563eb"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProgressCard
                title="Courses Completed"
                value={stats.coursesCompleted}
                total={stats.totalCourses}
                color="#7c3aed"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProgressCard
                title="Resume Score"
                value={stats.resumeScore}
                total={100}
                color="#059669"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <Grid container spacing={3}>
        {actionCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(card.path)}
                  sx={{ color: card.color, borderColor: card.color }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard; 