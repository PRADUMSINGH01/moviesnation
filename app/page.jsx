"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import MovieSearch from "@/components/MovieSearch";
import localMovies from "../data/Latest.json";
import latestMovies from "../data/movies.json";

// Reusable Pagination Component
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
  const [latest, setLatest] = useState([]);
  const [currentPageMovies, setCurrentPageMovies] = useState(1);
  const [currentPageLatest, setCurrentPageLatest] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (Array.isArray(localMovies) && localMovies.length > 0) {
          setMovies(localMovies);
          setLatest(latestMovies);
          setIsLoading(false);
          return;
        }

        const apiRes = await fetch("/api/fetch-latest", { cache: "no-store" });
        if (!apiRes.ok) throw new Error("Failed to fetch movies from API");

        const apiData = await apiRes.json();
        if (Array.isArray(apiData)) {
          setMovies(apiData);
        } else if (apiData.movies) {
          setMovies(apiData.movies);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Failed to load movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Main Movies
  const filteredMovies = movies.filter((movie) =>
    movie.primaryTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPagesMovies = Math.ceil(filteredMovies.length / itemsPerPage);
  const displayedMovies = filteredMovies.slice(
    (currentPageMovies - 1) * itemsPerPage,
    currentPageMovies * itemsPerPage
  );

  // Latest Movies
  const totalPagesLatest = Math.ceil(latest.length / itemsPerPage);
  const displayedLatest = latest.slice(
    (currentPageLatest - 1) * itemsPerPage,
    currentPageLatest * itemsPerPage
  );

  return (
    <div className="pt-24 pb-16 px-4">
      <MovieSearch onSearch={setSearchQuery} />

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

      {!isLoading && (
        <>
          {/* Movies Section */}
          {displayedMovies.length > 0 && (
            <section className="max-w-7xl mx-auto mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                {displayedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPageMovies}
                  totalPages={totalPagesMovies}
                  onPageChange={setCurrentPageMovies}
                />
              </div>
            </section>
          )}

          {/* Latest Movies Section */}
          {displayedLatest.length > 0 && (
            <section className="max-w-7xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4">
                Latest Movies
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedLatest.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPageLatest}
                  totalPages={totalPagesLatest}
                  onPageChange={setCurrentPageLatest}
                />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
