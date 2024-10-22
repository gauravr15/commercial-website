import axios from 'axios';
import { encrypt, decrypt } from './EncryptionDecryption';
import { getAccessToken, isTokenExpired, refreshAccessToken } from './AuthUtility';
import Cookies from 'js-cookie';

const isEncryptionEnabled = process.env.REACT_APP_IS_ENCRYPTION_ENABLED === 'true';

// Axios instance to handle requests with authentication
const axiosInstance = axios.create();

// Axios interceptor to check for token expiration and refresh it
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken();

    // If access token is expired, refresh it
    if (isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken(); // Attempt to refresh the token
    }

    // Attach the new/updated access token to the headers
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized POST request logic with authentication
export const makePostRequest = async (baseURL, endpoint, data) => {
  try {
    const requestTimestamp = Date.now();
    let requestBody = data;

    if (isEncryptionEnabled) {
      const encryptedData = encrypt(JSON.stringify(data), requestTimestamp.toString());
      requestBody = { request: encryptedData };
    }

    const response = await axiosInstance.post(`${baseURL}${endpoint}`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'requestTimestamp': requestTimestamp,
        'appLang': 'en',
      },
    });

    // Handle decryption if enabled
    let responseData = response.data;
    if (isEncryptionEnabled) {
      const responseTimestamp = response.headers['responsetimestamp'];
      if (responseTimestamp && responseData && responseData.response) {
        responseData = decrypt(responseData.response, responseTimestamp);
        responseData = JSON.parse(responseData);
      }
    }

    return responseData; // Return raw response data to caller
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
};

// GET request logic with authentication
export const makeGetRequest = async (baseURL, endpoint) => {
  try {
    const response = await axiosInstance.get(`${baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'appLang': 'en',
      },
    });

    return response.data; // Return raw response data to caller
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
};

// Function for making public GET requests (no token needed)
export const makePublicGetRequest = async (baseURL, endpoint) => {
  try {
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'appLang': 'en',
      },
    });

    return response.data; // Return raw response data to caller
  } catch (error) {
    console.error('Error making public API request:', error);
    throw error;
  }
};

// Function for making public POST requests (no token needed)
export const makePublicPostRequest = async (baseURL, endpoint, data) => {
  try {
    const requestTimestamp = Date.now();
    let requestBody = data;

    if (isEncryptionEnabled) {
      const encryptedData = encrypt(JSON.stringify(data), requestTimestamp.toString());
      requestBody = { request: encryptedData };
    }

    const response = await axios.post(`${baseURL}${endpoint}`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'requestTimestamp': requestTimestamp,
        'appLang': 'en',
      },
    });

    console.log('Response from API:', response.data); // Log API response

    // Handle decryption if enabled
    let responseData = response.data;
    if (isEncryptionEnabled) {
      const responseTimestamp = response.headers['responsetimestamp'];
      if (responseTimestamp && responseData && responseData.response) {
        responseData = decrypt(responseData.response, responseTimestamp);
        responseData = JSON.parse(responseData);
      }
    }

    return responseData; // Return raw response data to caller
  } catch (error) {
    console.error('Error making public POST request:', error); // Log error
    throw error;
  }
};
