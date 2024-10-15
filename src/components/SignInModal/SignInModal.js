import React, { useState } from 'react';
import './SignInModal.css';
import { makeRequest } from '../../utility/RestCallUtility'; // Adjust the import path
import GenericModal from '../MessageModal/MessageModal'; // Adjust the import path for the GenericModal
import { jwtDecode } from 'jwt-decode'; // Named import
import Cookies from 'js-cookie'; // Import js-cookie

const SignInModal = ({ onClose, onSignInSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle for SignIn/SignUp
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false); // State for showing the GenericModal
  const [modalMessage, setModalMessage] = useState(''); // Message to display in the GenericModal

  const handleClose = () => {
    setError(''); // Clear any errors on close
    onClose(); // Close immediately without delay
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp); // Toggle between SignIn and SignUp form
  };

  const REGISTRATION_BASE_URL = process.env.REACT_APP_BASE_REGISTRATION_URL; // Get BASE_URL for registration from environment variable
  const SIGNIN_BASE_URL = process.env.REACT_APP_BASE_PROFILE_URL; // Get BASE_URL for sign-in from environment variable

  Cookies.remove('customerId'); 
  Cookies.remove('authorizationHeader');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Reset any previous errors

    const endpoint = isSignUp ? '/v1/signUp' : '/v1/signIn'; // Set API endpoint based on form type
    const baseURL = isSignUp ? REGISTRATION_BASE_URL : SIGNIN_BASE_URL; // Choose baseURL based on the form

    const payload = {
      email,
      mobile, // Mobile is included for both sign-up and sign-in
      customerType: 'CUSTOMER', // Hardcoded customerType as 'CUSTOMER'
      auth: {
        password, // Password is now inside the auth object
      },
      ...(isSignUp && { 
        firstName, 
        lastName, 
      })
    };

    try {
      // Pass baseURL to makeRequest
      const data = await makeRequest(baseURL, endpoint, payload); // Use makeRequest to send the payload

      // Log the full response data for debugging
      console.log('API Response:', data.message);

      // Check if the response structure matches expected format
      if (data && data.statusCode !== undefined) {
        console.log('Status Code:', data.statusCode);
        console.log('Status:', data.status);
        console.log('Message:', data.message);
        console.log('Data:', data.data);

        if (data.statusCode === 2000) {
          // Decode the JWT token to get customer ID
          const decodedToken = jwtDecode(data.data.accessToken);
          console.log("decoded token", decodedToken);
          const customerId = decodedToken.sub; // Get 'sub' value
          // Store customerId in cookies with an expiration of 7 days
          Cookies.set('customerId', customerId, { expires: 1 }); // Store in cookies
          Cookies.set('authorizationHeader', data.data.accessToken, { expires: 1 }); // Store token in cookies
          onSignInSuccess(); // Notify parent component of successful sign-in
          handleClose(); // Close the modal
          return; // Exit early
        } 

        if (data.message === null) {
          // Handle failure response
          setModalMessage(data.status); // Display failure message from API
        } else {
          // Handle success response
          setModalMessage(data.message); // Update this based on your success message
        }
      } else {
        setModalMessage('Unexpected response format');
      }

      setShowModal(true); // Show the GenericModal
    } catch (error) {
      setError(error.message); // Set error message for display
      setModalMessage(error.message); // Also set modal message
      setShowModal(true); // Show the GenericModal on error
    }
  };

  return (
    <div className={`modal-overlay show`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

        {error && <p className="error-message">{error}</p>} {/* Display error message */}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <input 
                type="text" 
                id="firstName" 
                className="modal-input" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                id="lastName" 
                className="modal-input" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
              />
              <input 
                type="tel" 
                id="mobile" 
                className="modal-input" 
                placeholder="Mobile Number" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                required 
              />
            </>
          )}

          <input 
            type="text" 
            id="email" 
            className="modal-input" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            id="password" 
            className="modal-input" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          {isSignUp && (
            <input 
              type="password" 
              id="confirmPassword" 
              className="modal-input" 
              placeholder="Confirm Password" 
              required 
            />
          )}

          <div className="modal-buttons">
            <button type="submit">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <button type="button" onClick={toggleForm}>
              {isSignUp ? 'Go to Sign In' : 'Go to Sign Up'}
            </button>
          </div>
        </form>

        <button className="modal-close" onClick={handleClose}>&times;</button>
      </div>

      {/* Generic Modal for displaying messages */}
      {showModal && (
        <GenericModal 
          message={modalMessage} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default SignInModal;
