import React from 'react';
import './ImageComponent.css'; // Import the CSS for styling
import userImage from '../../assets/userImage.png'; // Import the image

const ImageComponent = () => {
  return (
    <div className="profile-image-container">
      <img src={userImage} alt="User Profile" className="profile-image" />
    </div>
  );
};

export default ImageComponent;
