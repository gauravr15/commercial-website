import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode version 3.1.2
import { makePublicPostRequest } from './RestCallUtility';

// Store tokens in Cookies or LocalStorage
export const setTokens = (accessToken, refreshToken) => {
  Cookies.set('accessToken', accessToken, { expires: 1 }); // Set for 1 day
  Cookies.set('refreshToken', refreshToken, { expires: 7 }); // Refresh token expires in 7 days
};

// Retrieve access token from Cookies
export const getAccessToken = () => {
  return Cookies.get('accessToken');
};

// Retrieve refresh token from Cookies
export const getRefreshToken = () => {
  return Cookies.get('refreshToken');
};

// Clear tokens from Cookies
export const clearTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

// Check if the token has expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return decodedToken.exp < currentTime; // Token expired if expiration time is less than current time
};

// Refresh the access token (example API call, adjust based on your needs)
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await makePublicPostRequest('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setTokens(accessToken, newRefreshToken); // Store new tokens
    return accessToken; // Return the new access token
  } catch (error) {
    console.error("Error refreshing access token:", error);
    clearTokens();
    return null; // Return null if the refresh token is invalid or expired
  }
};
