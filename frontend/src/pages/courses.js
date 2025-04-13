import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Search,
  School,
  Bookmark,
  BookmarkBorder,
  AccessTime,
  Star,
  FilterList,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

// Course card component
const CourseCard = ({ course, onSave }) => (
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
    <CardMedia
      component="img"
      height="160"
      image={course.image}
      alt={course.title}
      sx={{ objectFit: 'cover' }}
    />
    <CardContent sx={{ flexGrow: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            backgroundColor: 'white',
            color: 'text.primary',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
            border: '1px solid #e0e0e0'
          }}
        >
          {course.platform}
        </Typography>
        <IconButton size="small" onClick={() => onSave(course)}>
          {course.saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
      </Box>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontSize: '1.1rem',
          fontWeight: 600,
          lineHeight: 1.3,
          height: '2.8em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}
      >
        {course.title}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 2,
          height: '3em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}
      >
        {course.description}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
        <Typography variant="caption" color="text.secondary">
          {course.duration}
        </Typography>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Rating 
            value={course.rating} 
            precision={0.1} 
            size="small" 
            readOnly 
            sx={{ mr: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary">
            ({course.reviewCount.toLocaleString()})
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {course.skills.slice(0, 3).map((skill) => (
          <Chip
            key={skill}
            label={skill}
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: 'primary.light',
              color: 'primary.main',
              '& .MuiChip-label': {
                px: 1,
                fontSize: '0.7rem'
              }
            }}
          />
        ))}
        {course.skills.length > 3 && (
          <Chip
            label={`+${course.skills.length - 3}`}
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: 'primary.light',
              color: 'primary.main',
              '& .MuiChip-label': {
                px: 1,
                fontSize: '0.7rem'
              }
            }}
          />
        )}
      </Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 'auto'
      }}>
        <Typography 
          variant="h6" 
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          {course.price === 0 ? 'Free' : `$${course.price}`}
        </Typography>
        <Button 
          variant="contained" 
          size="small"
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 2
          }}
        >
          Enroll Now
        </Button>
      </Box>
    </CardContent>
  </Card>
);

