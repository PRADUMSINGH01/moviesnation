// components/MovieCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  platform: string;
  posterUrl?: string;
}

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow border border-zinc-800">
      <div className="relative h-72 w-full">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt=""
            width={400}
            height={400}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-gray-500 text-sm">
            No Image Available
          </div>
        )}

        <div className="absolute top-3 right-3 bg-zinc-950 bg-opacity-80 px-2 py-1 rounded-md text-xs text-yellow-400 font-semibold">
          ⭐ {movie.rating}/10
        </div>

        <div className="absolute bottom-3 left-3 bg-purple-600 px-3 py-1 rounded-md text-xs text-white font-medium shadow-md">
          {movie.platform}
        </div>
      </div>
      <Link
        href={`/Movies/${movie.id}`}
        className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors z-10"
      >
        <div className="p-4 space-y-2">
          <h3
            className="text-lg font-semibold text-white truncate"
            title={movie.title}
          >
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400">Released: {movie.year}</p>

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              {["HD", "4K"].map((quality) => (
                <span
                  key={quality}
                  className="bg-zinc-800 text-gray-300 px-2 py-0.5 rounded text-xs border border-zinc-700"
                >
                  {quality}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
