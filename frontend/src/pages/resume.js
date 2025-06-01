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
  Divider,
  Alert,
  LinearProgress,
  Paper,
  Chip,
  Avatar,
  Link,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Warning,
  TrendingUp,
  School,
  Work,
  Description,
  Lightbulb,
  Phone,
  Email,
  LinkedIn,
  GitHub,
  ArrowForward,
  Code,
  Assignment,
  Timeline,
  BugReport,
  Refresh,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
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

// Resume Preview component (Structured view only)
const ResumePreview = ({ resumeData }) => {
  if (!resumeData) return null;
  
  const { basicInfo, summary, workExperience, education, skills, projects } = resumeData || {};
  
  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4, backgroundColor: '#fafafa' }}>
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
            {basicInfo?.name || 'Name Not Available'}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            {basicInfo?.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">{basicInfo.phone}</Typography>
              </Box>
            )}
            {basicInfo?.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2">{basicInfo.email}</Typography>
              </Box>
            )}
            {basicInfo?.links?.map((link, index) => {
              const isLinkedIn = link.includes('linkedin');
              const isGitHub = link.includes('github');
              return (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isLinkedIn ? (
                    <LinkedIn fontSize="small" color="action" />
                  ) : isGitHub ? (
                    <GitHub fontSize="small" color="action" />
                  ) : (
                    <Link fontSize="small" color="action" />
                  )}
                  <Typography variant="body2">{isLinkedIn ? 'LinkedIn' : isGitHub ? 'GitHub' : link}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
        
        {/* Profile Summary */}
        {summary && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#475569', fontWeight: 600, borderBottom: '1px solid #e2e8f0', pb: 1 }}>
              Profile
            </Typography>
            <Typography variant="body1" sx={{ pl: 1 }}>
              {summary}
            </Typography>
          </Box>
        )}
        
        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#475569', fontWeight: 600, borderBottom: '1px solid #e2e8f0', pb: 1 }}>
              Professional Experience
            </Typography>
            
            {workExperience.map((job, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {job.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.duration}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                  {job.title} {job.location && `| ${job.location}`}
                </Typography>
                
                {job.achievements && job.achievements.length > 0 && (
                  <List dense disablePadding>
                    {job.achievements.map((achievement, idx) => (
                      <ListItem key={idx} sx={{ py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <ArrowForward sx={{ fontSize: 14 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={achievement} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            ))}
          </Box>
        )}
        
        {/* Projects */}
        {projects && projects.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#475569', fontWeight: 600, borderBottom: '1px solid #e2e8f0', pb: 1 }}>
              Technical Projects
            </Typography>
            
            {projects.map((project, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {project.name}
                </Typography>
                
                {project.description && (
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {project.description}
                  </Typography>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {project.technologies.map((tech, idx) => (
                      <Chip
                        key={idx}
                        label={tech}
                        size="small"
                        sx={{ backgroundColor: '#e2e8f0', fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#475569', fontWeight: 600, borderBottom: '1px solid #e2e8f0', pb: 1 }}>
              Education
            </Typography>
            
            {education.map((edu, index) => (
              <Box key={index} sx={{ mb: index !== education.length - 1 ? 2 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {edu.institution}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.date}
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  {edu.gpa && ` | ${edu.gpa}`}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {/* Skills */}
        {skills && (skills.technical?.length > 0 || skills.soft?.length > 0) && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#475569', fontWeight: 600, borderBottom: '1px solid #e2e8f0', pb: 1 }}>
              Technical Skills
            </Typography>
            
            {skills.technical && skills.technical.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Technical Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {skills.technical.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ backgroundColor: '#e2e8f0', fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {skills.soft && skills.soft.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Soft Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {skills.soft.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      sx={{ backgroundColor: '#f1f5f9', fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

function Resume() {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
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
      setError('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(file);
      
      // Analyze resume with Gemini AI
      const analysisResult = await analyzeResume(resumeText);
      
      setAnalysis(analysisResult);
      setCurrentTab(0); // Show resume preview first
      
      // If we got results, clear any previous error
      setError(null);
    } catch (error) {
      console.error('Resume analysis error:', error);
      setError('Failed to analyze resume. Please try again or use sample data.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleToggleSampleData = (event) => {
    setUseSampleData(event.target.checked);
  };

  const handleRetry = async () => {
    if (!fileName) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Force using sample data flag
      localStorage.setItem('USE_FALLBACK_DATA', 'true');
      
      // Get the sample analysis
      const analysisResult = await analyzeResume("");
      
      setAnalysis(analysisResult);
      setCurrentTab(0);
      setError(null);
    } catch (error) {
      console.error('Error loading sample data:', error);
      setError('Failed to load sample data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Resume Analysis
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Upload your resume for AI-powered analysis and improvement suggestions powered by Google&apos;s Gemini AI.
      </Typography>
      
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
              {fileName && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Selected file: {fileName}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

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
              Try with Sample Data
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Analyzing your resume with Gemini AI...
          </Typography>
        </Box>
      )}

      {analysis && (
        <>
          {/* Tabs for resumePreview and Analysis */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="resume analysis tabs">
              <Tab icon={<Description />} label="Resume Preview" iconPosition="start" />
              <Tab icon={<TrendingUp />} label="Analysis" iconPosition="start" />
            </Tabs>
          </Box>

          {/* Resume Preview Tab */}
          {currentTab === 0 && (
            <ResumePreview resumeData={analysis.extractedData} />
          )}

          {/* Analysis Tab */}
          {currentTab === 1 && (
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
                        <Typography variant="body1">
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
                      <Typography variant="h6" gutterBottom>
                        Skill Gaps
                      </Typography>
                      <List>
                        {analysis.skillGaps && analysis.skillGaps.map((gap, index) => (
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
                        {analysis.improvements && analysis.improvements.map((improvement, index) => (
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
                            {analysis.marketAlignment?.matchedJobs || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Top Matching Roles
                          </Typography>
                          <List dense>
                            {analysis.marketAlignment?.topRoles?.map((role, index) => (
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
                            ${analysis.marketAlignment?.salaryRange?.min?.toLocaleString() || '0'} - 
                            ${analysis.marketAlignment?.salaryRange?.max?.toLocaleString() || '0'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}

          {/* Re-Upload Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setAnalysis(null);
                setFileName(null);
                setCurrentTab(0);
                setError(null);
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