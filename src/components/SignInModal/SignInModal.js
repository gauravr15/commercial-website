import React, { useState } from 'react';
import './SignInModal.css';
import { makeRequest } from '../../utility/RestCallUtility'; // Adjust the import path
import GenericModal from '../MessageModal/MessageModal'; // Adjust the import path for the GenericModal

const SignInModal = ({ onClose }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Reset any previous errors

    const endpoint = isSignUp ? '/v1/signUp' : '/v1/signIn'; // Set API endpoint based on form type

    const payload = {
      email,
      mobile, // Add mobile to the payload for both sign-up and sign-in
      customerType: 'CUSTOMER', // Hardcoded customerType as 'CUSTOMER'
      ...(isSignUp && { 
        firstName, 
        lastName, 
        // Other fields for sign-up can go here if needed
      }),
      auth: {
        password, // Password is now inside the auth object
        isFirstTimeLogin: true, // Assuming default values for other auth fields
        isTempPassword: true,
        passwordChangeCount: 0,
        isActive: true,
        isDeleted: false,
        isTempLock: false,
        isPermLock: false,
        tempLockCount: 0,
        permLockCount: 0,
        tempLockDate: null,
        permLockDate: null
      }
    };

    try {
      const data = await makeRequest(endpoint, payload); // Use makeRequest to send the payload

      // Log the full response data for debugging
      console.log('API Response:', data.message);

      // Check if the response structure matches expected format
      if (data && data.statusCode !== undefined) {
        // Print each property to the console for debugging
        console.log('Status Code:', data.statusCode);
        console.log('Status:', data.status);
        console.log('Message:', data.message);

        if (data.message === null) {
          // Handle failure response
          setModalMessage(data.status); // Display failure message from API
        } else {
          // Handle success response here (not specified in your response)
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
