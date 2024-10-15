import { jwtDecode } from 'jwt-decode'; // Named import

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

// Retrieve token from localStorage
export const getToken = () => {
  return localStorage.getItem('accessToken');
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
