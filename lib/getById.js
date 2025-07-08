import { processMovieData } from "../app/Movies/[Slug]/processMovieData";

/**
 * Retrieves and processes a movie by ID from localStorage.
 * @param {string} id - The IMDb movie ID to look up.
 * @returns {object|null} - A processed Movie object, or null if not found or on error.
 */
export function getMovieByIdFromLocal(id) {
  try {
    const raw = localStorage.getItem("moviesDataaa");
    if (!raw) {
      console.warn("No 'moviesDataaa' key found in localStorage");
      return null;
    }

    let parsed = JSON.parse(raw);

    // If stored object contains the array under a property, extract it
    if (!Array.isArray(parsed)) {
      if (parsed.data && Array.isArray(parsed.data)) {
        parsed = parsed.data;
      } else if (parsed.results && Array.isArray(parsed.results)) {
        parsed = parsed.results;
      } else if (parsed.movies && Array.isArray(parsed.movies)) {
        parsed = parsed.movies;
      } else {
        console.error(
          "Expected 'moviesDataaa' to be an array or contain an array under 'data', 'results', or 'movies'"
        );
        return null;
      }
    }

    const movies = parsed;
    const match = movies.find((m) => String(m.id) === String(id));
    if (!match) {
      console.info(`Movie with id ${id} not found in 'moviesDataaa'`);
      return null;
    }

    // Normalize and return the movie
    return processMovieData(match);
  } catch (err) {
    console.error("Failed to parse or process 'moviesDataaa':", err);
    return null;
  }
}
