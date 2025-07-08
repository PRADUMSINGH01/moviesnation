"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import YouTubePlayer from "@/components/YouTubePlayer";

export default function MovieTemplate({ movie }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showTrailer, setShowTrailer] = useState(false);

  const getYouTubeId = (url) => {
    const regExp = /(?:youtu.be\/|v=|embed\/|watch\?v=)([\w-]{11})/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
  };
  const trailerId = getYouTubeId(movie.trailer);

  useEffect(() => {
    document.body.style.overflow = showTrailer ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showTrailer]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.primaryTitle,
    image: movie.primaryImage || "/default-movie.jpg",
    datePublished: movie.releaseDate,
    director:
      movie.directors?.map((d) => ({ "@type": "Person", name: d.fullName })) ||
      [],
    genre: movie.genres || [],
    aggregateRating:
      movie.numVotes > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.averageRating,
            bestRating: 10,
            ratingCount: movie.numVotes,
          }
        : undefined,
  };

  const runtime = movie.runtimeMinutes
    ? `${Math.floor(movie.runtimeMinutes / 60)}h ${movie.runtimeMinutes % 60}m`
    : "N/A";

  return (
    <>
      <Script
        id="movie-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {showTrailer && trailerId && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl aspect-video mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 z-50 text-white text-2xl hover:text-red-500 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Close trailer"
            >
              &times;
            </button>
            <iframe
              className="w-full h-full rounded-lg shadow-2xl"
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&controls=1&rel=0`}
              title="Movie Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <header className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        <Image
          src={movie.primaryImage || "/default-movie.jpg"}
          alt={movie.primaryTitle}
          fill
          className="object-cover brightness-[0.3]"
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-12 text-white">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg mb-2">
              {movie.primaryTitle}
            </h1>
            <p className="text-xl opacity-80 mb-6">{movie.originalTitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/20">
                {movie.releaseDate?.slice(0, 4)}
              </span>
              {movie.contentRating && (
                <span className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                  {movie.contentRating}
                </span>
              )}
              <span className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                {runtime}
              </span>
              {movie.genres?.slice(0, 3).map((genre, idx) => (
                <span
                  key={idx}
                  className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
                >
                  {genre}
                </span>
              ))}
            </div>
            {trailerId && (
              <button
                onClick={() => setShowTrailer(true)}
                className="mt-8 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-base font-medium transition-all transform hover:scale-105"
                aria-label="Play Trailer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </header>

      <YouTubePlayer
        videoId="jan5CFWs9ic"
        title={movie.primaryTitle}
        autoplay={true}
        loop={true}
        thumbnailQuality="maxresdefault"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex overflow-x-auto pb-4 hide-scrollbar">
          {["Overview", "Details", "Production", "Cast"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-base font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className="mt-10">
          {activeTab === "Overview" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-5">Storyline</h2>
              <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                {movie.description || "No description available."}
              </p>
              {movie.interests?.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Detail label="Release Date" value={movie.releaseDate} />
              <Detail label="Runtime" value={runtime} />
              <Detail label="Rating" value={movie.contentRating} />
              <Detail label="Genres" value={movie.genres?.join(", ")} />
              <Detail
                label="Languages"
                value={movie.spokenLanguages?.join(", ")}
              />
              <Detail
                label="Countries"
                value={movie.countriesOfOrigin?.join(", ")}
              />
              <Detail
                label="Score"
                value={
                  movie.numVotes > 0
                    ? `${
                        movie.averageRating
                      }/10 (${movie.numVotes.toLocaleString()} votes)`
                    : "N/A"
                }
              />
              <Detail
                label="Metascore"
                value={movie.metascore ? `${movie.metascore}/100` : "N/A"}
              />
              <Detail label="Budget" value={formatCurrency(movie.budget)} />
              <Detail
                label="Worldwide Gross"
                value={formatCurrency(movie.grossWorldwide)}
              />
            </div>
          )}

          {activeTab === "Production" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl p-6 shadow-sm">
              <Detail
                label="Directors"
                value={movie.directors?.map((d) => d.fullName).join(", ")}
              />
              <Detail
                label="Writers"
                value={movie.writers?.map((w) => w.fullName).join(", ")}
              />
              <Detail
                label="Production Companies"
                value={movie.productionCompanies?.map((p) => p.name).join(", ")}
              />
              <Detail
                label="Filming Locations"
                value={movie.filmingLocations?.join(", ")}
              />
            </div>
          )}

          {activeTab === "Cast" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.cast?.map((actor, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {actor.primaryImage ? (
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={actor.primaryImage}
                        alt={actor.fullName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center text-gray-400">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-lg truncate">
                      {actor.fullName}
                    </h4>
                    <p className="text-gray-600 text-sm truncate">
                      {actor.characters?.join(", ") || actor.job || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Auto-playing Trailer Section */}
        {trailerId && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Official Trailer</h2>
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Full Screen
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-xl bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&mute=1&loop=1&playlist=${trailerId}&controls=1&modestbranding=1&rel=0`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">More Information</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ExternalLink
              href={`https://www.imdb.com/title/${movie.id}`}
              label="IMDb"
            />
            <ExternalLink
              href={`https://www.themoviedb.org/search?query=${encodeURIComponent(
                movie.primaryTitle
              )}`}
              label="TMDB"
            />
            <ExternalLink
              href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(
                movie.primaryTitle
              )}`}
              label="Where to Watch"
            />
            <ExternalLink
              href={`https://www.rottentomatoes.com/search?search=${encodeURIComponent(
                movie.primaryTitle
              )}`}
              label="Rotten Tomatoes"
            />
          </div>
        </section>
      </main>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

const Detail = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-1">
      {label}
    </h4>
    <p className="text-gray-900 font-medium">{value || "N/A"}</p>
  </div>
);

const ExternalLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
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
        strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      ></path>
    </svg>
  </a>
);

function formatCurrency(amount) {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
