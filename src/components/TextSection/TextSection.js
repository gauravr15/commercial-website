// src/components/TextSection/TextSection.js
import React, { useEffect, useState } from 'react';
import './TextSection.css';

const TextSection = ({ heading: initialHeading, paragraph: initialParagraph, apiUrl, requestBody }) => {
  const [heading, setHeading] = useState('Welcome');
  const [paragraph, setParagraph] = useState('This is a sample paragraph. It will be replaced with data fetched from the backend.');

  // Fetch the heading and paragraph from the backend
  // Uncomment and adjust the URL and request method as needed
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (apiUrl) {
          const response = await fetch(apiUrl, {
            method: 'POST', // Use GET or POST based on your API
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody || {}),
          });
          const data = await response.json();
          setHeading(data.heading);
          setParagraph(data.paragraph);
        }
      } catch (error) {
        console.error('Error fetching text section data:', error);
      }
    };

    fetchData();
  }, [apiUrl, requestBody]);
  */

  return (
    <div className="text-section-container">
      <h1 className="text-section-heading">{heading}</h1>
      <p className="text-section-paragraph">{paragraph}</p>
    </div>
  );
};

export default TextSection;
