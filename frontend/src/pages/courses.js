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
import { alpha } from '@mui/material/styles';

// Course card component
const CourseCard = ({ course, onSave }) => {
  const theme = useTheme();
  
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.12)}`,
          '& .course-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="180"
          image={course.image}
          alt={course.title}
          className="course-image"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip
            label={course.platform}
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              '& .MuiChip-label': {
                px: 1.5,
              },
            }}
          />
          <IconButton
            size="small"
            onClick={() => onSave(course)}
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
              width: 32,
              height: 32,
              '&:hover': {
                backgroundColor: alpha(theme.palette.background.paper, 1),
                transform: 'scale(1.1)',
              },
            }}
          >
            {course.saved ? (
              <Bookmark sx={{ fontSize: 18, color: theme.palette.primary.main }} />
            ) : (
              <BookmarkBorder sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            fontWeight: 700,
            lineHeight: 1.4,
            height: '2.8em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
          }}
        >
          {course.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            height: '3em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: alpha(theme.palette.text.primary, 0.7),
            lineHeight: 1.6,
          }}
        >
          {course.description}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: alpha(theme.palette.text.primary, 0.6),
            }}
          >
            <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">{course.duration}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              value={course.rating}
              precision={0.1}
              size="small"
              readOnly
              sx={{
                mr: 0.5,
                '& .MuiRating-iconFilled': {
                  color: theme.palette.warning.main,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
            >
              ({course.reviewCount.toLocaleString()})
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 3 }}>
          {course.skills.slice(0, 3).map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1.2,
                },
              }}
            />
          ))}
          {course.skills.length > 3 && (
            <Chip
              label={`+${course.skills.length - 3}`}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1.2,
                },
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: theme.palette.background.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </Typography>
          <Button
            variant="contained"
            size="medium"
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              background: theme.palette.background.gradient,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
              },
            }}
          >
            Enroll Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

function Courses() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    platform: 'all',
    difficulty: 'all',
    priceRange: 'all',
  });
  const theme = useTheme();

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
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.95)}, ${alpha(theme.palette.background.default, 1)})`,
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: theme.palette.background.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                background: theme.palette.background.gradient,
                borderRadius: '2px',
              },
            }}
          >
            Explore Courses
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha(theme.palette.text.primary, 0.7),
              fontWeight: 500,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Discover top-rated courses from leading platforms to enhance your skills
          </Typography>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={filters.platform}
                    label="Platform"
                    onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      },
                    }}
                  >
                    <MenuItem value="all">All Platforms</MenuItem>
                    <MenuItem value="udemy">Udemy</MenuItem>
                    <MenuItem value="coursera">Coursera</MenuItem>
                    <MenuItem value="edx">edX</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={filters.difficulty}
                    label="Difficulty"
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      },
                    }}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={filters.priceRange}
                    label="Price Range"
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      },
                    }}
                  >
                    <MenuItem value="all">All Prices</MenuItem>
                    <MenuItem value="free">Free</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Course Grid */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {sampleCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard course={course} onSave={handleSaveCourse} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Courses; 