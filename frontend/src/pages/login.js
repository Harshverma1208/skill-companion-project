import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Box,
  Alert,
  Stack,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import { Google as GoogleIcon, Email, Lock } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      setError(error.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@skillbridge.com");
    setPassword("demo123");
    setError("");
    setLoading(true);
    
    try {
      await login("demo@skillbridge.com", "demo123");
      navigate("/");
    } catch (error) {
      setError(error.message || "Failed to sign in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            transform: "translateY(0px)",
            opacity: 1,
            animation: "fadeIn 0.6s ease-out",
            "@keyframes fadeIn": {
              from: {
                transform: "translateY(20px)",
                opacity: 0,
              },
              to: {
                transform: "translateY(0px)",
                opacity: 1,
              },
            },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 6 },
              textAlign: "center",
              position: "relative",
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(12px)",
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: theme.palette.background.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 1,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "4px",
                  background: theme.palette.background.gradient,
                  borderRadius: "2px",
                },
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: alpha(theme.palette.text.primary, 0.8),
                fontWeight: 500,
              }}
            >
              Sign in to continue to Skill Bridge
            </Typography>

            {/* Demo Credentials Info */}
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 2,
                textAlign: "left"
              }}
            >
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Demo Credentials:
              </Typography>
              <Typography variant="body2">
                Email: demo@skillbridge.com<br />
                Password: demo123
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={handleDemoLogin}
                sx={{ mt: 1, p: 0, textTransform: "none" }}
              >
                Click here for quick demo login
              </Button>
            </Alert>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  animation: "shake 0.5s ease-in-out",
                  "@keyframes shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "10%, 30%, 50%, 70%, 90%": {
                      transform: "translateX(-2px)",
                    },
                    "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.8,
                      ),
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.9,
                        ),
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                      "&.Mui-focused": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          1,
                        ),
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                    },
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Lock color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.8,
                      ),
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.9,
                        ),
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                      "&.Mui-focused": {
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          1,
                        ),
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    background: theme.palette.background.gradient,
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                    },
                  }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <Box sx={{ position: "relative", my: 3 }}>
                  <Divider>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        px: 2,
                      }}
                    >
                      OR
                    </Typography>
                  </Divider>
                </Box>

                <Button
                  onClick={handleGoogleLogin}
                  variant="outlined"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={<GoogleIcon />}
                  sx={{
                    py: 1.8,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderWidth: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.9,
                      ),
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  }}
                >
                  {loading ? "Signing in..." : "Sign In with Google"}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.7),
                }}
              >
                Don&apos;t have an account?{" "}
                <Button
                  color="primary"
                  onClick={() => navigate("/signup")}
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: "transparent",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
