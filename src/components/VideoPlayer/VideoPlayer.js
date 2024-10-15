import React from 'react';
import './VideoPlayer.css';



const VideoPlayer = () => {
    const REACT_APP_BASE_VIDEO = process.env.REACT_APP_BASE_VIDEO_URL;
    return (
        <div className="parent-container">
            <div className="video-player">
                <video controls width="100%">
                    <source src={`${REACT_APP_BASE_VIDEO}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default VideoPlayer;
