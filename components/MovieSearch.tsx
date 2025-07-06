// components/MovieSearch.tsx
"use client";

import { useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
}

const MovieSearch = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6 flex justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="w-full max-w-md px-4 py-2 rounded-l-md bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-500 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default MovieSearch;
