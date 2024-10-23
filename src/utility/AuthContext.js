import React, { createContext, useState, useEffect } from 'react';
import { getAccessToken, refreshAccessToken, isTokenExpired, clearTokens } from '../utility/AuthUtility';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        let accessToken = getAccessToken();
        console.log("Access Token:", accessToken); // Debugging token retrieval

        if (accessToken && isTokenExpired(accessToken)) {
          console.log("Token expired, refreshing...");
          accessToken = await refreshAccessToken(); // Refresh the access token if expired
          console.log("New Access Token after refresh:", accessToken);
        }

        if (accessToken) {
          console.log("User is authenticated");
          setIsAuthenticated(true); // Mark user as authenticated
        } else {
          console.log("No valid token, clearing tokens...");
          clearTokens(); // Clear tokens if unable to refresh
        }
      } catch (error) {
        console.error('Error checking auth status: ', error);
        clearTokens();
      } finally {
        console.log("Setting loading to false"); // Debugging end of loading state
        setLoading(false); // End loading state
      }
    };

    checkAuthStatus(); // Check authentication status on mount
  }, []);

  const logIn = () => {
    setIsAuthenticated(true); // Mark user as authenticated
  };

  const signOut = () => {
    clearTokens();
    setIsAuthenticated(false); // Reset auth state on sign-out
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
