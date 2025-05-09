import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Popover,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  TrendingUp,
  School,
  WorkOutline,
  Description,
  Person,
  Notifications,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// Mock notifications - In a real app, these would come from your backend
const mockNotifications = [
  {
    id: 1,
    title: 'New Course Recommendation',
    message: 'We found a new course that matches your interests',
    read: false,
    time: '2 hours ago'
  },
  {
    id: 2,
    title: 'Skill Gap Update',
    message: 'Your skill analysis report is ready',
    read: false,
    time: '1 day ago'
  },
  {
    id: 3,
    title: 'Job Market Alert',
    message: 'New trending skills in your field',
    read: true,
    time: '2 days ago'
  }
];

const navItems = [
  { text: 'Skill Gap', icon: <TrendingUp />, path: '/skill-gap' },
  { text: 'Courses', icon: <School />, path: '/courses' },
  { text: 'Job Trends', icon: <WorkOutline />, path: '/trends' },
  { text: 'Resume', icon: <Description />, path: '/resume' },
];

function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    handleNotificationClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: theme.palette.primary.main,
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Skill Bridge
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {user && (
            <IconButton 
              onClick={handleNotificationClick}
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications color="action" />
              </Badge>
            </IconButton>
          )}

          {user ? (
            <>
              <IconButton 
                onClick={handleMenu} 
                sx={{
                  border: '2px solid',
                  borderColor: theme.palette.primary.main,
                  padding: '4px'
                }}
              >
                <Avatar
                  alt={user.displayName || 'User'}
                  src={user.photoURL}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1.5 }
                }}
              >
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleClose}
                >
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="primary"
              variant="contained"
              component={RouterLink}
              to="/login"
              sx={{
                borderRadius: '20px',
                px: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { 
            width: 320,
            maxHeight: 400,
            mt: 1.5,
          }
        }}
      >
        <Card sx={{ boxShadow: 'none' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Notifications</Typography>
                <Button size="small" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </Stack>
            </Box>
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <ListItem 
                  key={notification.id}
                  sx={{ 
                    p: 2,
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  }}
                >
                  <ListItemIcon>
                    <CircleIcon 
                      sx={{ 
                        color: notification.read ? 'text.disabled' : 'primary.main',
                        fontSize: 12 
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={notification.title}
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {notification.time}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Popover>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            width: 280,
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar; 