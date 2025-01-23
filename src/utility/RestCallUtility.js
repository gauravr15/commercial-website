import axios from 'axios';
import { encrypt, decrypt } from './EncryptionDecryption';
import { getAccessToken, isTokenExpired, refreshAccessToken } from './AuthUtility';
import Cookies from 'js-cookie';

const isEncryptionEnabled = process.env.REACT_APP_IS_ENCRYPTION_ENABLED === 'true';
const userType = process.env.REACT_APP_APPLICATION_USER_TYPE;

// Axios instance to handle requests with authentication
const axiosInstance = axios.create();

// Function to get device information
const getDeviceInfo = () => {
  return {
    deviceId: navigator.userAgent, 
    deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    deviceName: navigator.platform,
  };
};

// Axios interceptor to check for token expiration and refresh it
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = getAccessToken();
    const customerId = Cookies.get('customerId');
    if (customerId) {
      config.headers['customerId'] = customerId; // Add it to the request header
    }
    // If access token is expired, try to refresh it
    if (isTokenExpired(accessToken)) {
      try {
        accessToken = await refreshAccessToken(); 
        if (!accessToken) {
          // If refresh fails, reject the request and handle the redirection in calling code
          throw new Error('Unable to refresh token');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        return Promise.reject(error);
      }
    }

    // Retrieve device information
    const { deviceId, deviceType, deviceName } = getDeviceInfo(); 

    // Attach the new/updated access token and device information to the headers
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers['deviceID'] = deviceId; 
    config.headers['deviceType'] = deviceType; 
    config.headers['deviceName'] = deviceName; 

    return config;
  },
  (error) => Promise.reject(error)
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
        'deviceID': getDeviceInfo().deviceId, 
        'deviceType': getDeviceInfo().deviceType, 
        'deviceName': getDeviceInfo().deviceName, 
        'userType': userType,
      },
    });

    let responseData = response.data;
    if (isEncryptionEnabled) {
      const responseTimestamp = response.headers['responsetimestamp'];
      if (responseTimestamp && responseData && responseData.response) {
        responseData = decrypt(responseData.response, responseTimestamp);
        responseData = JSON.parse(responseData);
      }
    }

    return responseData;
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
};

export const makeMultipartPostRequest = async (baseURL, endpoint, formData, additionalHeaders = {}) => {
  try {
    const requestTimestamp = Date.now();

    // Prepare headers for multipart form-data
    const headers = {
      'Content-Type': 'multipart/form-data',
      'requestTimestamp': requestTimestamp,
      'appLang': 'en',
      'deviceID': getDeviceInfo().deviceId,
      'deviceType': getDeviceInfo().deviceType,
      'deviceName': getDeviceInfo().deviceName,
      'userType': userType,
      ...additionalHeaders,
    };

    // Optionally encrypt the formData
    let requestBody = formData;
    if (isEncryptionEnabled) {
      const encryptedData = encrypt(JSON.stringify(formData), requestTimestamp.toString());
      const encryptedFormData = new FormData();
      encryptedFormData.append('request', encryptedData);
      requestBody = encryptedFormData;
    }

    // Send the POST request
    const response = await axiosInstance.post(`${baseURL}${endpoint}`, requestBody, { headers });

    // Handle response decryption if encryption is enabled
    let responseData = response.data;
    if (isEncryptionEnabled) {
      const responseTimestamp = response.headers['responsetimestamp'];
      if (responseTimestamp && responseData && responseData.response) {
        responseData = decrypt(responseData.response, responseTimestamp);
        responseData = JSON.parse(responseData);
      }
    }

    return responseData;
  } catch (error) {
    console.error('Error making multipart API request:', error);
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
        'deviceID': getDeviceInfo().deviceId, 
        'deviceType': getDeviceInfo().deviceType, 
        'deviceName': getDeviceInfo().deviceName, 
        'userType': userType,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
};

// Function for making public GET requests (no token needed)
export const makePublicGetRequest = async (baseURL, endpoint) => {
  try {
    const requestTimestamp = Date.now();
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'requestTimestamp': requestTimestamp,
        'appLang': 'en',
        'deviceID': getDeviceInfo().deviceId, 
        'deviceType': getDeviceInfo().deviceType, 
        'deviceName': getDeviceInfo().deviceName, 
        'userType': userType,
      },
    });
    let responseData = response.data;
    if (isEncryptionEnabled) {
      const responseTimestamp = response.headers['responsetimestamp'];
      if (responseTimestamp && responseData && responseData.response) {
        responseData = decrypt(responseData.response, responseTimestamp);
        responseData = JSON.parse(responseData);
      }
    }
    console.log("response is ",responseData);
    return responseData;
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
        'deviceID': getDeviceInfo().deviceId, 
        'deviceType': getDeviceInfo().deviceType, 
        'deviceName': getDeviceInfo().deviceName, 
        'userType': userType,
      },
    });

    console.log('Response from API:', response.data); 

    let responseData = response.data;
    if (isEncryptionEnabled) {
      const responseTimestamp = response.headers['responsetimestamp'];
      if (responseTimestamp && responseData && responseData.response) {
        responseData = decrypt(responseData.response, responseTimestamp);
        responseData = JSON.parse(responseData);
      }
    }

    return responseData;
  } catch (error) {
    console.error('Error making public POST request:', error); 
    throw error;
  }
};
