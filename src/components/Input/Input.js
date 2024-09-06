// Input.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './Input.css'; // For custom styles

const Input = () => {
  const [inputValue, setInputValue] = useState('');

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to trigger SweetAlert2 modal
  const handleSignInClick = () => {
    Swal.fire({
      title: 'Sign In',
      html: `
        <div class="swal2-input-container">
          <input type="text" id="email" class="swal2-input" placeholder="Email">
          <input type="password" id="password" class="swal2-input" placeholder="Password">
        </div>
      `,
      confirmButtonText: 'Sign In',
      focusConfirm: false,
      preConfirm: () => {
        const email = Swal.getPopup().querySelector('#email').value;
        const password = Swal.getPopup().querySelector('#password').value;
        if (!email || !password) {
          Swal.showValidationMessage('Please enter both email and password');
        }
        return { email, password };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Email:', result.value.email);
        console.log('Password:', result.value.password);
        Swal.fire({
          icon: 'success',
          title: 'Signed In',
          text: `Welcome ${result.value.email}`
        });
      }
    });
  };

  return (
    <div>
      <button className="sign-in-button" onClick={handleSignInClick}>
        Sign In
      </button>
    </div>
  );
};

export default Input;
