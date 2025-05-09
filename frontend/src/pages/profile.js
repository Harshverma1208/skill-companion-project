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
  LocationOn,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { userAPI } from '../services/api';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

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

  const theme = useTheme();

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
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.95)}, ${alpha(theme.palette.background.default, 1)})`,
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Profile Header */}
        <Card
          elevation={0}
          sx={{
            mb: 4,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 48px ${alpha(theme.palette.primary.main, 0.12)}`,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  position: 'relative',
                  mb: { xs: 3, sm: 0 },
                  mr: { sm: 4 },
                }}
              >
                <Avatar
                  src={user?.photoURL}
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    border: `4px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: theme.palette.background.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  <Edit sx={{ fontSize: 16, color: 'white' }} />
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Name"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background: theme.palette.background.gradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {userData.name}
                  </Typography>
                )}
                <Typography
                  variant="h6"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.8),
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {userData.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(theme.palette.text.primary, 0.6),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                  }}
                >
                  <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                  {userData.location}
                </Typography>
              </Box>
              <Button
                variant={editMode ? "contained" : "outlined"}
                startIcon={editMode ? <Save /> : <Edit />}
                onClick={editMode ? handleSaveProfile : handleEditToggle}
                sx={{
                  ml: { sm: 2 },
                  mt: { xs: 2, sm: 0 },
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  borderWidth: editMode ? 0 : 2,
                  background: editMode ? theme.palette.background.gradient : 'transparent',
                  '&:hover': {
                    borderWidth: editMode ? 0 : 2,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                  },
                }}
              >
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>

            {editMode ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="About"
                value={userData.about}
                onChange={(e) => setUserData(prev => ({ ...prev, about: e.target.value }))}
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
            ) : (
              <Typography
                variant="body1"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.8),
                  lineHeight: 1.8,
                }}
              >
                {userData.about}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Card
          elevation={0}
          sx={{
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: theme.palette.background.gradient,
                },
              }}
            >
              <Tab
                icon={<Badge sx={{ mb: 1 }} />}
                label="Skills & Experience"
                sx={{ py: 3 }}
              />
              <Tab
                icon={<School sx={{ mb: 1 }} />}
                label="Education & Certifications"
                sx={{ py: 3 }}
              />
              <Tab
                icon={<Settings sx={{ mb: 1 }} />}
                label="Settings"
                sx={{ py: 3 }}
              />
            </Tabs>

            {/* Skills & Experience Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Grid container spacing={4}>
                  {/* Skills Section */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 40,
                            height: 3,
                            borderRadius: 1.5,
                            background: theme.palette.background.gradient,
                          },
                        }}
                      >
                        Skills
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setSkillDialogOpen(true)}
                        sx={{
                          borderWidth: 2,
                          borderRadius: 2,
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Add Skill
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userData.skills.map((skill) => (
                        <Chip
                          key={skill.name}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {skill.name}
                              <Rating
                                value={skill.proficiency}
                                readOnly
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          }
                          onDelete={() => handleRemoveSkill(skill.name)}
                          sx={{
                            py: 2,
                            borderRadius: 2,
                            background: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.15),
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Experience Section */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: 40,
                          height: 3,
                          borderRadius: 1.5,
                          background: theme.palette.background.gradient,
                        },
                      }}
                    >
                      Experience
                    </Typography>
                    <List sx={{ width: '100%' }}>
                      {userData.experience.map((exp, index) => (
                        <React.Fragment key={index}>
                          <ListItem
                            sx={{
                              px: 3,
                              py: 2,
                              borderRadius: 2,
                              mb: 2,
                              background: alpha(theme.palette.background.paper, 0.6),
                              backdropFilter: 'blur(8px)',
                              transition: 'all 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'translateX(8px)',
                                background: alpha(theme.palette.background.paper, 0.8),
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {exp.title}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography
                                    variant="body1"
                                    sx={{ color: alpha(theme.palette.text.primary, 0.8) }}
                                  >
                                    {exp.company}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
                                  >
                                    {exp.duration}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mt: 1,
                                      color: alpha(theme.palette.text.primary, 0.7),
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {exp.description}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < userData.experience.length - 1 && (
                            <Divider
                              sx={{
                                my: 2,
                                borderColor: alpha(theme.palette.primary.main, 0.1),
                              }}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Education & Certifications Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Grid container spacing={4}>
                  {/* Education Section */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: 40,
                          height: 3,
                          borderRadius: 1.5,
                          background: theme.palette.background.gradient,
                        },
                      }}
                    >
                      Education
                    </Typography>
                    <List sx={{ width: '100%' }}>
                      {userData.education.map((edu, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            px: 3,
                            py: 2,
                            borderRadius: 2,
                            mb: 2,
                            background: alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateX(8px)',
                              background: alpha(theme.palette.background.paper, 0.8),
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {edu.degree}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ color: alpha(theme.palette.text.primary, 0.8) }}
                                >
                                  {edu.school}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
                                >
                                  {edu.year}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {/* Certifications Section */}
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: 40,
                          height: 3,
                          borderRadius: 1.5,
                          background: theme.palette.background.gradient,
                        },
                      }}
                    >
                      Certifications
                    </Typography>
                    <List sx={{ width: '100%' }}>
                      {userData.certifications.map((cert, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            px: 3,
                            py: 2,
                            borderRadius: 2,
                            mb: 2,
                            background: alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateX(8px)',
                              background: alpha(theme.palette.background.paper, 0.8),
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {cert.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ color: alpha(theme.palette.text.primary, 0.8) }}
                                >
                                  {cert.issuer}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: alpha(theme.palette.text.primary, 0.6) }}
                                >
                                  {cert.year}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 40,
                      height: 3,
                      borderRadius: 1.5,
                      background: theme.palette.background.gradient,
                    },
                  }}
                >
                  Preferences
                </Typography>
                <List>
                  <ListItem
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: 2,
                      mb: 2,
                      background: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive notifications about updates and activities"
                    />
                    <Switch
                      checked={userData.preferences.notifications}
                      onChange={(e) =>
                        setUserData(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: e.target.checked,
                          },
                        }))
                      }
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: 2,
                      mb: 2,
                      background: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <ListItemText
                      primary="Email Updates"
                      secondary="Receive email notifications about your progress"
                    />
                    <Switch
                      checked={userData.preferences.emailUpdates}
                      onChange={(e) =>
                        setUserData(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            emailUpdates: e.target.checked,
                          },
                        }))
                      }
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: 2,
                      mb: 2,
                      background: alpha(theme.palette.background.paper, 0.6),
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <ListItemText
                      primary="Public Profile"
                      secondary="Make your profile visible to other users"
                    />
                    <Switch
                      checked={userData.preferences.publicProfile}
                      onChange={(e) =>
                        setUserData(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            publicProfile: e.target.checked,
                          },
                        }))
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        {/* Skill Dialog */}
        <Dialog
          open={skillDialogOpen}
          onClose={() => setSkillDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(12px)',
            },
          }}
        >
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Skill Name"
              fullWidth
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                Proficiency Level
              </Typography>
              <Rating
                value={newSkill.proficiency}
                onChange={(e, newValue) => setNewSkill(prev => ({ ...prev, proficiency: newValue }))}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setSkillDialogOpen(false)}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSkill}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                background: theme.palette.background.gradient,
              }}
            >
              Add Skill
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Profile; 