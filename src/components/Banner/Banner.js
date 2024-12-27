import React, { useState, useEffect } from 'react';
import { makePublicGetRequest } from '../../utility/RestCallUtility'; // Import the public API request function
import './Banner.css';
import NoBanner from '../../assets/NoBanner.png'; // Import the fallback banner image

const Banner = () => {
  const [banners, setBanners] = useState([]); // Store fetched banners
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Store error messages

  const BANNER_IMAGE_BASE_URL = process.env.REACT_APP_BANNER_IMAGE_BASE_URL;

  // Fetch banner images from the backend using the public request function
  useEffect(() => {
    const fetchBanners = async () => {
      console.log('Fetching banners...');
      try {
        const response = await makePublicGetRequest(BANNER_IMAGE_BASE_URL, '/banners'); // Use public request

        // Validate response based on ApiResponseDTO format
        const { statusCode, message, data } = response;

        if (statusCode >= 2000) {
          if (Array.isArray(data)) {
            // Convert byte arrays to base64 strings
            const images = data.map((imageByteArray) => {
              const base64String = `data:image/jpeg;base64,${imageByteArray}`;
              return { src: base64String, alt: 'Banner Image' }; // Replace 'Banner Image' with actual alt text if available
            });

            setBanners(images); // Set banner images
            setErrorMessage(''); // Clear any error message
          } else {
            console.error('Invalid data format received');
            setErrorMessage('Invalid data format received from API.');
          }
        } else {
          console.error('API Error:', message); // Log the API error message
          setErrorMessage(message); // Display the API error message
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setErrorMessage('Failed to fetch banners. Please try again later.');
      }
    };

    fetchBanners();
  }, [BANNER_IMAGE_BASE_URL]);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Reset the index if we reach the end (to create the infinite loop effect)
  useEffect(() => {
    if (currentIndex === banners.length) {
      const resetTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 1000); // Wait for transition duration

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, banners.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsTransitioning(true);
  };

  return (
    <div className="banner-container">
      {errorMessage ? (
        <p className="error-message">{errorMessage}</p>
      ) : banners.length > 0 ? (
        <>
          <div
            className="banner-slide"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning ? 'transform 1s ease-in-out' : 'none',
            }}
          >
            {banners.map((banner, index) => (
              <div
                key={index}
                className="banner-item"
                style={{ backgroundImage: `url(${banner.src})` }}
                alt={banner.alt}
              />
            ))}

            {/* Duplicate first image for seamless transition */}
            <div
              className="banner-item"
              style={{ backgroundImage: `url(${banners[0].src})` }}
              alt={banners[0].alt}
            />
          </div>
          <div className="banner-dots">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex % banners.length ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </>
      ) : (
        // Display fallback banner image when no banners are available
        <div className="fallback-banner">
          <img src={NoBanner} alt="Fallback Banner" className="fallback-banner-img" />
        </div>
      )}
    </div>
  );
};

export default Banner;
