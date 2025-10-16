// YoutubePlayer/YouTubePlayer.jsx
import React from 'react';

const YouTubePlayer = ({ videoUrl }) => {
    const extractVideoId = (url) => {
        const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[1].length === 11 ? match[1] : null;
    };

    const videoId = extractVideoId(videoUrl);
    if (!videoId) return <div>No Video</div>;

    return (
        <div>
            <iframe title="YouTube Video" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen />
        </div>
    );
};

export default YouTubePlayer;
