import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Burger.css';

const Burger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          burgerRef.current && !burgerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleHomeClick = () => {
    if (location.pathname !== "/") { // Check if not already on home page
      navigate("/"); // Navigate to home page
    }
    setIsOpen(false); // Close the menu after navigation
  };

  const handleVideosClick = () => {
    if (location.pathname !== "/videos") { // Check if not already on videos page
      navigate("/videos"); // Navigate to video page
    }
    setIsOpen(false); // Close the menu after navigation
  };

  return (
    <div className="burger-wrapper">
      {/* Burger Icon */}
      <div className="burger-icon" ref={burgerRef} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Slide-in menu */}
      <div className={`side-menu ${isOpen ? "open" : ""}`} ref={menuRef}>
        <ul>
          <li onClick={handleHomeClick}>Home</li> {/* Add click handler */}
          <li onClick={handleVideosClick}>Videos</li> {/* New Videos option */}
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
          <li>Blog</li>
        </ul>
      </div>
    </div>
  );
};

export default Burger;
