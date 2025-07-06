// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const pathname = usePathname();
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  const platforms = [
    { name: "Hollywood", slug: "hollywood" },
    { name: "Bollywood", slug: "bollywood" },
    { name: "Netflix", slug: "netflix" },
    { name: "Prime", slug: "prime" },
    { name: "Hulu", slug: "hulu" },
    { name: "Disney+", slug: "disney" },
    { name: "HBO Max", slug: "hbo" },
  ];

  const years = Array.from({ length: 35 }, (_, i) => 2024 - i); // 2024 down to 1990
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setYearDropdownOpen(false);
      }
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node)
      ) {
        setGenreDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdowns when navigating
  useEffect(() => {
    setYearDropdownOpen(false);
    setGenreDropdownOpen(false);
  }, [pathname]);

  const toggleYearDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setYearDropdownOpen(!yearDropdownOpen);
    setGenreDropdownOpen(false);
  };

  const toggleGenreDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGenreDropdownOpen(!genreDropdownOpen);
    setYearDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900 shadow-lg py-2"
          : "bg-gray-900/90 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">MN</span>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MoviesFlix
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {platforms.map((platform) => (
              <Link
                key={platform.slug}
                href={`/category/${platform.slug}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === `/category/${platform.slug}`
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {platform.name}
              </Link>
            ))}

            {/* Year Dropdown */}
            <div className="relative" ref={yearDropdownRef}>
              <button
                onClick={toggleYearDropdown}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  yearDropdownOpen || pathname.startsWith("/year/")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                Year
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-1 h-4 w-4 transition-transform ${
                    yearDropdownOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {yearDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50 max-h-80 overflow-y-auto">
                  <div className="py-1">
                    {years.map((year) => (
                      <Link
                        key={year}
                        href={`/year/${year}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {year}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Genre Dropdown */}
            <div className="relative" ref={genreDropdownRef}>
              <button
                onClick={toggleGenreDropdown}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  genreDropdownOpen || pathname.startsWith("/genre/")
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                Genre
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-1 h-4 w-4 transition-transform ${
                    genreDropdownOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {genreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 border border-gray-700 z-50 max-h-80 overflow-y-auto">
                  <div className="py-1">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genre/${genre.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white capitalize"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
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
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-all">
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
          {platforms.map((platform) => (
            <Link
              key={platform.slug}
              href={`/category/${platform.slug}`}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === `/category/${platform.slug}`
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {platform.name}
            </Link>
          ))}

          {/* Year Dropdown Mobile */}
          <div className="px-3 py-2">
            <button
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
              className="w-full flex justify-between items-center text-gray-300 hover:text-white"
            >
              <span className="text-base font-medium">Year</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${
                  yearDropdownOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {yearDropdownOpen && (
              <div className="mt-2 grid grid-cols-3 gap-2 pl-4">
                {years.slice(0, 12).map((year) => (
                  <Link
                    key={year}
                    href={`/year/${year}`}
                    className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {year}
                  </Link>
                ))}
                <Link
                  href="/years"
                  className="block px-3 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium rounded col-span-3 text-center mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Years
                </Link>
              </div>
            )}
          </div>

          {/* Genre Dropdown Mobile */}
          <div className="px-3 py-2">
            <button
              onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
              className="w-full flex justify-between items-center text-gray-300 hover:text-white"
            >
              <span className="text-base font-medium">Genre</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${
                  genreDropdownOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {genreDropdownOpen && (
              <div className="mt-2 grid grid-cols-2 gap-2 pl-4">
                {genres.slice(0, 8).map((genre) => (
                  <Link
                    key={genre}
                    href={`/genre/${genre.toLowerCase()}`}
                    className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded capitalize"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {genre}
                  </Link>
                ))}
                <Link
                  href="/genres"
                  className="block px-3 py-2 text-sm text-purple-400 hover:text-purple-300 font-medium rounded col-span-2 text-center mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Genres
                </Link>
              </div>
            )}
          </div>

          <div className="flex space-x-2 px-3 py-2">
            <button className="flex-1 bg-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
              Search
            </button>
            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
