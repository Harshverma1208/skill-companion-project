import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#818CF8",
      main: "#6366F1",
      dark: "#4F46E5",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#F472B6",
      main: "#EC4899",
      dark: "#DB2777",
      contrastText: "#ffffff",
    },
    accent: {
      purple: "#8B5CF6",
      blue: "#3B82F6",
      teal: "#14B8A6",
      orange: "#F97316",
      pink: "#EC4899",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
      gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
      glass: "rgba(255, 255, 255, 0.9)",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
      accent: "#6366F1",
    },
    divider: "rgba(148, 163, 184, 0.12)",
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      backgroundImage: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
    },
    h2: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.7,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1200px)": {
            maxWidth: 1200,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(99, 102, 241, 0.15)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
          "&:hover": {
            background: "linear-gradient(135deg, #818CF8 0%, #6366F1 100%)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: alpha("#FFFFFF", 0.9),
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: "none",
          "&.glassmorphic": {
            background: alpha("#FFFFFF", 0.7),
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha("#FFFFFF", 0.8),
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            },
            "&.Mui-focused": {
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: alpha("#1E293B", 0.95),
          backdropFilter: "blur(8px)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: "0.875rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.gradient": {
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            color: "#FFFFFF",
          },
        },
      },
    },
  },
});

export default theme;
