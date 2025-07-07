// components/MovieImage.tsx
"use client";

import { useState } from "react";

export default function MovieImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageSrc("/default-movie.jpg");
    setImageError(true);
  };

  if (!src || imageError) {
    return (
      <div
        className={`${className} bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center`}
      >
        <span className="text-zinc-500">No image available</span>
      </div>
    );
  }

  return (
    <img src={imageSrc} alt={alt} className={className} onError={handleError} />
  );
}
