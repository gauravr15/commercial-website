import React, { useState, useEffect, useRef } from 'react';
import SignInModal from '../SignInModal/SignInModal'; // Import the SignInModal component
import Burger from '../Burger/Burger'; // Import the Burger component
import './Header.css';
import logo from '../../assets/logo.png'; // Import the logo image

const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const dropdownRef = useRef(null); // Ref for the dropdown

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Prevents click from bubbling up to the document
    setIsExpanded(true);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false); // Close dropdown if click is outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add console log for debugging
  const openModal = () => {
    console.log("Opening modal"); // Debugging log
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true); // Update login status
    setIsDropdownOpen(false); // Close the dropdown
  };

  const handleSignOut = () => {
    setIsLoggedIn(false); // Reset login status
    console.log("User signed out");
    // Additional sign-out logic can go here
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="burger-logo-wrapper">
            <Burger /> {/* Burger component */}
            <div className="brand-logo-container">
              <div className="brand-logo">
                <img src={logo} alt="Brand Logo" /> {/* Use the imported logo */}
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
            <button
              className="search-button"
              onClick={handleButtonClick}
            >
              Search
            </button>
          </div>

          {/* Dropdown trigger button */}
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              className="dropdown-button"
              onClick={toggleDropdown}
            >
              &#128100;
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {!isLoggedIn ? (
                  <button
                    className="dropdown-item"
                    onClick={openModal} // Open the modal on click
                  >
                    Login
                  </button>
                ) : (
                  <>
                    <button className="dropdown-item">
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

      {/* Render the modal */}
      {isModalOpen && <SignInModal onClose={closeModal} onSignInSuccess={handleSignInSuccess} />}
    </>
  );
};

export default Header;
