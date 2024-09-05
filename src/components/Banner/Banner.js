import React, { useState, useEffect } from 'react';
import './Banner.css';
import image0 from '../../assets/image0.jpeg';
import image1 from '../../assets/image1.jpeg';

const banners = [
  { id: 1, src: image0, alt: 'Banner 1' },
  { id: 2, src: image1, alt: 'Banner 2' },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset the index if we reach the end (to create the infinite loop effect)
  useEffect(() => {
    if (currentIndex === banners.length) {
      const resetTimeout = setTimeout(() => {
        setIsTransitioning(false); // Disable transition briefly to reset the loop
        setCurrentIndex(0); // Reset to the first banner
      }, 1000); // Wait for transition duration

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsTransitioning(true);
  };

  return (
    <div className="banner-container">
      <div
        className="banner-slide"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 1s ease-in-out' : 'none',
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
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
    </div>
  );
};

export default Banner;
