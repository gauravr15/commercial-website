import React, { createContext, useState, useEffect } from 'react';
import { getAccessToken, refreshAccessToken, isTokenExpired, clearTokens, setTokens } from '../utility/AuthUtility';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // First useEffect: Only for checking authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("Running authentication check...");

      try {
        let accessToken = getAccessToken();
        console.log("Access Token:", accessToken); // Log access token

        if (!accessToken) {
          console.log("No access token found in localStorage");
        }

        if (accessToken && isTokenExpired(accessToken)) {
          console.log("Token expired, refreshing...");
          accessToken = await refreshAccessToken(); // Refresh the access token if expired
          console.log("New Access Token after refresh:", accessToken);
        }

        if (accessToken) {
          console.log("User is authenticated");
          localStorage.setItem('accessToken', accessToken); // Directly set the token in localStorage
          setIsAuthenticated(true); // Mark user as authenticated
        } else {
          console.log("No valid token, clearing tokens...");
          clearTokens(); // Clear tokens if unable to refresh
          setIsAuthenticated(false); // Ensure auth status is false
        }
      } catch (error) {
        console.error('Error checking auth status: ', error);
        clearTokens();
        setIsAuthenticated(false); // Reset auth status on error
      } finally {
        console.log("Setting loading to false");
        setLoading(false); // End loading state
      }
    };

    // Log the current authentication status
    console.log("Initial authentication check running...");
    
    checkAuthStatus(); // Run authentication check once
  }, []); // Empty dependency array, so this runs only once when component mounts

  const logIn = (accessToken, refreshToken) => {
    console.log("Logging in...");
    localStorage.setItem('accessToken', accessToken); // Store access token using localStorage
    localStorage.setItem('refreshToken', refreshToken); // Store refresh token if needed
    setIsAuthenticated(true); // Mark user as authenticated
  };

  const signOut = () => {
    console.log("Signing out...");
    clearTokens();
    setIsAuthenticated(false); // Reset auth state on sign-out
  };

  console.log("Current isAuthenticated:", isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
