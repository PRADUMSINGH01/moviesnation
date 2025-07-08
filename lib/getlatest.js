// Helper to normalize one movie object
function processMovieData(item) {
  let imageUrl = "";

  if (typeof item.primaryImage === "string") {
    imageUrl = item.primaryImage;
  } else if (item.primaryImage && typeof item.primaryImage === "object") {
    imageUrl = item.primaryImage.url || "";
  }

  return {
    id: item.id,
    title: item.primaryTitle || item.originalTitle || "Untitled",
    year: item.startYear || "N/A",
    rating: item.averageRating ?? "N/A",
    image: imageUrl,
    platform: "IMDb",
    description: item.description || "",
    url: item.url,
  };
}

// Fetch the most popular movies from the RapidAPI IMDb endpoint
export async function getLatestMovies() {
  const url = "https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "1a23d5e762mshc6bdd66106811a0p1f4639jsn258336f3b440",
      "x-rapidapi-host": "imdb236.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`IMDb API returned ${response.status}`);
    }

    const result = await response.json();
    // result might be an array or an object with a `results` array
    const rawMovies = Array.isArray(result)
      ? result
      : Array.isArray(result.results)
      ? result.results
      : [];

    console.log(rawMovies, "latest---");
    return rawMovies.map(processMovieData);
  } catch (err) {
    console.error("Failed to fetch latest movies:", err);
    return [];
  }
}
