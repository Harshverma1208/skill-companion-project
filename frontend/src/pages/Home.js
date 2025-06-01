import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Stack,
  IconButton,
  Link,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  School,
  Description,
  Timeline,
  GitHub,
  LinkedIn,
  Twitter,
  Facebook,
  Email,
  Phone,
  LocationOn,
  ArrowForward,
  Analytics,
  Speed,
  EmojiObjects,
  Person,
} from "@mui/icons-material";

// Custom SkillGraph component
const SkillGraph = () => {
  const theme = useTheme();

  return (
    <svg
      viewBox="0 0 400 300"
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "auto",
      }}
    >
      {/* Background circle */}
      <circle
        cx="200"
        cy="150"
        r="120"
        fill={`url(#skillGraphGradient)`}
        fillOpacity="0.1"
      />

      {/* Grid lines */}
      <g
        stroke={theme.palette.primary.main}
        strokeOpacity="0.2"
        strokeWidth="1"
      >
        <circle cx="200" cy="150" r="40" fill="none" />
        <circle cx="200" cy="150" r="80" fill="none" />
        <circle cx="200" cy="150" r="120" fill="none" />
        <line x1="80" y1="150" x2="320" y2="150" />
        <line x1="200" y1="30" x2="200" y2="270" />
      </g>

      {/* Data points and connections */}
      <g>
        {/* Main skill points */}
        <circle cx="200" cy="70" r="8" fill={`url(#pointGradient)`} />
        <circle cx="120" cy="190" r="8" fill={`url(#pointGradient)`} />
        <circle cx="280" cy="190" r="8" fill={`url(#pointGradient)`} />

        {/* Connection lines with gradient */}
        <path
          d={`M 200 70 L 120 190 L 280 190 Z`}
          fill="none"
          stroke={`url(#lineGradient)`}
          strokeWidth="3"
        />

        {/* Secondary skill points */}
        <circle cx="200" cy="130" r="5" fill={theme.palette.secondary.main} />
        <circle cx="160" cy="170" r="5" fill={theme.palette.secondary.main} />
        <circle cx="240" cy="170" r="5" fill={theme.palette.secondary.main} />

        {/* Animated pulse effect */}
        <circle
          cx="200"
          cy="70"
          r="12"
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          opacity="0.5"
        >
          <animate
            attributeName="r"
            values="8;16;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Labels */}
      <g fill={theme.palette.text.primary} fontSize="14px" fontWeight="600">
        <text x="190" y="55" textAnchor="middle">
          Skills
        </text>
        <text x="100" y="205" textAnchor="middle">
          Experience
        </text>
        <text x="300" y="205" textAnchor="middle">
          Growth
        </text>
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="skillGraphGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.palette.primary.light} />
          <stop offset="100%" stopColor={theme.palette.primary.main} />
        </linearGradient>
        <linearGradient id="pointGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.palette.primary.light} />
          <stop offset="100%" stopColor={theme.palette.primary.main} />
        </linearGradient>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={theme.palette.primary.light} />
          <stop offset="100%" stopColor={theme.palette.primary.main} />
        </linearGradient>
      </defs>
    </svg>
  );
};

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      title: "Skill Gap Analysis",
      description:
        "Get detailed insights about your professional skills and areas for improvement",
      icon: <Analytics />,
      action: () => navigate("/skill-gap"),
      buttonText: "Get Started",
      gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    },
    {
      title: "Course Recommendations",
      description: "Personalized courses based on your skill development needs",
      icon: <School />,
      action: () => navigate("/courses"),
      buttonText: "View Courses",
      gradient: "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)",
    },
    {
      title: "Job Market Trends",
      description:
        "Stay up-to-date with the latest job market trends and demands",
      icon: <Speed />,
      action: () => navigate("/trends"),
      buttonText: "See Trends",
      gradient: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
    },
    {
      title: "Resume Analysis",
      description: "Get suggestions and improvements for your resume",
      icon: <EmojiObjects />,
      action: () => navigate("/resume"),
      buttonText: "Get Started",
      gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Courses", value: "500+" },
    { label: "Success Rate", value: "95%" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.95)}, ${alpha(theme.palette.background.default, 1)})`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: theme.palette.background.gradient,
          opacity: 0.08,
          filter: "blur(80px)",
          animation: "float 15s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "50%": { transform: "translate(-30px, 30px) rotate(180deg)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
          opacity: 0.08,
          filter: "blur(80px)",
          animation: "float2 18s ease-in-out infinite",
          "@keyframes float2": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "50%": { transform: "translate(30px, -30px) rotate(-180deg)" },
          },
        }}
      />

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{ mt: { xs: 6, md: 12 }, mb: { xs: 8, md: 15 } }}
      >
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  background: theme.palette.background.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "60px",
                    height: "4px",
                    background: theme.palette.background.gradient,
                    borderRadius: "2px",
                  },
                }}
              >
                Professional Journey
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: alpha(theme.palette.text.primary, 0.8),
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                Unlock your potential with AI-powered skill analysis,
                personalized learning paths, and real-time market insights.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/skill-gap")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    background: theme.palette.background.gradient,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/courses")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Explore Courses
                </Button>
              </Stack>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 500,
                animation: "float3 6s ease-in-out infinite",
                "@keyframes float3": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-20px)" },
                },
              }}
            >
              <SkillGraph />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 15 } }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    mb: 1,
                    background: theme.palette.background.gradient,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 15 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 8,
            background: theme.palette.background.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      background: feature.gradient,
                      width: "fit-content",
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: 32, color: "white" },
                    })}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {feature.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={feature.action}
                    sx={{
                      mt: "auto",
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
