import { useState, useEffect, createContext, useContext } from "react";

// Create an auth context
const AuthContext = createContext(null);

// Demo users for development/demo purposes
const DEMO_USERS = [
  {
    uid: "demo-user-1",
    email: "demo@skillbridge.com",
    password: "demo123",
    displayName: "Demo User",
    photoURL: null
  },
  {
    uid: "admin-user-1", 
    email: "admin@skillbridge.com",
    password: "admin123",
    displayName: "Admin User",
    photoURL: null
  }
];

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("skillbridge_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data", error);
        localStorage.removeItem("skillbridge_user");
      }
    }
    setLoading(false);
  }, []);

  // Sign up with email and password
  const signup = async (email, password, displayName = "") => {
    try {
      // Check if user already exists
      const existingUser = DEMO_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create new user
      const newUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: null
      };

      setUser(newUser);
      localStorage.setItem("skillbridge_user", JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      // Check demo users first
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        const { password: _, ...userWithoutPassword } = demoUser;
        setUser(userWithoutPassword);
        localStorage.setItem("skillbridge_user", JSON.stringify(userWithoutPassword));
        return userWithoutPassword;
      }

      // If not a demo user, check localStorage for registered users
      const storedUsers = JSON.parse(localStorage.getItem("skillbridge_registered_users") || "[]");
      const registeredUser = storedUsers.find(u => u.email === email && u.password === password);
      
      if (registeredUser) {
        const { password: _, ...userWithoutPassword } = registeredUser;
        setUser(userWithoutPassword);
        localStorage.setItem("skillbridge_user", JSON.stringify(userWithoutPassword));
        return userWithoutPassword;
      }

      throw new Error("Invalid email or password");
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Login with Google (mock implementation)
  const loginWithGoogle = async () => {
    try {
      // Mock Google login - in real implementation this would use Firebase
      const googleUser = {
        uid: `google-${Date.now()}`,
        email: "user@gmail.com",
        displayName: "Google User",
        photoURL: "https://via.placeholder.com/150"
      };

      setUser(googleUser);
      localStorage.setItem("skillbridge_user", JSON.stringify(googleUser));
      return googleUser;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("skillbridge_user");
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const authValues = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>;
};

// Create and export the useAuth hook as both named and default export
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth; 