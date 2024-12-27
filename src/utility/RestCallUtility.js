import axios from 'axios';
import { encrypt, decrypt } from './EncryptionDecryption';
import { getAccessToken, isTokenExpired, refreshAccessToken } from './AuthUtility';

const isEncryptionEnabled = process.env.REACT_APP_IS_ENCRYPTION_ENABLED === 'true';
const userType = process.env.REACT_APP_APPLICATION_USER_TYPE;

// Axios instance to handle requests with authentication
const axiosInstance = axios.create();

// Function to get device information
const getDeviceInfo = () => {
  return {
    deviceId: navigator.userAgent, // Using user agent as a device ID
    deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    deviceName: navigator.platform,
  };
};

// Axios interceptor to check for token expiration and refresh it
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken();

    // If access token is expired, refresh it
    if (isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken(); // Attempt to refresh the token
    }

    // Retrieve device information
    const { deviceId, deviceType, deviceName } = getDeviceInfo(); // Fetching device info

    // Attach the new/updated access token and device information to the headers
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers['deviceID'] = deviceId; // Add device ID to headers
    config.headers['deviceType'] = deviceType; // Add device type to headers
    config.headers['deviceName'] = deviceName; // Add device name to headers

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
        'deviceID': getDeviceInfo().deviceId, // Add device ID to headers
        'deviceType': getDeviceInfo().deviceType, // Add device type to headers
        'deviceName': getDeviceInfo().deviceName, // Add device name to headers
        'userType' : userType,
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
        'deviceID': getDeviceInfo().deviceId, // Add device ID to headers
        'deviceType': getDeviceInfo().deviceType, // Add device type to headers
        'deviceName': getDeviceInfo().deviceName, // Add device name to headers
        'userType' : userType,
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
        'deviceID': getDeviceInfo().deviceId, // Add device ID to headers
        'deviceType': getDeviceInfo().deviceType, // Add device type to headers
        'deviceName': getDeviceInfo().deviceName, // Add device name to headers
        'userType' : userType,
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
        'deviceID': getDeviceInfo().deviceId, // Add device ID to headers
        'deviceType': getDeviceInfo().deviceType, // Add device type to headers
        'deviceName': getDeviceInfo().deviceName, // Add device name to headers
        'userType' : userType,
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
