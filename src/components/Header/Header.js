import React, { useState, useEffect, useRef } from 'react';
import SignInModal from '../SignInModal/SignInModal'; // Import the SignInModal component
import './Header.css';
import logo from '../../assets/logo.png'; // Import the logo image

const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchButtonRef = useRef(null);

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Prevents click from bubbling up to the document
    setIsExpanded(true);
  };

  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target) &&
      !searchInputRef.current.contains(event.target) &&
      !searchButtonRef.current.contains(event.target)
    ) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <header className="header">
        <div className="brand-logo">
          <img src={logo} alt="Brand Logo" /> {/* Use the imported logo */}
        </div>
        <div
          className={`search-container ${isExpanded ? 'expanded' : ''}`}
          ref={searchContainerRef}
        >
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            onClick={handleSearchClick}
            ref={searchInputRef}
          />
          <button
            className="search-button"
            onClick={handleButtonClick}
            ref={searchButtonRef}
          >
            Search
          </button>
        </div>
        <button
          className="login-button"
          onClick={openModal} // Open the modal on click
        >
          Login
        </button>
      </header>
      {isModalOpen && <SignInModal onClose={closeModal} />} {/* Render the modal */}
    </>
  );
};

export default Header;
