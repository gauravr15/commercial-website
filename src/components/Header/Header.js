import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.png';
import Input from '../Input/Input'; // Import the Input component

const Header = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleLogin = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  const handleSignIn = () => {
    // Handle sign in logic
    console.log('Sign In:', { username, password });
  };

  const handleSignUp = () => {
    // Handle sign up logic
    console.log('Sign Up:', { username, password });
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img src={logo} alt="Brand Logo" />
        </div>
        <div className="search-container">
          <Input
            type="text"
            placeholder="Search..."
          />
          <button className="search-btn">Search</button>
        </div>
        <button className="login-btn" onClick={toggleLogin}>
          Login
        </button>
      </div>

      {isLoginVisible && (
        <div className="login-modal">
          <div className="login-content">
            <button className="close-btn" onClick={toggleLogin}>×</button>
            <div className="login-form">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="login-submit" onClick={handleSignIn}>Sign In</button>
              <button className="login-submit" onClick={handleSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
