import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Chip,
  Stack,
  Card,
  CardContent,
  IconButton,
  Grid,
  Container,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

const ProfileSection = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Form States
  const [newSkill, setNewSkill] = useState({ name: '', rating: 0 });
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });
  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
  });

  // Add new state for settings
  const [openSettings, setOpenSettings] = useState(false);
  const [settings, setSettings] = useState({
    showRatings: true,
    makeProfilePublic: false,
    enableNotifications: true,
    darkMode: false,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
    // Reset form states
    setNewSkill({ name: '', rating: 0 });
    setNewExperience({ title: '', company: '', startDate: '', endDate: '', description: '' });
    setNewEducation({ degree: '', institution: '', startDate: '', endDate: '', gpa: '' });
    setNewCertification({ name: '', issuer: '', date: '', expiryDate: '' });
  };

  const handleAddSkill = () => {
    if (newSkill.name) {
      setSkills([...skills, newSkill]);
      handleCloseDialog();
    }
  };

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      setExperiences([...experiences, newExperience]);
      handleCloseDialog();
    }
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setEducation([...education, newEducation]);
      handleCloseDialog();
    }
  };

  const handleAddCertification = () => {
    if (newCertification.name && newCertification.issuer) {
      setCertifications([...certifications, newCertification]);
      handleCloseDialog();
    }
  };

  const handleDelete = (index, type) => {
    switch (type) {
      case 'skill':
        setSkills(skills.filter((_, i) => i !== index));
        break;
      case 'experience':
        setExperiences(experiences.filter((_, i) => i !== index));
        break;
      case 'education':
        setEducation(education.filter((_, i) => i !== index));
        break;
      case 'certification':
        setCertifications(certifications.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  const handleSettingsChange = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const renderDialog = () => {
    switch (dialogType) {
      case 'skill':
        return (
          <DialogContent>
            <TextField
              fullWidth
              label="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Typography component="legend">Proficiency Level</Typography>
              <Rating
                value={newSkill.rating}
                onChange={(_, value) => setNewSkill({ ...newSkill, rating: value })}
              />
            </Box>
          </DialogContent>
        );

      case 'experience':
        return (
          <DialogContent>
            <TextField
              fullWidth
              label="Job Title"
              value={newExperience.title}
              onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Company"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={newExperience.endDate}
              onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              margin="normal"
            />
          </DialogContent>
        );

      case 'education':
        return (
          <DialogContent>
            <TextField
              fullWidth
              label="Degree"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Institution"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={newEducation.startDate}
              onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={newEducation.endDate}
              onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="GPA"
              value={newEducation.gpa}
              onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
              margin="normal"
            />
          </DialogContent>
        );

      case 'certification':
        return (
          <DialogContent>
            <TextField
              fullWidth
              label="Certification Name"
              value={newCertification.name}
              onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Issuing Organization"
              value={newCertification.issuer}
              onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Issue Date"
              type="date"
              value={newCertification.date}
              onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={newCertification.expiryDate}
              onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (tabValue) {
      case 0: // Skills & Experience
        return (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Skills
                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={() => handleOpenDialog('skill')}
                >
                  Add Skill
                </Button>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {skill.name}
                        <Rating value={skill.rating} size="small" readOnly sx={{ ml: 1 }} />
                      </Box>
                    }
                    onDelete={() => handleDelete(index, 'skill')}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Experience
                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={() => handleOpenDialog('experience')}
                >
                  Add Experience
                </Button>
              </Typography>
              <Grid container spacing={2}>
                {experiences.map((exp, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{exp.title}</Typography>
                          <IconButton onClick={() => handleDelete(index, 'experience')}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography color="textSecondary">{exp.company}</Typography>
                        <Typography variant="body2">
                          {exp.startDate} - {exp.endDate}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {exp.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );

      case 1: // Education & Certifications
        return (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Education
                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={() => handleOpenDialog('education')}
                >
                  Add Education
                </Button>
              </Typography>
              <Grid container spacing={2}>
                {education.map((edu, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{edu.degree}</Typography>
                          <IconButton onClick={() => handleDelete(index, 'education')}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography color="textSecondary">{edu.institution}</Typography>
                        <Typography variant="body2">
                          {edu.startDate} - {edu.endDate}
                        </Typography>
                        <Typography variant="body2">GPA: {edu.gpa}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Certifications
                <Button
                  variant="contained"
                  size="small"
                  sx={{ ml: 2 }}
                  onClick={() => handleOpenDialog('certification')}
                >
                  Add Certification
                </Button>
              </Typography>
              <Grid container spacing={2}>
                {certifications.map((cert, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{cert.name}</Typography>
                          <IconButton onClick={() => handleDelete(index, 'certification')}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography color="textSecondary">{cert.issuer}</Typography>
                        <Typography variant="body2">
                          Issued: {cert.date}
                        </Typography>
                        <Typography variant="body2">
                          Expires: {cert.expiryDate}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderSettings = () => {
    return (
      <Dialog open={openSettings} onClose={() => setOpenSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showRatings}
                  onChange={() => handleSettingsChange('showRatings')}
                />
              }
              label="Show Skill Ratings"
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.makeProfilePublic}
                  onChange={() => handleSettingsChange('makeProfilePublic')}
                />
              }
              label="Make Profile Public"
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableNotifications}
                  onChange={() => handleSettingsChange('enableNotifications')}
                />
              }
              label="Enable Notifications"
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={() => handleSettingsChange('darkMode')}
                />
              }
              label="Dark Mode"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ width: '100%', position: 'relative' }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Skills & Experience" />
            <Tab label="Education & Certifications" />
          </Tabs>
          <IconButton 
            onClick={() => setOpenSettings(true)}
            sx={{ 
              position: 'absolute',
              right: 0,
              top: 0
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        <Card sx={{ mb: 4, p: 3 }}>
          {renderContent()}
        </Card>

        {/* Existing Dialog for adding items */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Add {dialogType?.charAt(0).toUpperCase() + dialogType?.slice(1)}
          </DialogTitle>
          {renderDialog()}
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={() => {
                switch (dialogType) {
                  case 'skill':
                    handleAddSkill();
                    break;
                  case 'experience':
                    handleAddExperience();
                    break;
                  case 'education':
                    handleAddEducation();
                    break;
                  case 'certification':
                    handleAddCertification();
                    break;
                  default:
                    break;
                }
              }}
              variant="contained"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Settings Dialog */}
        {renderSettings()}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {settings.makeProfilePublic ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <VisibilityIcon fontSize="small" />
              Public Profile
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <VisibilityOffIcon fontSize="small" />
              Private Profile
            </Box>
          )}
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfileSection; 