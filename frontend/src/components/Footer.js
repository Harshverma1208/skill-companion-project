import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  KeyboardArrowRight,
  Close as CloseIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleEmailClick = () => {
    setOpenEmailDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEmailDialog(false);
    setEmailData({ name: '', email: '', message: '' });
  };

  const handleSendEmail = () => {
    const { name, email, message } = emailData;
    const mailtoLink = `mailto:harshgverma2004@gmail.com?subject=Message from ${name} (${email})&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
    handleCloseDialog();
    setSnackbar({
      open: true,
      message: 'Opening your email client...',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: theme.palette.background.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2,
              }}
            >
              Skill Bridge
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Empowering careers through skill development and market insights. Join us in building the future of professional growth.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <Twitter />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link
                href="/"
                underline="none"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Home
              </Link>
              <Link
                href="/courses"
                underline="none"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Explore Courses
              </Link>
              <Link
                href="/resume"
                underline="none"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Resume Analyzer
              </Link>
              <Link
                href="/skill-gap"
                underline="none"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                Skill Analysis
              </Link>
            </Stack>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Me
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Have questions or suggestions? Feel free to reach out!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Email />}
              onClick={handleEmailClick}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                py: 1,
              }}
            >
              Send Email
            </Button>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8 }}
        >
          © {new Date().getFullYear()} Skill Bridge. Built with ❤️ by Harsh
        </Typography>
      </Container>

      {/* Email Dialog */}
      <Dialog
        open={openEmailDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: 'glassmorphic',
          elevation: 0,
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Send Email
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Your Name"
              fullWidth
              value={emailData.name}
              onChange={(e) => setEmailData({ ...emailData, name: e.target.value })}
              required
            />
            <TextField
              label="Your Email"
              type="email"
              fullWidth
              value={emailData.email}
              onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
              required
            />
            <TextField
              label="Message"
              multiline
              rows={4}
              fullWidth
              value={emailData.message}
              onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            endIcon={<KeyboardArrowRight />}
            disabled={!emailData.name || !emailData.email || !emailData.message}
            sx={{ borderRadius: 2 }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer; 