import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import AdManager from "./Ads";


// --- SVG ICONS (Self-contained for portability) ---
const StarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

const PlayIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const NetflixIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 111 30"
    fill="#e50914"
    className={className}
    aria-hidden="true"
  >
    <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2499766 C43.7810479,26.2499766 42.1876465,26.2499766 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z" />
  </svg>
);

// --- Trailer Modal Component ---
const TrailerModal = ({ videoId, onClose }) => (
  <div
    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-4xl aspect-video bg-black"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute -top-10 -right-10 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
        aria-label="Close trailer"
      >
        <CloseIcon className="w-7 h-7" />
      </button>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

// --- Main Page Component ---
const MoviePage = ({ movieData }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  // Guard clause for missing data
  if (!movieData) {
    return (
      <div className="bg-[#141414] text-white min-h-screen flex items-center justify-center font-sans">
        <p>Movie data not found.</p>
        <AdManager/>
      </div>
    );
  }

  // Destructure props with default values
  const {
    primaryTitle,
    startYear,
    contentRating,
    runtimeMinutes,
    description,
    averageRating,
    numVotes,
    releaseDate,
    budget,
    trailer,
    primaryImage,
    genres = [],
    thumbnails = [],
    countriesOfOrigin = [],
    productionCompanies = [],
    spokenLanguages = [],
    cast = [],
    directors = [],
  } = movieData;

  // Helper Functions
  const formatRuntime = (minutes) =>
    minutes ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : "N/A";
  const formatVotes = (votes) =>
    votes
      ? votes >= 1_000_000
        ? `${(votes / 1_000_000).toFixed(1)}M`
        : votes >= 1000
        ? `${(votes / 1000).toFixed(1)}K`
        : votes.toString()
      : "0";
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  const formatCurrency = (amount) =>
    amount ? `$${amount.toLocaleString("en-US")}` : "N/A";

  // Extract YouTube ID from URL
  const getYouTubeId = (url) => {
    if (typeof url !== "string" || !url) return "UdeS2cW_i2I"; // Default trailer
    const match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );
    return match && match[2].length === 11 ? match[2] : "UdeS2cW_i2I";
  };

  const trailerVideoId = getYouTubeId(trailer);
  const downloadServers = [
    {
      id: 1,
      name: "Server EU Premium",
      quality: "1080p BluRay",
      size: "4.2GB",
    },
    { id: 2, name: "Server US Express", quality: "720p WEB-DL", size: "2.8GB" },
    { id: 3, name: "Server Asia HD", quality: "1080p HDRip", size: "3.5GB" },
    { id: 4, name: "Server Global", quality: "4K UHD", size: "12.1GB" },
    { id: 5, name: "Server FastStream", quality: "480p SD", size: "1.1GB" },
    { id: 6, name: "Server Torrent", quality: "1080p REMUX", size: "15.7GB" },
  ];

  const pageTitle = `Watch ${primaryTitle} (${startYear}) Online | Full Movie Download`;
  const metaDescription = `Download or stream ${primaryTitle} full movie. Released in ${startYear}, starring a talented cast. Available in HD, 4K, and various file sizes. ${description.substring(
    0,
    120
  )}...`;
  const metaKeywords = `${primaryTitle}, ${startYear}, watch online, download, full movie, movie streaming, ${genres.join(
    ", "
  )}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={primaryImage} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content="Netflix" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={primaryImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Movie",
              name: primaryTitle,
              datePublished: releaseDate,
              image: primaryImage,
              description: description,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: averageRating,
                bestRating: "10",
                worstRating: "1",
                ratingCount: numVotes,
              },
              director: directors.map((director) => ({
                "@type": "Person",
                name: director.name,
              })),
              actor: cast.slice(0, 5).map((actor) => ({
                "@type": "Person",
                name: actor.name,
              })),
              genre: genres,
              duration: `PT${runtimeMinutes}M`,
            }),
          }}
        />
      </Head>

      {isTrailerOpen && (
        <TrailerModal
          videoId={trailerVideoId}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}

      {/* Photo Viewer Modal */}
      {activePhoto !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            aria-label="Close photo viewer"
          >
            <CloseIcon className="w-7 h-7" />
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={thumbnails[activePhoto]?.url}
              alt={`${primaryTitle} scene ${activePhoto + 1}`}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      )}

<AdManager/>
      <div className="bg-[#141414] text-white min-h-screen font-sans">
        {/* Netflix Header */}
        <header className="bg-black/90 fixed top-0 w-full z-40 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
            <NetflixIcon className="w-28 h-8 mr-3" />
            <nav className="hidden md:flex space-x-6 ml-10">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Movies</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">New & Popular</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">My List</a>
            </nav>
          </div>
        </header>

        {/* Hero Banner */}
        <div className="relative h-96 w-full mt-16">
          <Image
            src={primaryImage}
            alt={primaryTitle}
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent"></div>
          <div className="absolute bottom-10 left-8 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{primaryTitle}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-gray-300">
              <span className="text-lg">{startYear}</span>
              <span className="border border-gray-600 px-2 py-0.5 text-sm rounded-md">
                {contentRating}
              </span>
              <span className="text-lg">{formatRuntime(runtimeMinutes)}</span>
              <div className="flex items-center ml-2">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{averageRating}</span>
                <span className="text-gray-500 ml-1">/10</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsTrailerOpen(true)}
                className="bg-white text-black px-6 py-2 rounded-md flex items-center font-medium hover:bg-opacity-90 transition"
              >
                <PlayIcon className="w-5 h-5 mr-2" /> Play Trailer
              </button>
              <button className="bg-gray-600/70 text-white px-6 py-2 rounded-md flex items-center font-medium hover:bg-gray-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                My List
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto p-4 md:p-8 mt-8">
          {/* --- Main Content Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            {/* --- Left Column: Details --- */}
            <article>
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="border border-red-600/50 bg-red-900/20 text-red-400 rounded-full px-4 py-1.5 text-sm font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Overview
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {description}
                </p>
              </div>

              <hr className="border-gray-800 my-6" />

              {/* Cast Section */}
              {cast && cast.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Cast</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cast.slice(0, 8).map((actor, index) => (
                      <div key={index} className="text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2 overflow-hidden">
                          {actor.image && (
                            <Image
                              src={actor.image}
                              alt={actor.name}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <p className="font-medium text-sm">{actor.name}</p>
                        <p className="text-gray-400 text-xs">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#1a1a1a]/80 p-5 rounded-xl border border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">
                    Rating
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center">
                        <span className="text-3xl font-bold">
                          {averageRating}
                        </span>
                        <span className="text-gray-500 absolute -bottom-7">
                          /10
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <StarIcon className="w-6 h-6 text-yellow-400" />
                        <span className="text-lg font-medium">
                          {formatVotes(numVotes)} votes
                        </span>
                      </div>
                      <div className="mt-2">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                          Rate This Title
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a]/80 p-5 rounded-xl border border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-400 mb-3">
                    Details
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Release Date:</span>
                      <span>{formatDate(releaseDate)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Countries:</span>
                      <span>{countriesOfOrigin.join(", ") || "N/A"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Languages:</span>
                      <span>
                        {spokenLanguages
                          .map((l) => ({ en: "English" }[l] || l))
                          .join(", ") || "N/A"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span>
                        {budget
                          ? `${formatCurrency(budget)} (estimated)`
                          : "N/A"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Production:</span>
                      <span className="text-right">
                        {productionCompanies.map((c) => c.name).join(", ") ||
                          "N/A"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* --- Photos Gallery --- */}
              {thumbnails && thumbnails.length > 0 && (
                <section className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-red-600 pl-3">
                      Photos
                    </h2>
                    <span className="text-gray-400 text-sm">
                      {thumbnails.length} images
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {thumbnails.map((thumb, index) => (
                      <div
                        key={index}
                        className="aspect-video cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 group"
                        onClick={() => setActivePhoto(index)}
                      >
                        <div className="w-full h-full bg-gray-800/50 relative">
                          <Image
                            src={thumb.url}
                            alt={`${primaryTitle} scene ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-white opacity-80"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* --- Right Column: Poster & Quick Links --- */}
            <aside>
              <div className="sticky top-4">
                <div
                  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg"
                  onClick={() => setIsTrailerOpen(true)}
                >
                  <Image
                    src={primaryImage}
                    alt={`${primaryTitle} Poster`}
                    width={400}
                    height={600}
                    className="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 rounded-full p-3 mb-3">
                      <PlayIcon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xl font-semibold">Play Trailer</span>
                  </div>
                </div>

                <div className="mt-6 bg-[#1a1a1a]/80 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Quick Links
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="flex items-center py-2 px-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>All Videos</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center py-2 px-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                          />
                        </svg>
                        <span>Full Cast & Crew</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center py-2 px-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                          />
                        </svg>
                        <span>Trivia</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center py-2 px-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>User Reviews</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Download Servers Section */}
        <aside className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-lg font-semibold bg-red-600 text-white text-center p-4 flex justify-center rounded-t-xl">
            Download Servers
          </h3>
          <div className="bg-[#1a1a1a]/80 border border-gray-800 rounded-b-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-500 bg-gray-900/50 px-2 py-1 rounded">
                {downloadServers.length} options
              </span>
            </div>
            <div className="space-y-3">
              {downloadServers.map((server) => (
                <div
                  key={server.id}
                  className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div>
                    <div className="font-medium flex items-center">
                      {server.name}
                      <span className="ml-2 text-xs bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded">
                        {server.quality}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {server.size}
                    </div>
                  </div>
                  <a
                        href="https://www.profitableratecpm.com/mxuf6yhw1?key=8b3a8975b0ba4277507334f940dafe55"

                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1.5 px-3 rounded transition-colors flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a    href="https://www.profitableratecpm.com/mxuf6yhw1?key=8b3a8975b0ba4277507334f940dafe55" className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center justify-center w-full">
                Show more servers
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </aside>

        {/* Watch Servers Section */}
        <aside className="max-w-7xl mx-auto p-4 md:p-8">
          <h1 className="flex justify-center text-lg font-semibold p-4 bg-red-600 text-white rounded-t-xl">
            Watch Servers
          </h1>
          <div className="bg-[#1a1a1a]/80 border border-gray-800 rounded-b-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-500 bg-gray-900/50 px-2 py-1 rounded">
                {downloadServers.length} options
              </span>
            </div>
            <div className="space-y-3">
              {downloadServers.map((server) => (
                <div
                  key={server.id}
                  className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div>
                    <div className="font-medium flex items-center">
                      {server.name}
                      <span className="ml-2 text-xs bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded">
                        {server.quality}
                      </span>
                    </div>
                  </div>
                  <a target="_blank"
    rel="noopener noreferrer"
    href="https://www.profitableratecpm.com/mxuf6yhw1?key=8b3a8975b0ba4277507334f940dafe55"
    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1.5 px-3 rounded transition-colors flex items-center"
                  >
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Watch Now
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a  target="_blank"
    rel="noopener noreferrer"  href="https://www.profitableratecpm.com/mxuf6yhw1?key=8b3a8975b0ba4277507334f940dafe55" className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center justify-center w-full">
                Show more servers
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </aside>

      
      </div>
    </>
  );
};

export default MoviePage;