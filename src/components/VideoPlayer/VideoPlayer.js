import React from 'react';
import './VideoPlayer.css';



const VideoPlayer = () => {
    const REACT_APP_BANNER_IMAGE_BASE_URL = process.env.REACT_APP_BANNER_IMAGE_BASE_URL;
    return (
        <div className="parent-container">
            <div className="video-player">
                <video controls width="100%">
                    <source src={`${REACT_APP_BANNER_IMAGE_BASE_URL+'/v1/video'}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default VideoPlayer;
