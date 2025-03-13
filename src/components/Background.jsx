import React, { useState, useEffect } from "react";
import Profile from "./Profile";
const Background = () => {
    const defaultVideo = "https://static.moewalls.com/videos/preview/2025/night-city-pixel-preview.webm";
    const [videoUrl, setVideoUrl] = useState(sessionStorage.getItem("videoUrl") || defaultVideo);
    const [videoKey, setVideoKey] = useState(0); // Force re-render when URL changes

    useEffect(() => {
        sessionStorage.setItem("videoUrl", videoUrl);
    }, [videoUrl]);

    const handleWallpaperButtonClick = () => {
        const userInput = prompt("Go to motionbgs.com, choose a video, and paste the video URL here:");
        if (userInput && isValidVideoUrl(userInput)) {
            setVideoUrl(userInput);
            setVideoKey((prevKey) => prevKey + 1); // Update key to trigger re-render
        } else {
            alert("Invalid video URL. Please enter a valid MP4 link.");
        }
    };

    const isValidVideoUrl = (url) => {
        return url.match(/\.(mp4|webm|ogg)$/i);
    };

    return (
        <div>
            <Profile/>
            <button
                onClick={handleWallpaperButtonClick}
                className="fixed bottom-4 right-10" 
                style={{
                    zIndex: 1000,
                }}
            >
                <img src="/icon.svg"/>
            </button>
            <video
                key={videoKey} // Forces re-render
                autoPlay
                loop
                muted
                className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Background;
