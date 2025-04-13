import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './hooks/useAuth';

// Import custom theme
import theme from './theme';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page components
import Home from './pages/Home';
import Dashboard from './pages/dashboard';
import SkillGap from './pages/skill-gap';
import Courses from './pages/courses';
import Trends from './pages/trends';
import Resume from './pages/resume';
import Profile from './pages/profile';
import Login from './pages/login';
import ProfileSection from './components/ProfileSection';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/skill-gap" element={<SkillGapAnalyzer />} />
              
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              
              <Route path="/trends" element={
                <ProtectedRoute>
                  <Trends />
                </ProtectedRoute>
              } />
              
              <Route path="/resume" element={
                <ProtectedRoute>
                  <Resume />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={<ProfileSection />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 