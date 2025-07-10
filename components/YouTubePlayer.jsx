"use client";

import React from "react";

const YouTubePlayer = ({ videoId }) => {
  return (
    <div className="aspect-w-16 aspect-h-9 w-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-xl shadow-lg"
      ></iframe>
    </div>
  );
};

export default YouTubePlayer;
