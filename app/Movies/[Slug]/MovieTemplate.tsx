"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";

// Helper function to format currency

// --- Type Definitions ---

interface Person {
  fullName: string;
}

interface Company {
  name: string;
}

interface Actor {
  fullName: string;
  primaryImage?: string;
  characters?: string[];
}

interface Movie {
  budget: number;
  id: string;
  primaryTitle: string;
  originalTitle?: string;
  description?: string;
  primaryImage?: string;
  trailer?: string; // YouTube Video ID
  contentRating?: string;
  releaseDate?: string;
  runtimeMinutes?: number;
  averageRating?: number;
  numVotes?: number;
  metascore?: number;
  genres?: string[];
  directors?: Person[];
  writers?: Person[];
  productionCompanies?: Company[];
  cast?: Actor[];
  grossWorldwide: number;
}

interface MovieTemplateProps {
  movie: Movie | null;
}

// --- Main Component ---

export default function MoviePage({ movie }: MovieTemplateProps) {
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Prevent background scrolling when the trailer is open
    document.body.style.overflow = showTrailer ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [showTrailer]);

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-500">
        Movie not found.
      </div>
    );
  }

  // --- Data Formatting ---

  const releaseYear = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "N/A";

  const runtime = movie.runtimeMinutes
    ? `${Math.floor(movie.runtimeMinutes / 60)}h ${movie.runtimeMinutes % 60}m`
    : "N/A";

  // --- JSON-LD for SEO ---

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.primaryTitle,
    image: movie.primaryImage || "/default-movie.jpg",
    datePublished: movie.releaseDate,
    genre: movie.genres || [],
    director: movie.directors?.map((d) => ({
      "@type": "Person",
      name: d.fullName,
    })),
    aggregateRating:
      movie.numVotes && movie.numVotes > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.averageRating,
            bestRating: 10,
            ratingCount: movie.numVotes,
          }
        : undefined,
    description: movie.description,
  };

  return (
    <>
      <Script
        id="movie-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <header className="relative w-full h-[60vh] md:h-[75vh] min-h-[400px] max-h-[700px] text-white">
        <div className="absolute inset-0">
          <Image
            src={movie.primaryImage || "/default-movie.jpg"}
            alt={`Promotional image for ${movie.primaryTitle}`}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-6xl h-full flex flex-col justify-end px-6 py-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-xl mb-2">
            {movie.primaryTitle}
          </h1>
          {movie.originalTitle &&
            movie.originalTitle !== movie.primaryTitle && (
              <p className="text-lg md:text-xl text-white/80 font-medium drop-shadow-lg">
                {movie.originalTitle}
              </p>
            )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm font-medium">
            {movie.releaseDate && (
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                {releaseYear}
              </span>
            )}
            {movie.contentRating && (
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                {movie.contentRating}
              </span>
            )}
            {runtime !== "N/A" && (
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                {runtime}
              </span>
            )}
            {movie.averageRating && (
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                <StarIcon />
                <span>
                  {movie.averageRating.toFixed(1)}
                  <span className="text-white/60">/10</span>
                </span>
              </div>
            )}
          </div>

          {movie.trailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className="mt-8 flex items-center gap-2.5 bg-red-600 hover:bg-red-700 transition-colors px-6 py-3 rounded-lg text-base font-semibold w-fit"
            >
              <PlayIcon />
              Watch Trailer
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            {/* Synopsis */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {movie.description || "No synopsis available."}
              </p>
            </section>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Top Billed Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {movie.cast.slice(0, 8).map((actor, idx) => (
                    <div key={idx} className="text-center">
                      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden mb-2 shadow-md">
                        <Image
                          src={actor.primaryImage || "/default-actor.jpg"}
                          alt={actor.fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold">{actor.fullName}</h3>
                      <p className="text-sm text-gray-500">
                        {actor.characters?.[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Details Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-6">Details</h3>
              <div className="space-y-4">
                <DetailItem
                  label="Director"
                  value={movie.directors?.map((d) => d.fullName).join(", ")}
                />
                <DetailItem
                  label="Writers"
                  value={movie.writers?.map((w) => w.fullName).join(", ")}
                />
                <DetailItem label="Genres" value={movie.genres?.join(", ")} />
                <DetailItem
                  label="Production"
                  value={movie.productionCompanies
                    ?.map((c) => c.name)
                    .join(", ")}
                />
                <DetailItem label="Budget" value={`${movie.budget}`} />
                <DetailItem
                  label="Worldwide Gross"
                  value={`${movie.grossWorldwide}`}
                />
              </div>
            </div>
            <div className="mt-6">
              <ExternalLink
                href={`https://www.imdb.com/title/${movie.id}`}
                label="View on IMDb"
              />
            </div>
          </aside>
        </div>
      </main>

      {/* YouTube Trailer Modal */}
      {movie.trailer && showTrailer && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the video
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 z-50 text-white text-4xl font-light hover:text-red-500 transition-colors"
              aria-label="Close trailer"
            >
              &times;
            </button>
            <iframe
              className="w-full h-full rounded-lg shadow-2xl"
              src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1&mute=0&controls=1&rel=0`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

// --- Sub-components for better organization ---

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </h4>
      <p className="text-base text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );
};

const ExternalLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2.5 w-full text-center bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all duration-300"
  >
    <span>{label}</span>
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  </a>
);

// --- Icon Components ---

const PlayIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const StarIcon = () => (
  <svg
    className="w-4 h-4 text-yellow-400"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);
