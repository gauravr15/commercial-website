import { jwtDecode } from 'jwt-decode'; // Named import

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

// Retrieve token from localStorage
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

// Check if the token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;  // If no token exists, consider it expired

  const decoded = jwtDecode(token); // Decode the JWT
  const expiryTime = decoded.exp * 1000; // Convert expiration time from seconds to milliseconds
  const currentTime = Date.now(); // Current timestamp

  return currentTime > expiryTime; // Return true if the token is expired
};

// Decode the JWT to extract the customer ID (sub)
export const getCustomerIdFromToken = () => {
  const token = getToken();
  if (token) {
    const decoded = jwtDecode(token);
    return decoded.sub; // This is your customerId
  }
  return null;
};

// Clear the token from localStorage
export const clearToken = () => {
  localStorage.removeItem('accessToken');
};
