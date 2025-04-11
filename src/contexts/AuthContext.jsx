import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import storageService from "../services/storageService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const savedUser = storageService.getUser();
        if (savedUser) {
          // Validate token with server
          const isValid = await authService.validateToken();
          if (isValid) {
            setCurrentUser(savedUser);
          } else {
            // Token is invalid, clear storage
            logout();
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login(email, password);
      setCurrentUser(userData);
      storageService.setUser(userData);
      storageService.setToken(userData.token);
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to login");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.register(name, email, password);
      setCurrentUser(userData);
      storageService.setUser(userData);
      storageService.setToken(userData.token);
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to register");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    storageService.clearUser();
    storageService.clearToken();
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(userData);
      setCurrentUser(updatedUser);
      storageService.setUser(updatedUser);
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to update profile");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