function Courses() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    difficulty: 'all',
    priceRange: 'all',
  });

  // Sample courses data - In real app, this would come from Redux store
  const sampleCourses = [
    {
      id: 1,
      title: 'React - The Complete Guide 2024',
      description: 'Master React 18, Redux, Hooks, Router, Authentication, and best practices with hands-on projects',
      platform: 'Udemy',
      duration: '49 hours',
      rating: 4.8,
      reviewCount: 189634,
      price: 84.99,
      skills: ['React', 'JavaScript', 'Redux', 'Web Development'],
      difficulty: 'All Levels',
      saved: false,
      image: 'https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg',
      url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/'
    },
    {
      id: 2,
      title: 'Google Data Analytics Professional Certificate',
      description: 'Get professional training designed by Google and launch your career in data analytics',
      platform: 'Coursera',
      duration: '6 months',
      rating: 4.7,
      reviewCount: 56789,
      price: 49,
      skills: ['Data Analytics', 'SQL', 'R Programming', 'Tableau'],
      difficulty: 'Beginner',
      saved: false,
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/eb/d8739c87ff4ee9a57f9d4937e9c3b8/Professional-Certificate---Data-Analytics---600x600.png',
      url: 'https://www.coursera.org/professional-certificates/google-data-analytics'
    },
    {
      id: 3,
      title: 'Machine Learning Specialization',
      description: 'Build ML models with TensorFlow and master key concepts in machine learning',
      platform: 'Coursera',
      duration: '3 months',
      rating: 4.9,
      reviewCount: 45231,
      price: 49,
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'Neural Networks'],
      difficulty: 'Intermediate',
      saved: false,
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/4a/0471b0b0dd4b78bd9c1bdb1a8f2ae6/ML-Specialization-Logo-Generic-no-badge.png',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction'
    },
    {
      id: 4,
      title: 'CS50: Introduction to Computer Science',
      description: 'Harvard University\'s introduction to computer science and programming',
      platform: 'edX',
      duration: '12 weeks',
      rating: 4.9,
      reviewCount: 78456,
      price: 0,
      skills: ['Python', 'C', 'SQL', 'Computer Science'],
      difficulty: 'Beginner',
      saved: false,
      image: 'https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-ef1e27c74db2.small.png',
      url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x'
    },
    {
      id: 5,
      title: 'Google Cloud Digital Leader Training',
      description: 'Learn cloud technology fundamentals and prepare for the certification exam',
      platform: 'Google',
      duration: '20 hours',
      rating: 4.7,
      reviewCount: 12567,
      price: 0,
      skills: ['Cloud Computing', 'Google Cloud', 'Digital Transformation'],
      difficulty: 'Beginner',
      saved: false,
      image: 'https://www.cloudskillsboost.google/api/public_profiles/badges/image_path/2187254',
      url: 'https://www.cloudskillsboost.google/paths/9'
    },
    {
      id: 6,
      title: 'Full Stack Development Bootcamp',
      description: 'Complete 2024 web development bootcamp with MERN stack',
      platform: 'Udemy',
      duration: '65 hours',
      rating: 4.8,
      reviewCount: 156789,
      price: 94.99,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      difficulty: 'All Levels',
      saved: false,
      image: 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg',
      url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/'
    },
    {
      id: 7,
      title: 'AWS Certified Solutions Architect',
      description: 'Prepare for AWS Solutions Architect Associate certification',
      platform: 'edX',
      duration: '6 weeks',
      rating: 4.8,
      reviewCount: 34567,
      price: 149,
      skills: ['AWS', 'Cloud Architecture', 'DevOps'],
      difficulty: 'Intermediate',
      saved: false,
      image: 'https://prod-discovery.edx-cdn.org/media/course/image/8a7abc3b-0059-4392-9e70-42900b8538cb-6f2692a8bb13.small.png',
      url: 'https://www.edx.org/professional-certificate/aws-solutions-architect'
    },
    {
      id: 8,
      title: 'Python for Data Science and AI',
      description: 'Master Python programming for data science and artificial intelligence',
      platform: 'Coursera',
      duration: '4 weeks',
      rating: 4.6,
      reviewCount: 89123,
      price: 49,
      skills: ['Python', 'Data Science', 'AI', 'Pandas'],
      difficulty: 'Intermediate',
      saved: false,
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/14/b2d530f1ad11e7ab380fc0c6c817a8/PythonforDS.jpg',
      url: 'https://www.coursera.org/learn/python-for-applied-data-science-ai'
    },
    {
      id: 9,
      title: 'UI/UX Design Professional Certificate',
      description: 'Learn to design user experiences for products in Figma',
      platform: 'Google',
      duration: '6 months',
      rating: 4.8,
      reviewCount: 23456,
      price: 39,
      skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
      difficulty: 'Beginner',
      saved: false,
      image: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://d15cw65ipctsrr.cloudfront.net/4a/3d8b33e6914610b0bd825d7b0c5433/Professional-Certificate---UX-Design.png',
      url: 'https://www.coursera.org/professional-certificates/google-ux-design'
    }
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCourse = (course) => {
    // In real app, dispatch action to save course
    console.log('Save course:', course);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Course Recommendations
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Find the best courses to enhance your skills.
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search courses..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  name="platform"
                  value={filters.platform}
                  onChange={handleFilterChange}
                  label="Platform"
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="coursera">Coursera</MenuItem>
                  <MenuItem value="udemy">Udemy</MenuItem>
                  <MenuItem value="edx">edX</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange}
                  label="Difficulty"
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                  label="Price Range"
                >
                  <MenuItem value="all">All Prices</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Course Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sampleCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard
                course={course}
                onSave={handleSaveCourse}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Courses; 