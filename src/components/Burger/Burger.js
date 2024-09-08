import React, { useState, useEffect, useRef } from "react";
import './Burger.css';

const Burger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);

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
          <li>Home</li>
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
