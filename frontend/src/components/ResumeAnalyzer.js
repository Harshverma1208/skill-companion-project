import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [showJobMatch, setShowJobMatch] = useState(false);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setError(null);
      await analyzeResume(uploadedFile);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const analyzeResume = async (resumeFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);

      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
    } catch (err) {
      setError('Error analyzing resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderScoreCircle = (score, label, color) => (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress variant="determinate" value={100} size={80} sx={{ color: '#f0f0f0' }} />
        <CircularProgress
          variant="determinate"
          value={score}
          size={80}
          sx={{
            color: color,
            position: 'absolute',
            left: 0,
          }}
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

  const renderAnalysis = () => (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Overview
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {renderScoreCircle(analysis.overallScore, 'Overall Score', '#2196f3')}
                {renderScoreCircle(analysis.skillsMatch, 'Skills Match', '#9c27b0')}
                {renderScoreCircle(analysis.experience, 'Experience', '#00c853')}
                {renderScoreCircle(analysis.education, 'Education', '#f44336')}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Missing Critical Skills
              </Typography>
              <List>
                {analysis.missingSkills.map((skill, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={skill.skill}
                      secondary={`Priority: ${skill.priority} | Relevance: ${skill.relevance}%`}
                    />
                    <Chip
                      label={skill.priority}
                      color={skill.priority === 'High' ? 'error' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recommended Jobs
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowJobMatch(true)}
                >
                  View All
                </Button>
              </Box>
              <List>
                {analysis.recommendedJobs.slice(0, 2).map((job, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={job.title}
                      secondary={`Match Score: ${job.matchScore}% | ${job.salary}`}
                    />
                    <Chip
                      label={`${job.matchScore}% Match`}
                      color={job.matchScore > 85 ? 'success' : 'primary'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={showJobMatch}
        onClose={() => setShowJobMatch(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detailed Job Matches</DialogTitle>
        <DialogContent>
          <List>
            {analysis.recommendedJobs.map((job, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">{job.title}</Typography>
                      <Chip
                        label={`${job.matchScore}% Match`}
                        color={job.matchScore > 85 ? 'success' : 'primary'}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Salary Range: {job.salary}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {job.requiredSkills.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJobMatch(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Resume Analysis
      </Typography>
      
      {!file && !loading && (
        <Card sx={{ mt: 2, p: 3, textAlign: 'center' }}>
          <CardContent>
            <input
              accept="application/pdf"
              style={{ display: 'none' }}
              id="resume-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="resume-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                size="large"
              >
                Upload Resume
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Supported format: PDF
            </Typography>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {analysis && !loading && renderAnalysis()}
    </Box>
  );
};

export default ResumeAnalyzer; 