"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import YouTubePlayer from "@/components/YouTubePlayer";
// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

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
  const [isLoading, setIsLoading] = useState(true);

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
          {movie.primaryImage ? (
            <Image
              src={movie.primaryImage}
              alt={`Promotional image for ${movie.primaryTitle}`}
              fill
              className="object-cover object-center transition-opacity duration-500"
              priority
              onLoadingComplete={() => setIsLoading(false)}
              style={{ opacity: isLoading ? 0 : 1 }}
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              <span className="text-gray-500 text-lg">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        <div className="relative container mx-auto max-w-6xl h-full flex flex-col justify-end px-6 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-xl mb-2">
              {movie.primaryTitle}
            </h1>
            {movie.originalTitle &&
              movie.originalTitle !== movie.primaryTitle && (
                <p className="text-lg md:text-xl text-white/80 font-medium drop-shadow-lg mb-4">
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
              {movie.metascore && (
                <div className="flex items-center gap-1.5 bg-green-600/90 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                  <span className="font-bold">{movie.metascore}</span>
                  <span className="text-white/80">Metascore</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {movie.trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="mt-2 flex items-center gap-2.5 bg-red-600 hover:bg-red-700 transition-colors px-6 py-3 rounded-lg text-base font-semibold w-fit"
                >
                  <PlayIcon />
                  Watch Trailer
                </button>
              )}
              <ExternalLink
                href={`https://www.imdb.com/title/${movie.id}`}
                label="IMDb"
                icon={
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.5 0h-14c-1.4 0-2.5 1.1-2.5 2.5v19c0 1.4 1.1 2.5 2.5 2.5h14c1.4 0 2.5-1.1 2.5-2.5v-19c0-1.4-1.1-2.5-2.5-2.5zm-6.8 19.5h-2.4v-13h2.4v13zm-1.2-14.8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm7.5 14.8h-2.4v-6.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5v6.5h-2.4v-13h2.4v1.8c.6-1.1 1.8-1.8 3.1-1.8 2.2 0 4 1.8 4 4v9z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}

      <YouTubePlayer videoId={movie.trailer} />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">
            {/* Synopsis */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-5 pb-2 border-b border-gray-200 dark:border-gray-700">
                Synopsis
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {movie.description || "No synopsis available."}
              </p>
            </section>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Top Billed Cast
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {movie.cast.slice(0, 10).map((actor, idx) => (
                    <div
                      key={idx}
                      className="group text-center transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 shadow-md">
                        {actor.primaryImage ? (
                          <Image
                            src={actor.primaryImage}
                            alt={actor.fullName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold group-hover:text-red-600 transition-colors">
                        {actor.fullName}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                Movie Details
              </h3>
              <div className="space-y-5">
                <DetailItem
                  label="Director"
                  value={movie.directors?.map((d) => d.fullName).join(", ")}
                  icon={<DirectorIcon />}
                />
                <DetailItem
                  label="Writers"
                  value={movie.writers?.map((w) => w.fullName).join(", ")}
                  icon={<WriterIcon />}
                />
                <DetailItem
                  label="Genres"
                  value={movie.genres?.join(", ")}
                  icon={<GenreIcon />}
                />
                <DetailItem
                  label="Production"
                  value={movie.productionCompanies
                    ?.map((c) => c.name)
                    .join(", ")}
                  icon={<ProductionIcon />}
                />
                <DetailItem
                  label="Budget"
                  value={formatCurrency(movie.budget)}
                  icon={<BudgetIcon />}
                />
                <DetailItem
                  label="Worldwide Gross"
                  value={formatCurrency(movie.grossWorldwide)}
                  icon={<GrossIcon />}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* YouTube Trailer Modal */}
      {movie.trailer && showTrailer && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center backdrop-blur-lg transition-opacity duration-300"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the video
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 z-50 text-white text-4xl font-light hover:text-red-500 transition-colors p-2"
              aria-label="Close trailer"
            >
              <CloseIcon />
            </button>
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1&mute=0&controls=1&rel=0`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
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
  icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-500 dark:text-gray-400">{icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </h4>
        <p className="text-base text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
};

const ExternalLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2.5 text-center bg-gray-800 dark:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300"
  >
    {icon && <span>{icon}</span>}
    <span>{label}</span>
  </a>
);

// --- Icon Components ---

const PlayIcon = () => (
  <svg
    className="w-5 h-5"
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

const CloseIcon = () => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "w-6 h-6"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const DirectorIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const WriterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const GenreIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const ProductionIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const BudgetIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const GrossIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
