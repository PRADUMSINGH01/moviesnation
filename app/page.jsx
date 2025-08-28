"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import MovieSearch from "@/components/MovieSearch";
import localMovies from "../data/movies.json";
// Correctly import the last fetched time
import lastFetchInfo from "../data/last-fetch.json";
import INDTOPM from "../data/INDTOPM.json";
import INDTOPMTIME from "../data/lastINDTOPM-fetch.json";
// Reusable Pagination Component (unchanged)
import TVshow from "../data/TV.json";
import TVupdate from "../data/lastTV-fetch.json";

////

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const visiblePages = () => {
    const pages = [];
    const maxVisible = 3; // number of pages shown before truncation
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
      >
        Prev
      </button>

      {currentPage > 2 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            1
          </button>
          {currentPage > 3 && <span className="text-gray-400">...</span>}
        </>
      )}

      {visiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 1 && (
        <>
          {currentPage < totalPages - 2 && (
            <span className="text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [INDmovie, setINDTOPM] = useState([]);
  const [lastUpdatedIND, setLastUpdatedIND] = useState(null);
  //-------------TV--------

  const [TV, SetTV] = useState([]);
  const [TVupdates, setTVupdate] = useState(null);

  const [currentPageMovies, setCurrentPageMovies] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [source, setSource] = useState(null);

  const itemsPerPage = 12;

  //top  movies --------------

  useEffect(() => {
    let mounted = true;

    const checkAndLoadMovies = async () => {
      setIsLoading(true);
      setError(null);

      const lastFetchDate = lastFetchInfo?.lastUpdated
        ? new Date(lastFetchInfo.lastUpdated)
        : null;
      const now = new Date();
      let shouldFetch = true; // Default to fetching if no date is found

      if (lastFetchDate) {
        const diffTime = Math.abs(now - lastFetchDate);
        const diffHours = diffTime / (1000 * 60 * 60);

        // If the data is less than or equal to 72 hours old, don't fetch.
        if (diffHours <= 72) {
          shouldFetch = false;
        }
      }

      if (shouldFetch) {
        // --- Fetch new data from API ---
        console.log("Data is stale or missing. Fetching from API...");
        try {
          // The API endpoint should now *always* fetch new data.
          const apiRes = await fetch("/api/movies", { cache: "no-store" });
          if (!apiRes.ok) throw new Error(`API error: ${apiRes.statusText}`);

          const apiData = await apiRes.json();

          if (mounted) {
            if (Array.isArray(apiData.movies)) {
              setMovies(apiData.movies);
            }
            if (apiData.lastUpdated) {
              setLastUpdated(apiData.lastUpdated);
            }
            // The source will be what the API returns (e.g., 'remote-api')
            if (apiData.source) {
              setSource(apiData.source);
            }
          }
        } catch (err) {
          console.error("Failed to load movies from API:", err);
          if (mounted) {
            setError(err.message || "Failed to load movies.");
          }
        } finally {
          if (mounted) setIsLoading(false);
        }
      } else {
        // --- Use local JSON data ---
        console.log("Data is recent. Loading from local JSON.");
        setMovies(localMovies);
        setLastUpdated(lastFetchInfo.lastUpdated);
        setSource("local-cache");
        setIsLoading(false);
      }
    };

    checkAndLoadMovies();

    return () => {
      mounted = false;
    };
  }, []);

  //top indian movies-------------

  useEffect(() => {
    let mounted = true;

    const checkAndLoadMovies = async () => {
      setIsLoading(true);
      setError(null);

      const lastFetchDate = INDTOPMTIME?.lastUpdated
        ? new Date(INDTOPMTIME.lastUpdated)
        : null;
      const now = new Date();
      let shouldFetch = true; // Default to fetching if no date is found

      if (lastFetchDate) {
        const diffTime = Math.abs(now - lastFetchDate);
        const diffHours = diffTime / (1000 * 60 * 60);

        // If the data is less than or equal to 72 hours old, don't fetch.
        if (diffHours <= 72) {
          shouldFetch = false;
        }
      }

      if (shouldFetch) {
        // --- Fetch new data from API ---
        console.log("Data is stale or missing. Fetching from API...");
        try {
          // The API endpoint should now *always* fetch new data.
          const apiRes = await fetch("/api/INDTOP", { cache: "no-store" });
          if (!apiRes.ok) throw new Error(`API error: ${apiRes.statusText}`);

          const apiData = await apiRes.json();

          if (mounted) {
            if (Array.isArray(apiData.movies)) {
              setINDTOPM(apiData.movies);
            }
            if (apiData.lastUpdated) {
              setLastUpdatedIND(apiData.lastUpdated);
            }
            // The source will be what the API returns (e.g., 'remote-api')
            if (apiData.source) {
              setSource(apiData.source);
            }
          }
        } catch (err) {
          console.error("Failed to load movies from API:", err);
          if (mounted) {
            setError(err.message || "Failed to load movies.");
          }
        } finally {
          if (mounted) setIsLoading(false);
        }
      } else {
        // --- Use local JSON data ---
        console.log("Data is recent. Loading from local JSON.");
        setINDTOPM(INDTOPM);
        setLastUpdatedIND(INDTOPMTIME.lastUpdated);
        setSource("local-cache");
        setIsLoading(false);
      }
    };

    checkAndLoadMovies();

    return () => {
      mounted = false;
    };
  }, []);

  //top TV -------------

  useEffect(() => {
    let mounted = true;

    const checkAndLoadMovies = async () => {
      setIsLoading(true);
      setError(null);

      const lastFetchDate = TVupdate?.lastUpdated
        ? new Date(TVupdate.lastUpdated)
        : null;
      const now = new Date();
      let shouldFetch = true; // Default to fetching if no date is found

      if (lastFetchDate) {
        const diffTime = Math.abs(now - lastFetchDate);
        const diffHours = diffTime / (1000 * 60 * 60);

        // If the data is less than or equal to 72 hours old, don't fetch.
        if (diffHours <= 72) {
          shouldFetch = false;
        }
      }

      if (shouldFetch) {
        // --- Fetch new data from API ---
        console.log("Data is stale or missing. Fetching from API...");
        try {
          // The API endpoint should now *always* fetch new data.
          const apiRes = await fetch("/api/fetch-and-save", {
            cache: "no-store",
          });
          if (!apiRes.ok) throw new Error(`API error: ${apiRes.statusText}`);

          const apiData = await apiRes.json();

          if (mounted) {
            if (Array.isArray(apiData.movies)) {
              SetTV(apiData.movies);
            }
            if (apiData.lastUpdated) {
              setTVupdate(apiData.lastUpdated);
            }
            // The source will be what the API returns (e.g., 'remote-api')
            if (apiData.source) {
              setSource(apiData.source);
            }
          }
        } catch (err) {
          console.error("Failed to load movies from API:", err);
          if (mounted) {
            setError(err.message || "Failed to load movies.");
          }
        } finally {
          if (mounted) setIsLoading(false);
        }
      } else {
        // --- Use local JSON data ---
        console.log("Data is recent. Loading from local JSON.");
        SetTV(TVshow);
        setTVupdate(TVshow.lastUpdated);
        setSource("local-cache");
        setIsLoading(false);
      }
    };

    checkAndLoadMovies();

    return () => {
      mounted = false;
    };
  }, []);

  // reset page when search changes
  useEffect(() => {
    setCurrentPageMovies(1);
  }, [searchQuery]);

  // Pagination helpers
  const filteredMovies = movies.filter((movie) =>
    movie?.primaryTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPagesMovies = Math.max(
    1,
    Math.ceil(filteredMovies.length / itemsPerPage)
  );
  const displayedMovies = filteredMovies.slice(
    (currentPageMovies - 1) * itemsPerPage,
    currentPageMovies * itemsPerPage
  );

  const ind = INDmovie.filter((movie) =>
    movie?.primaryTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPagesMoviesINDmovie = Math.max(
    1,
    Math.ceil(ind.length / itemsPerPage)
  );
  const displayedMoviesINDmovie = ind.slice(
    (currentPageMovies - 1) * itemsPerPage,
    currentPageMovies * itemsPerPage
  );

  ///////tv pegination --------

  const filtered = TV.filter((movie) =>
    movie?.primaryTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPagesTVes = Math.max(
    1,
    Math.ceil(filteredMovies.length / itemsPerPage)
  );
  const displayedTV = filtered.slice(
    (currentPageMovies - 1) * itemsPerPage,
    currentPageMovies * itemsPerPage
  );

  // clamp page if data size changes
  useEffect(() => {
    if (currentPageMovies > totalPagesMovies) {
      setCurrentPageMovies(totalPagesMovies || 1);
    }
  }, [totalPagesMovies, currentPageMovies]);

  // safe page setters (clamp)
  const handlePageChangeMovies = (page) => {
    const p = Math.max(1, Math.min(page, totalPagesMovies));
    setCurrentPageMovies(p);
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between gap-4">
        <MovieSearch onSearch={setSearchQuery} />
        {/* Last-updated badge */}
        {lastUpdated && (
          <div className="text-sm text-gray-300">
            <span className="mr-2 text-xs uppercase text-gray-400">
              Freshness
            </span>
            <span className="px-3 py-1 rounded bg-gray-800 text-gray-200">
              {source ?? "unknown"} • {new Date(lastUpdated).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-300">Loading movies...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="max-w-7xl mx-auto text-center py-8">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Movies Section */}
          {displayedMovies.length > 0 ? (
            <section className="max-w-7xl mx-auto mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                {displayedMovies.map((movie) => (
                  <MovieCard
                    key={
                      movie.id ??
                      movie.movieId ??
                      movie.tconst ??
                      movie.primaryTitle
                    }
                    movie={movie}
                  />
                ))}
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPageMovies}
                  totalPages={totalPagesMovies}
                  onPageChange={handlePageChangeMovies}
                />
              </div>
            </section>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No movies found.</p>
            </div>
          )}
        </>
      )}

      <h1 className=" flex text-4xl font-bold  py-6 m-6 text-yellow-500">
        Top TV show to watch and download{" "}
      </h1>
      {!isLoading && !error && (
        <>
          {/* Movies Section */}
          {displayedTV.length > 0 ? (
            <section className="max-w-7xl mx-auto mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                {displayedTV.map((movie) => (
                  <MovieCard
                    key={
                      movie.id ??
                      movie.movieId ??
                      movie.tconst ??
                      movie.primaryTitle
                    }
                    movie={movie}
                  />
                ))}
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPageMovies}
                  totalPages={totalPagesMovies}
                  onPageChange={handlePageChangeMovies}
                />
              </div>
            </section>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No movies found.</p>
            </div>
          )}
        </>
      )}

      <h1 className=" flex text-4xl font-bold  py-6 m-6 text-yellow-500">
        Top Indian Movies to watch and download{" "}
      </h1>
      {!isLoading && !error && (
        <>
          {/* Movies Section */}
          {displayedMoviesINDmovie.length > 0 ? (
            <section className="max-w-7xl mx-auto mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                {displayedMoviesINDmovie.map((movie) => (
                  <MovieCard
                    key={
                      movie.id ??
                      movie.movieId ??
                      movie.tconst ??
                      movie.primaryTitle
                    }
                    movie={movie}
                  />
                ))}
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPageMovies}
                  totalPages={totalPagesMovies}
                  onPageChange={handlePageChangeMovies}
                />
              </div>
            </section>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No movies found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
