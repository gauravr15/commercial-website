import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import SignInModal from '../SignInModal/SignInModal';
import Burger from '../Burger/Burger';
import './Header.css';
import logo from '../../assets/logo.png';

const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchClick = () => setIsExpanded(true);

  const handleButtonClick = (event) => {
    event.stopPropagation();
    setIsExpanded(true);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  const goToProfile = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="burger-logo-wrapper">
            <Burger />
            <div className="brand-logo-container">
              <div className="brand-logo">
                <img src={logo} alt="Brand Logo" />
              </div>
            </div>
          </div>
          <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              onClick={handleSearchClick}
            />
            <button className="search-button" onClick={handleButtonClick}>
              Search
            </button>
          </div>

          <div className="dropdown-container" ref={dropdownRef}>
            <button className="dropdown-button" onClick={toggleDropdown}>
              &#128100;
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {!isLoggedIn ? (
                  <button className="dropdown-item" onClick={openModal}>
                    Login
                  </button>
                ) : (
                  <>
                    <button className="dropdown-item" onClick={goToProfile}>
                      Profile
                    </button>
                    <button className="dropdown-item">
                      Settings
                    </button>
                    <button className="dropdown-item" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && (
        <SignInModal onClose={closeModal} onSignInSuccess={handleSignInSuccess} />
      )}
    </>
  );
};

export default Header;
