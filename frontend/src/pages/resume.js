import React, { useState, useRef } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Warning,
  TrendingUp,
  School,
  Work,
  Description,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

// Score indicator component
const ScoreIndicator = ({ score, label, color }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={80}
        thickness={4}
        sx={{ color }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" component="div" color="text.secondary">
          {score}%
        </Typography>
      </Box>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      {label}
    </Typography>
  </Box>
);

function Resume() {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // Sample analysis data - In real app, this would come from Redux store
  const sampleAnalysis = {
    scores: {
      overall: 85,
      skills: 80,
      experience: 90,
      education: 85,
    },
    skillGaps: [
      { skill: 'Cloud Computing', importance: 'high' },
      { skill: 'Machine Learning', importance: 'medium' },
      { skill: 'DevOps', importance: 'high' },
    ],
    improvements: [
      'Add quantifiable achievements to your work experience',
      'Include relevant certifications',
      'Highlight leadership experience',
    ],
    marketAlignment: {
      matchedJobs: 15,
      topRoles: [
        'Senior Software Engineer',
        'Full Stack Developer',
        'Tech Lead',
      ],
      salaryRange: {
        min: 90000,
        max: 140000,
      },
    },
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In real app, dispatch action to upload and analyze resume
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis(sampleAnalysis);
    } catch (error) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resume Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload your resume for AI-powered analysis and improvement suggestions.
      </Typography>

      {/* Upload Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 3,
            }}
          >
            <input
              type="file"
              accept=".pdf"
              hidden
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Upload Your Resume
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported format: PDF
            </Typography>
            <Button
              variant="contained"
              onClick={() => fileInputRef.current.click()}
              disabled={loading}
            >
              Select File
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Analyzing your resume...
          </Typography>
        </Box>
      )}

      {analysis && (
        <>
          {/* Score Overview */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Overview
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator
                    score={analysis.scores.overall}
                    label="Overall Score"
                    color="#2563eb"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator
                    score={analysis.scores.skills}
                    label="Skills Match"
                    color="#7c3aed"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator
                    score={analysis.scores.experience}
                    label="Experience"
                    color="#059669"
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ScoreIndicator
                    score={analysis.scores.education}
                    label="Education"
                    color="#dc2626"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Grid container spacing={3}>
            {/* Skill Gaps */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skill Gaps
                  </Typography>
                  <List>
                    {analysis.skillGaps.map((gap, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Warning color={gap.importance === 'high' ? 'error' : 'warning'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={gap.skill}
                          secondary={`Importance: ${gap.importance}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Improvements */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Suggested Improvements
                  </Typography>
                  <List>
                    {analysis.improvements.map((improvement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary={improvement} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Market Alignment */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Market Alignment
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Matched Jobs
                      </Typography>
                      <Typography variant="h4">
                        {analysis.marketAlignment.matchedJobs}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Top Matching Roles
                      </Typography>
                      <List dense>
                        {analysis.marketAlignment.topRoles.map((role, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Work fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={role} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Expected Salary Range
                      </Typography>
                      <Typography variant="h6">
                        ${analysis.marketAlignment.salaryRange.min.toLocaleString()} - 
                        ${analysis.marketAlignment.salaryRange.max.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}

export default Resume; 