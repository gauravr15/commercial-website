import React, { useState } from 'react';
import './SignInModal.css';
import { makePublicPostRequest } from '../../utility/RestCallUtility'; // Adjusted import path for makePostRequest
import GenericModal from '../MessageModal/MessageModal'; // Adjust import path for GenericModal
import { setTokens } from '../../utility/AuthUtility'; // Import token handling functions
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Removed curly braces for jwtDecode import
import { useNavigate, useLocation } from 'react-router-dom'; // Import for redirection
import { useContext } from 'react';
import AuthContext from '../../utility/AuthContext'; // Import AuthContext

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

  const navigate = useNavigate(); // Hook for redirection
  const location = useLocation(); // Hook to access the previous route the user attempted to access
  const { logIn } = useContext(AuthContext); // Get logIn function from AuthContext

  // Reset error and close the modal
  const handleClose = () => {
    setError('');
    onClose(); // Close the modal
  };

  // Toggle between SignIn and SignUp form
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  // Handle form submission for both SignIn and SignUp
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setError(''); // Clear any existing errors

    const endpoint = isSignUp ? '/v1/signUp' : '/v1/signIn'; // Determine API endpoint
    const baseURL = isSignUp ? process.env.REACT_APP_BASE_REGISTRATION_URL : process.env.REACT_APP_BASE_PROFILE_URL; // Set base URL

    const payload = {
      email,
      mobile,
      customerType: 'CUSTOMER',
      auth: { password },
      ...(isSignUp && { firstName, lastName }), // Add extra fields for SignUp
    };

    try {
      // Make the API request using the refactored makePostRequest function
      const data = await makePublicPostRequest(baseURL, endpoint, payload);

      if (data && data.statusCode === 2000) {
        const { accessToken, refreshToken } = data.data;

        const decodedToken = jwtDecode(accessToken); // Decode access token
        const customerId = decodedToken.sub;
        Cookies.set('customerId', customerId, { expires: 1 });

        // Store tokens
        setTokens(accessToken, refreshToken);

        // Notify parent component of sign-in success
        logIn(); // Call logIn from context
        onSignInSuccess();

        // Redirect user to the page they tried to access or home
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo);

        handleClose();
      } else {
        setModalMessage(data.message || 'Unexpected error');
      }

      setShowModal(true); // Show the GenericModal with the message
    } catch (error) {
      setError(error.message);
      setModalMessage(error.message);
      setShowModal(true);
    }
  };

  return (
    <div className={`modal-overlay show`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <input type="text" id="firstName" className="modal-input" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <input type="text" id="lastName" className="modal-input" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <input type="tel" id="mobile" className="modal-input" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </>
          )}

          <input type="text" id="email" className="modal-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" id="password" className="modal-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {isSignUp && (
            <input type="password" id="confirmPassword" className="modal-input" placeholder="Confirm Password" required />
          )}

          <div className="modal-buttons">
            <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
            <button type="button" onClick={toggleForm}>
              {isSignUp ? 'Go to Sign In' : 'Go to Sign Up'}
            </button>
          </div>
        </form>

        <button className="modal-close" onClick={handleClose}>&times;</button>
      </div>

      {showModal && <GenericModal message={modalMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SignInModal;
