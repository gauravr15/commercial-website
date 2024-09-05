import React from 'react';
import './Input.css'; // Optional, for custom styles

const Input = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input-field" // Optional, for custom styles
    />
  );
};

export default Input;
