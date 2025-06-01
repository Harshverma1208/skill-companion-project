import React, { useState, useRef, useEffect } from 'react';
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
  Alert,
  LinearProgress,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Warning,
  TrendingUp,
  School,
  Work,
  Lightbulb,
  BugReport,
  Refresh,
  PictureAsPdf,
  Analytics,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { analyzeResume, extractTextFromPDF } from '../services/geminiService';

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
  const [fileName, setFileName] = useState(null);
  const [useSampleData, setUseSampleData] = useState(() => {
    return localStorage.getItem('USE_FALLBACK_DATA') === 'true';
  });

  // Set the fallback data flag in localStorage when toggled
  useEffect(() => {
    localStorage.setItem('USE_FALLBACK_DATA', useSampleData);
  }, [useSampleData]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only. Other formats are not supported.');
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(file);
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Unable to extract text from the PDF. Please ensure the PDF contains readable text.');
      }
      
      // Analyze resume with Gemini AI
      const analysisResult = await analyzeResume(resumeText);
      
      setAnalysis(analysisResult);
      setError(null);
    } catch (error) {
      console.error('Resume analysis error:', error);
      setError(error.message || 'Failed to analyze resume. Please try again or use sample data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSampleData = (event) => {
    setUseSampleData(event.target.checked);
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Force using sample data flag
      localStorage.setItem('USE_FALLBACK_DATA', 'true');
      
      // Get the sample analysis
      const analysisResult = await analyzeResume("");
      
      setAnalysis(analysisResult);
      setError(null);
    } catch (error) {
      console.error('Error loading sample data:', error);
      setError('Failed to load sample data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setAnalysis(null);
    setFileName(null);
    setError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          AI Resume Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
          Upload your resume for comprehensive AI-powered analysis and improvement suggestions powered by Google&apos;s Gemini AI.
        </Typography>
      </Box>
      
      {/* Developer options in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <FormControlLabel
            control={
              <Switch
                checked={useSampleData}
                onChange={handleToggleSampleData}
                color="primary"
              />
            }
            label={
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                <BugReport fontSize="small" sx={{ mr: 0.5 }} />
                Use Sample Data (Dev Mode)
              </Typography>
            }
          />
        </Box>
      )}

      {/* Upload Section */}
      {!analysis && (
        <Card sx={{ mb: 4, border: '2px dashed', borderColor: 'primary.light' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
              }}
            >
              <input
                type="file"
                accept=".pdf"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <PictureAsPdf sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Upload Your Resume
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Supported format: PDF files only<br />
                Get detailed analysis including skill gaps, improvements, and market alignment
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
                startIcon={<CloudUpload />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 2 
                }}
              >
                Choose PDF File
              </Button>
              {fileName && (
                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureAsPdf color="primary" />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {fileName}
                  </Typography>
                  <Chip label="Ready to analyze" color="success" size="small" />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Refresh />}
              onClick={handleRetry}
            >
              Try Sample Data
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <LinearProgress sx={{ width: '100%', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Analytics sx={{ animation: 'pulse 1.5s infinite' }} />
                Analyzing Your Resume
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Please wait while our AI analyzes your resume...<br />
                This may take a few moments depending on the content complexity.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Resume Analysis Results
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive analysis of your resume with actionable insights
            </Typography>
          </Box>

          {/* Score Overview */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="primary" />
                Analysis Overview
              </Typography>
              <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
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

          {/* Key Insights */}
          {analysis.keyInsights && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Lightbulb sx={{ color: 'warning.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Key Insights
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {analysis.keyInsights}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Detailed Analysis */}
          <Grid container spacing={3}>
            {/* Skill Gaps */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning color="warning" />
                    Skill Gaps
                  </Typography>
                  <List>
                    {analysis.skillGaps && analysis.skillGaps.length > 0 ? analysis.skillGaps.map((gap, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Warning color={gap.importance === 'high' ? 'error' : 'warning'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={gap.skill}
                          secondary={`Importance: ${gap.importance}`}
                        />
                      </ListItem>
                    )) : (
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary="No significant skill gaps identified" />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Improvements */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" />
                    Suggested Improvements
                  </Typography>
                  <List>
                    {analysis.improvements && analysis.improvements.length > 0 ? analysis.improvements.map((improvement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary={improvement} />
                      </ListItem>
                    )) : (
                      <ListItem>
                        <ListItemText primary="No specific improvements suggested" />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Market Alignment */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work color="primary" />
                    Market Alignment
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Matched Jobs
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        {analysis.marketAlignment?.matchedJobs || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available positions
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Top Matching Roles
                      </Typography>
                      <List dense>
                        {analysis.marketAlignment?.topRoles?.map((role, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon>
                              <Work fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={role} />
                          </ListItem>
                        )) || (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText primary="Analyzing market roles..." />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Expected Salary Range
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        ${analysis.marketAlignment?.salaryRange?.min?.toLocaleString() || '0'} - 
                        ${analysis.marketAlignment?.salaryRange?.max?.toLocaleString() || '0'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Based on market data
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleAnalyzeAnother}
              startIcon={<CloudUpload />}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2 
              }}
            >
              Analyze Another Resume
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default Resume; 