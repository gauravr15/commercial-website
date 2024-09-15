import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = () => {
    return (
        <div className="parent-container">
            <div className="video-player">
                <video controls width="100%">
                    <source src="http://192.168.29.109:8080/video" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default VideoPlayer;
