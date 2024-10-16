import React, { useState, useEffect } from 'react';
import { makeGetRequest } from '../../utility/RestCallUtility'; // Import the makeGetRequest function
import './Banner.css';

const Banner = () => {
  const [banners, setBanners] = useState([]); // Store fetched banners
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const BANNER_IMAGE_BASE_URL = process.env.REACT_APP_BANNER_IMAGE_BASE_URL;

  // Fetch banner images from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await makeGetRequest(BANNER_IMAGE_BASE_URL, '/banners');
        
        if (response && response.data && Array.isArray(response.data)) {
          // Convert byte arrays to base64 strings
          const images = response.data.map((imageByteArray) => {
            const base64String = `data:image/jpeg;base64,${imageByteArray}`;
            return { src: base64String, alt: 'Banner Image' }; // Replace 'Banner Image' with actual alt text if available
          });

          setBanners(images);
        } else {
          console.error('Invalid data received from API');
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
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
      {banners.length > 0 ? (
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
        <p>Loading banners...</p>
      )}
    </div>
  );
};

export default Banner;
