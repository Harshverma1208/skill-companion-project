import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Autocomplete,
  Rating,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Work,
  School,
  TrendingUp,
  Compare,
  BookmarkAdd,
  Refresh,
  Info,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';

const SkillGapAnalyzer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [jobPreference, setJobPreference] = useState({
    role: '',
    experience: '',
    industry: '',
    location: '',
  });
  const [currentSkills, setCurrentSkills] = useState([]);
  const [skillLevels, setSkillLevels] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);

  const jobRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Cloud Architect',
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'E-commerce',
    'Education',
    'Manufacturing',
  ];

  const commonSkills = {
    technical: [
      'JavaScript',
      'Python',
      'React',
      'Node.js',
      'SQL',
      'AWS',
      'Docker',
      'Git',
      'TypeScript',
      'MongoDB',
    ],
    soft: [
      'Communication',
      'Problem Solving',
      'Team Collaboration',
      'Time Management',
      'Leadership',
      'Adaptability',
    ],
  };

  const handleNext = () => {
    if (activeStep === 2) {
      performAnalysis();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSkillAdd = (skill) => {
    if (!currentSkills.includes(skill)) {
      setCurrentSkills([...currentSkills, skill]);
      setSkillLevels({ ...skillLevels, [skill]: 3 });
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setCurrentSkills(currentSkills.filter((skill) => skill !== skillToRemove));
    const newSkillLevels = { ...skillLevels };
    delete newSkillLevels[skillToRemove];
    setSkillLevels(newSkillLevels);
  };

  const handleSkillLevelChange = (skill, newValue) => {
    setSkillLevels({ ...skillLevels, [skill]: newValue });
  };

  const performAnalysis = () => {
    // Mock analysis result - In a real app, this would call an API
    const mockRequiredSkills = {
      'Frontend Developer': {
        required: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Git'],
        recommended: ['Node.js', 'Jest', 'Webpack', 'GraphQL'],
      },
      'Backend Developer': {
        required: ['Node.js', 'Python', 'SQL', 'MongoDB', 'REST APIs'],
        recommended: ['Docker', 'Kubernetes', 'Redis', 'Message Queues'],
      },
      // Add more role-specific skills
    };

    const roleSkills = mockRequiredSkills[jobPreference.role] || {
      required: [],
      recommended: [],
    };

    const missingRequired = roleSkills.required.filter(
      (skill) => !currentSkills.includes(skill)
    );
    const missingRecommended = roleSkills.recommended.filter(
      (skill) => !currentSkills.includes(skill)
    );

    const skillGaps = {
      critical: missingRequired.map((skill) => ({
        skill,
        importance: 'Critical',
        gap: 100,
      })),
      recommended: missingRecommended.map((skill) => ({
        skill,
        importance: 'Recommended',
        gap: 70,
      })),
    };

    const matchScore = Math.round(
      ((roleSkills.required.length - missingRequired.length) /
        roleSkills.required.length) *
        100
    );

    setAnalysisResult({
      matchScore,
      skillGaps,
      recommendations: [
        {
          skill: missingRequired[0] || missingRecommended[0],
          course: 'Advanced Web Development',
          platform: 'Udemy',
          duration: '3 months',
        },
        {
          skill: missingRequired[1] || missingRecommended[1],
          course: 'Modern JavaScript',
          platform: 'Coursera',
          duration: '2 months',
        },
        // Add more recommendations
      ],
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Preferences
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={jobRoles}
                    value={jobPreference.role}
                    onChange={(_, newValue) =>
                      setJobPreference({ ...jobPreference, role: newValue })
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Desired Role" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    value={jobPreference.experience}
                    onChange={(e) =>
                      setJobPreference({
                        ...jobPreference,
                        experience: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={industries}
                    value={jobPreference.industry}
                    onChange={(_, newValue) =>
                      setJobPreference({ ...jobPreference, industry: newValue })
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Industry" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Preferred Location"
                    value={jobPreference.location}
                    onChange={(e) =>
                      setJobPreference({
                        ...jobPreference,
                        location: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Technical Skills
                </Typography>
                <Autocomplete
                  multiple
                  options={commonSkills.technical.filter(
                    (skill) => !currentSkills.includes(skill)
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Technical Skills"
                      placeholder="Select skills"
                    />
                  )}
                  onChange={(_, newValue) => {
                    newValue.forEach(handleSkillAdd);
                  }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Soft Skills
                </Typography>
                <Autocomplete
                  multiple
                  options={commonSkills.soft.filter(
                    (skill) => !currentSkills.includes(skill)
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Soft Skills"
                      placeholder="Select skills"
                    />
                  )}
                  onChange={(_, newValue) => {
                    newValue.forEach(handleSkillAdd);
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Proficiency Levels
              </Typography>
              <Grid container spacing={2}>
                {currentSkills.map((skill) => (
                  <Grid item xs={12} key={skill}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Chip
                          label={skill}
                          onDelete={() => handleSkillRemove(skill)}
                          sx={{ mr: 2 }}
                        />
                        <Rating
                          value={skillLevels[skill]}
                          onChange={(_, newValue) =>
                            handleSkillLevelChange(skill, newValue)
                          }
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {skillLevels[skill] === 1 && 'Beginner'}
                        {skillLevels[skill] === 2 && 'Intermediate'}
                        {skillLevels[skill] === 3 && 'Advanced'}
                        {skillLevels[skill] === 4 && 'Expert'}
                        {skillLevels[skill] === 5 && 'Master'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        );

      case 3:
        return analysisResult ? (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Match Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={analysisResult.matchScore}
                      sx={{
                        height: 20,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor:
                            analysisResult.matchScore >= 70
                              ? '#4caf50'
                              : analysisResult.matchScore >= 40
                              ? '#ff9800'
                              : '#f44336',
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="h6">
                    {analysisResult.matchScore}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Critical Skill Gaps
                    </Typography>
                    {analysisResult.skillGaps.critical.map((gap, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography>{gap.skill}</Typography>
                          <Chip
                            label="Critical"
                            size="small"
                            color="error"
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={gap.gap}
                          color="error"
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommended Skills
                    </Typography>
                    {analysisResult.skillGaps.recommended.map((gap, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography>{gap.skill}</Typography>
                          <Chip
                            label="Recommended"
                            size="small"
                            color="warning"
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={gap.gap}
                          color="warning"
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommended Courses
                    </Typography>
                    <Grid container spacing={2}>
                      {analysisResult.recommendations.map((rec, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper
                            elevation={2}
                            sx={{ p: 2, height: '100%', position: 'relative' }}
                          >
                            <Typography variant="subtitle1" gutterBottom>
                              {rec.course}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              gutterBottom
                            >
                              Platform: {rec.platform}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Duration: {rec.duration}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="primary"
                              sx={{ mt: 1 }}
                            >
                              Targets: {rec.skill}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ mt: 2 }}
                            >
                              Learn More
                            </Button>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography>Performing analysis...</Typography>
        );

      default:
        return null;
    }
  };

  const steps = [
    {
      label: 'Job Preferences',
      icon: <Work />,
    },
    {
      label: 'Current Skills',
      icon: <School />,
    },
    {
      label: 'Skill Levels',
      icon: <TrendingUp />,
    },
    {
      label: 'Analysis Results',
      icon: <Compare />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Skill Gap Analysis
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Analyze your skills and get personalized recommendations
      </Typography>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor:
                      activeStep >= index ? 'primary.main' : 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeStep >= index ? 'white' : 'grey.600',
                  }}
                >
                  {step.icon}
                </Box>
              )}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>{renderStepContent(activeStep)}</Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          endIcon={<ArrowForward />}
        >
          {activeStep === steps.length - 2 ? 'Analyze' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default SkillGapAnalyzer; 