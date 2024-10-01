// src/utility/RestCallUtility.js
import axios from 'axios';
import { encrypt, decrypt } from './EncryptionDecryption';

// Remove baseURL from here
const isEncryptionEnabled = process.env.REACT_APP_IS_ENCRYPTION_ENABLED === 'true';

export const makeRequest = async (baseURL, endpoint, data) => { // Accept baseURL as a parameter
  try {
    // Prepare request body with encryption if enabled
    const requestTimestamp = Date.now();
    let requestBody = data;

    if (isEncryptionEnabled) {
      const encryptedData = encrypt(JSON.stringify(data), requestTimestamp.toString());
      requestBody = { request: encryptedData };
    }

    // Make the API request using the passed baseURL
    const response = await axios.post(`${baseURL}${endpoint}`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'requestTimestamp': requestTimestamp,
        'appLang': 'en',
      },
    });

    // Log headers for debugging
    console.log('All response headers:', response.headers);

    let responseData = response.data;

    // Handle encrypted response if encryption is enabled
    if (isEncryptionEnabled) {
      const responseTimestamp = response.headers['responsetimestamp'];
      console.log('Response timestamp is:', responseTimestamp);

      if (responseTimestamp && responseData && responseData.response) {
        try {
          responseData = decrypt(responseData.response, responseTimestamp);
          console.log('Decrypted response:', responseData);
          responseData = JSON.parse(responseData); // Parse decrypted string into JSON object
        } catch (decryptError) {
          console.error('Error decrypting the response:', decryptError);
          throw new Error('Failed to decrypt response data');
        }
      } else {
        console.error('Response timestamp or encrypted data missing');
        throw new Error('Response timestamp or encrypted data missing');
      }
    }

    // Validate response structure (if encryption disabled or after decryption)
    if (isValidResponse(responseData)) {
      // Parse the response into ApiResponseDTO
      const parsedResponse = parseToDTO(responseData);

      // Log the message from the DTO for debugging
      console.log('Parsed DTO message:', parsedResponse.message);

      // Check if the response indicates a failure (e.g., statusCode is not 200)
      if (parsedResponse.statusCode !== 200) {
        console.warn('API request failed:', parsedResponse);
        return parsedResponse; // Return the valid but failed response for further handling
      }

      return parsedResponse; // Return the valid response
    } else {
      console.error('Unexpected response data format:', responseData);
      throw new Error('Unexpected response format');
    }

  } catch (error) {
    console.error('Error making API request:', error);
    throw error; // Re-throw error for the caller to handle
  }
};

// Function to validate if the response matches the ApiResponseDTO structure
const isValidResponse = (data) => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.statusCode === 'number' &&
    typeof data.status === 'string' &&
    typeof data.message === 'string' &&
    'data' in data // Ensure the 'data' field exists (can be null)
  );
};

// Function to parse raw response into ApiResponseDTO
const parseToDTO = (data) => {
  return {
    statusCode: data.statusCode,
    status: data.status,
    message: data.message,
    data: data.data, // Can be null or object, as per the API response
  };
};
