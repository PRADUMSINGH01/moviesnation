"use client";
// app/page.tsx
import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import Script from "next/script";
import MovieSearch from "@/components/MovieSearch";

export default function Home() {
  // Sample data (replace with fetched data as needed)
  const featuredMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      platform: "Prime",
    },
    { id: 2, title: "Inception", year: 2010, rating: 8.8, platform: "Netflix" },
    {
      id: 3,
      title: "Avengers: Endgame",
      year: 2019,
      rating: 8.4,
      platform: "Disney+",
    },
    {
      id: 4,
      title: "Dune: Part Two",
      year: 2024,
      rating: 8.7,
      platform: "HBO Max",
    },
    {
      id: 5,
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      platform: "Netflix",
    },
    { id: 6, title: "Parasite", year: 2019, rating: 8.6, platform: "Prime" },
    { id: 7, title: "Joker", year: 2019, rating: 8.5, platform: "HBO Max" },
    {
      id: 8,
      title: "Mad Max: Fury Road",
      year: 2015,
      rating: 8.1,
      platform: "Netflix",
    },
  ];

  // Pagination state
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(featuredMovies.length / itemsPerPage);

  // Compute movies for current page
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = featuredMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedMovies = filteredMovies.slice(startIdx, endIdx);

  return (
    <div className="pt-24 pb-16">
      <MovieSearch onSearch={setSearchQuery} />

      {/* Featured Movies */}
      <Script
        strategy="afterInteractive"
        data-cfasync="false"
        src="//pl27094209.profitableratecpm.com/5f0fe2e0ad86538bbdddc0db3ac3f5a9/invoke.js"
      ></Script>
      <div id="container-5f0fe2e0ad86538bbdddc0db3ac3f5a9"></div>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination Controls */}
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
