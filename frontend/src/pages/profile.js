import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Tab,
  Tabs,
  Switch,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  School,
  Work,
  Badge,
  Settings,
  Notifications,
  Security,
  Save,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { userAPI } from '../services/api';

function TabPanel({ children, value, index }) {
  return value === index && <Box sx={{ py: 3 }}>{children}</Box>;
}

function Profile() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 3 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    title: '',
    location: '',
    about: '',
    skills: [],
    education: [],
    experience: [],
    certifications: [],
    preferences: {
      notifications: true,
      emailUpdates: true,
      publicProfile: false,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProfile();
        console.log('Profile data:', response.data);
        // For now, keep using sample data
        setUserData({
          name: 'John Doe',
          email: 'john.doe@example.com',
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          about: 'Passionate software engineer with 5+ years of experience in full-stack development.',
          skills: [
            { name: 'React', proficiency: 5 },
            { name: 'Node.js', proficiency: 4 },
            { name: 'Python', proficiency: 3 },
            { name: 'AWS', proficiency: 4 },
          ],
          education: [
            {
              degree: 'M.S. Computer Science',
              school: 'Stanford University',
              year: '2018-2020',
            },
            {
              degree: 'B.S. Computer Science',
              school: 'UC Berkeley',
              year: '2014-2018',
            },
          ],
          experience: [
            {
              title: 'Senior Software Engineer',
              company: 'Tech Corp',
              duration: '2020-Present',
              description: 'Leading frontend development team and architecting scalable solutions.',
            },
            {
              title: 'Software Engineer',
              company: 'StartUp Inc',
              duration: '2018-2020',
              description: 'Full-stack development using React and Node.js.',
            },
          ],
          certifications: [
            {
              name: 'AWS Certified Solutions Architect',
              issuer: 'Amazon Web Services',
              year: '2021',
            },
            {
              name: 'Google Cloud Professional Developer',
              issuer: 'Google',
              year: '2020',
            },
          ],
          preferences: {
            notifications: true,
            emailUpdates: true,
            publicProfile: false,
          },
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    // In real app, dispatch action to save profile
    setEditMode(false);
  };

  const handleAddSkill = () => {
    if (newSkill.name) {
      setUserData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill({ name: '', proficiency: 3 });
      setSkillDialogOpen(false);
    }
  };

  const handleRemoveSkill = (skillName) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillName),
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={user?.photoURL}
              sx={{ width: 100, height: 100, mr: 3 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              {editMode ? (
                <TextField
                  fullWidth
                  label="Name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography variant="h4" gutterBottom>
                  {userData.name}
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary">
                {userData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.location}
              </Typography>
            </Box>
            <Button
              variant={editMode ? "contained" : "outlined"}
              startIcon={editMode ? <Save /> : <Edit />}
              onClick={editMode ? handleSaveProfile : handleEditToggle}
            >
              {editMode ? 'Save' : 'Edit Profile'}
            </Button>
          </Box>

          {editMode ? (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="About"
              value={userData.about}
              onChange={(e) => setUserData(prev => ({ ...prev, about: e.target.value }))}
            />
          ) : (
            <Typography variant="body1">{userData.about}</Typography>
          )}
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab icon={<Badge />} label="Skills & Experience" />
            <Tab icon={<School />} label="Education & Certifications" />
            <Tab icon={<Settings />} label="Settings" />
          </Tabs>

          {/* Skills & Experience Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Skills Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Skills</Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={() => setSkillDialogOpen(true)}
                  >
                    Add Skill
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {userData.skills.map((skill) => (
                    <Chip
                      key={skill.name}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {skill.name}
                          <Rating
                            value={skill.proficiency}
                            size="small"
                            readOnly
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      onDelete={() => handleRemoveSkill(skill.name)}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Experience Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Experience</Typography>
                  <Button startIcon={<Add />}>Add Experience</Button>
                </Box>
                <List>
                  {userData.experience.map((exp, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {exp.title} at {exp.company}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {exp.duration}
                              </Typography>
                              <Typography variant="body2">
                                {exp.description}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < userData.experience.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Education & Certifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {/* Education Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Education</Typography>
                  <Button startIcon={<Add />}>Add Education</Button>
                </Box>
                <List>
                  {userData.education.map((edu, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={edu.degree}
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {edu.school}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {edu.year}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < userData.education.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>

              {/* Certifications Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Certifications</Typography>
                  <Button startIcon={<Add />}>Add Certification</Button>
                </Box>
                <List>
                  {userData.certifications.map((cert, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={cert.name}
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {cert.issuer}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {cert.year}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < userData.certifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {/* Notification Settings */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Updates"
                      secondary="Receive updates about your skill progress"
                    />
                    <Switch
                      checked={userData.preferences.emailUpdates}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          emailUpdates: e.target.checked,
                        },
                      }))}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Course Recommendations"
                      secondary="Get notified about new course recommendations"
                    />
                    <Switch
                      checked={userData.preferences.notifications}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: e.target.checked,
                        },
                      }))}
                    />
                  </ListItem>
                </List>
              </Grid>

              {/* Privacy Settings */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Privacy
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Public Profile"
                      secondary="Make your profile visible to others"
                    />
                    <Switch
                      checked={userData.preferences.publicProfile}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          publicProfile: e.target.checked,
                        },
                      }))}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add Skill Dialog */}
      <Dialog open={skillDialogOpen} onClose={() => setSkillDialogOpen(false)}>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Skill Name"
            fullWidth
            value={newSkill.name}
            onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
          />
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Proficiency Level</Typography>
            <Rating
              value={newSkill.proficiency}
              onChange={(event, newValue) => {
                setNewSkill(prev => ({ ...prev, proficiency: newValue }));
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkillDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSkill} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile; 