import React from 'react';
import './TextSection.css';

const TextSection = ({ heading, paragraph }) => {
  console.log('Rendering TextSection Component');
  return (
    <div className="text-section-container">
      <h1 className="text-section-heading">{heading}</h1>
      <p className="text-section-paragraph">{paragraph}</p>
    </div>
  );
};

export default TextSection;
