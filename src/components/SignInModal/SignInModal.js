import React from 'react';
import './SignInModal.css';

const SignInModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign In</h2>
        <input type="text" id="email" className="modal-input" placeholder="Email" />
        <input type="password" id="password" className="modal-input" placeholder="Password" />
        <div className="modal-buttons">
          <button onClick={() => alert('Sign In')}>Sign In</button>
          <button onClick={() => alert('Sign Up')}>Sign Up</button>
        </div>
        <button className="modal-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default SignInModal;
