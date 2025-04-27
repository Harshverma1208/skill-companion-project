import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting email login...', email);
    try {
      const userCredential = await login(email, password);
      console.log('Login successful, user:', userCredential);
      const token = await userCredential.getIdToken();
      console.log('Got ID token:', token);
      localStorage.setItem('user', JSON.stringify({ token }));
      console.log('Token stored in localStorage');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Attempting Google login...');
    try {
      const userCredential = await loginWithGoogle();
      console.log('Google login successful, user:', userCredential);
      const token = await userCredential.getIdToken();
      console.log('Got Google ID token:', token);
      localStorage.setItem('user', JSON.stringify({ token }));
      console.log('Google token stored in localStorage');
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to access all Skill Bridge features
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleEmailLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
            >
              Sign In
            </Button>
          </form>

          <Box sx={{ my: 3 }}>
            <Divider>OR</Divider>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login; 