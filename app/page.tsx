"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import Script from "next/script";
import MovieSearch from "@/components/MovieSearch";
import { getLatestMovies } from "@/lib/getlatest";

import { Movie } from "@/types";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const cacheKey = "moviesDataaa";

      try {
        // Check localStorage for cached data
        const cachedData = localStorage.getItem(cacheKey);
        const now = new Date();
        console.log(cachedData, "cachedData---");
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          const cacheTimestamp = new Date(parsedCache.timestamp).getTime();
          const cacheAge = now.getTime() - cacheTimestamp;

          // Use cache if less than 24 hours old (86400000 ms)
          if (cacheAge < 86400000) {
            setMovies(parsedCache.data);
            setIsLoading(false);
            return;
          }
        }

        // Fetch new data if no valid cache
        const latest = await getLatestMovies();
        console.log(latest, "latest--");
        setMovies(latest);

        // Update cache
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: latest,
            timestamp: now.toISOString(),
          })
        );
      } catch (err) {
        console.error("Failed to load movies:", err);
        setError("Failed to load movies. Please try again later.");

        // Attempt to show expired cache if available
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          setMovies(parsedCache.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.primaryTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedMovies = filteredMovies.slice(startIdx, endIdx);

  return (
    <div className="pt-24 pb-16">
      <MovieSearch onSearch={setSearchQuery} />

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-300">Loading movies...</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 text-center py-8">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-red-400 font-medium">{error}</p>
            {movies.length === 0 && (
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded transition"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Movie Grid */}
      {!isLoading && movies.length > 0 && (
        <>
          <Script
            strategy="afterInteractive"
            data-cfasync="false"
            src="//pl27094209.profitableratecpm.com/5f0fe2e0ad86538bbdddc0db3ac3f5a9/invoke.js"
          />
          <div id="container-5f0fe2e0ad86538bbdddc0db3ac3f5a9"></div>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            {searchQuery && (
              <div className="mb-6 text-center">
                <p className="text-gray-400">
                  Showing {displayedMovies.length} of {filteredMovies.length}{" "}
                  results for "{searchQuery}"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => goToPage(idx + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === idx + 1
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {/* Empty state */}
      {!isLoading && movies.length === 0 && !error && (
        <div className="max-w-7xl mx-auto px-4 text-center py-12">
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No Movies Found
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any movies. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* No search results */}
      {!isLoading && movies.length > 0 && filteredMovies.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 text-center py-12">
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500 mb-4">
              No movies match your search for "{searchQuery}". Try different
              keywords.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded transition"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
