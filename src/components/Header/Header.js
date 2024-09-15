import React, { useState, useEffect, useRef } from 'react';
import SignInModal from '../SignInModal/SignInModal'; // Import the SignInModal component
import Burger from '../Burger/Burger'; // Import the Burger component
import './Header.css';
import logo from '../../assets/logo.png'; // Import the logo image

const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
          <div
            className={`search-container ${isExpanded ? 'expanded' : ''}`}
          >
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
                <button
                  className="dropdown-item"
                  onClick={openModal} // Open the modal on click
                >
                  Login
                </button>
                <button className="dropdown-item">
                  Profile
                </button>
                <button className="dropdown-item">
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Render the modal */}
      {isModalOpen && <SignInModal onClose={closeModal} />}
    </>
  );
};

export default Header;
