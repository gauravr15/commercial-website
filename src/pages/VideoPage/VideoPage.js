// src/pages/VideoPage/VideoPage.js
import React from 'react';
import Header from '../../components/Header/Header'; // Adjust the import path based on your project structure
import './VideoPage.css'; // Optional: CSS file for styling

const VideoPage = () => {
  return (
    <div className="video-page">
      <Header /> {/* Add the Header component here */}
      <h1>Video Thumbnails</h1>
      <p>Loading video thumbnails...</p> {/* Placeholder text */}
      <div className="video-thumbnails">
        {/* Simulated thumbnails */}
        {[1, 2, 3, 4, 5].map((video) => (
          <div key={video}>Thumbnail {video}</div> // Simulated thumbnail
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
