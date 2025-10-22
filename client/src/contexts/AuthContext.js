import React, { createContext, useContext, useState, useEffect } from 'react';
import serverAPI from '../api/server';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Verify token is still valid by making a request
        const result = await serverAPI.getDashboardStats();
        if (result.success) {
          setIsAuthenticated(true);
          // Get user info from token (you might want to decode JWT here)
          const userInfo = serverAPI.getAdminInfo();
          setUser(userInfo);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await serverAPI.login(email, password);
      
      if (result.success && result.token) {
        setIsAuthenticated(true);
        setUser(result.user);
        
        // Store additional user info
        localStorage.setItem('adminUsername', result.user.name);
        localStorage.setItem('adminRole', result.user.role);
        
        return { success: true, user: result.user };
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    serverAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await serverAPI.register(userData);
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const result = await serverAPI.requestPasswordReset(email);
      return result;
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const result = await serverAPI.resetPassword(token, password);
      return result;
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;




