"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import Script from "next/script";
import MovieSearch from "@/components/MovieSearch";
import { getTopMovies } from "@/lib/getTopMovies";
import { getLatestMovies } from "@/lib/getlatest";
type Movie = {
  id: string;
  title: string;
  year: string;
  rating: number | string;
  image: string | { url: string };
  platform: string;
  description: string;
  url: string;
};
export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 12;
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      const movieList = await getTopMovies();
      const latest = await getLatestMovies();
      setMovies([...latest]);
    };
    fetchData();
  }, []);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedMovies = filteredMovies.slice(startIdx, endIdx);

  return (
    <div className="pt-24 pb-16">
      <MovieSearch onSearch={setSearchQuery} />

      {/* Ad script */}
      <Script
        strategy="afterInteractive"
        data-cfasync="false"
        src="//pl27094209.profitableratecpm.com/5f0fe2e0ad86538bbdddc0db3ac3f5a9/invoke.js"
      ></Script>
      <div id="container-5f0fe2e0ad86538bbdddc0db3ac3f5a9"></div>

      {/* Movie Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination */}
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
      </section>
    </div>
  );
}
