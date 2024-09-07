import React, { useState } from 'react';
import './SignInModal.css';

const SignInModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show modal with delay
  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); // Add slight delay to show modal
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Hide modal
    setTimeout(onClose, 500); // Delay closing callback to match CSS transition time
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'show' : ''}`} >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign In</h2>
        <input type="text" id="email" className="modal-input" placeholder="Email" />
        <input type="password" id="password" className="modal-input" placeholder="Password" />
        <div className="modal-buttons">
          <button onClick={() => alert('Sign In')}>Sign In</button>
          <button onClick={() => alert('Sign Up')}>Sign Up</button>
        </div>
        <button className="modal-close" onClick={handleClose}>&times;</button>
      </div>
    </div>
  );
};

export default SignInModal;
