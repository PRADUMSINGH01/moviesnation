"use client";

import { useState, useEffect } from "react";

const YouTubePlayer = ({
  videoId,
  title = "YouTube Video",
  autoplay = true,
  loop = true,
  controls = true,
  thumbnailQuality = "hqdefault",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Generate thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`;

  // Generate embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?${
    autoplay ? "autoplay=1&" : ""
  }${loop ? "loop=1&playlist=${videoId}&" : ""}${
    controls ? "" : "controls=0&"
  }mute=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;

  // Check if video is available
  useEffect(() => {
    if (!videoId) {
      setVideoAvailable(false);
      return;
    }

    const checkVideoAvailability = async () => {
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );

        if (!response.ok) {
          setVideoAvailable(false);
        } else {
          setVideoAvailable(true);
        }
      } catch (error) {
        setVideoAvailable(false);
      }
    };

    checkVideoAvailability();
  }, [videoId]);

  if (!videoAvailable) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-xl shadow-xl bg-gray-100 flex flex-col items-center justify-center p-8 text-center"
        style={{ aspectRatio: "16/9" }}
      >
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Video Unavailable
        </h3>
        <p className="text-gray-500 max-w-md">
          This video is not available or might be restricted in your location.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Report Issue
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Browse More Videos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-xl"
      style={{ aspectRatio: "16/9" }}
    >
      {!isPlaying ? (
        <div className="relative h-full w-full cursor-pointer group">
          {!thumbnailError ? (
            // Regular img tag instead of Next/Image
            <img
              src={thumbnailUrl}
              alt={`${title} thumbnail`}
              className="w-full h-full object-cover brightness-90 group-hover:brightness-75 transition-all duration-300"
              onError={() => setThumbnailError(true)}
            />
          ) : (
            // Thumbnail fallback UI
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-medium">{title}</h3>
              </div>
            </div>
          )}

          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => setIsPlaying(true)}
          >
            <div className="bg-red-600 hover:bg-red-700 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
              <svg
                className="w-12 h-12 text-white ml-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold drop-shadow-lg">
              {title}
            </h3>
          </div>
        </div>
      ) : (
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};

export default YouTubePlayer;
