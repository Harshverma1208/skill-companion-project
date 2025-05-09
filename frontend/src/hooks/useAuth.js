import { useState, useEffect, createContext, useContext } from 'react';

// Create auth context
const AuthContext = createContext({});

// Mock user for development
const MOCK_USER = {
  uid: 'mock-user-id',
  email: 'user@example.com',
  displayName: 'Demo User',
};

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For development, we'll use a mock authentication
    console.log('Using mock authentication for development');
    // Simulate auth loading
    const timer = setTimeout(() => {
      // Auto-login with mock user for development
      setUser(MOCK_USER);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock authentication methods
  const signup = async (email, password) => {
    console.log('Mock signup', { email, password });
    setUser(MOCK_USER);
    return MOCK_USER;
  };

  const login = async (email, password) => {
    console.log('Mock login', { email, password });
    setUser(MOCK_USER);
    return MOCK_USER;
  };

  const loginWithGoogle = async () => {
    console.log('Mock Google login');
    setUser(MOCK_USER);
    return MOCK_USER;
  };

  const logout = async () => {
    console.log('Mock logout');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
} 