import CryptoJS from 'crypto-js';

// Fetch the encryption key (static key) from environment variables
const staticKey = process.env.REACT_APP_ENCRYPTION_KEY;

// Generate the secret key using SHA-256 hashing
const generateKey = (combinedKey) => {
  return CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(combinedKey)).toString(CryptoJS.enc.Hex); // Use Hex format
};

// Encrypt data using AES
export const encrypt = (data, dynamicKey) => {
  if (!staticKey) {
    throw new Error('Static encryption key is not defined in environment variables');
  }

  const combinedKey = staticKey + dynamicKey;
  const secretKey = generateKey(combinedKey);

  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,  // Ensure the padding is Pkcs7
  });

  return encrypted.toString();
};

// Decrypt data using AES
export const decrypt = (encryptedData, dynamicKey) => {
  if (!staticKey) {
    throw new Error('Static encryption key is not defined in environment variables');
  }

  const combinedKey = staticKey + dynamicKey;
  const secretKey = generateKey(combinedKey);

  const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Hex.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,  // Ensure the padding is Pkcs7
  });

  return CryptoJS.enc.Utf8.stringify(decrypted);
};
