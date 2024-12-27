import React from 'react';
import './VideoThumbnail.css';

const VideoThumbnail = ({ video, onClick }) => {
  return (
    <div className="video-thumbnail" onClick={() => onClick(video.id)}>
      <img src={video.thumbnailUrl} alt={video.title} className="thumbnail-image" />
      <div className="thumbnail-title">{video.title}</div>
    </div>
  );
};

export default VideoThumbnail;
