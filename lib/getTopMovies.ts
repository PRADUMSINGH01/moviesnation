type MovieApiResponse = {
  id: string;
  primaryTitle?: string;
  originalTitle?: string;
  startYear?: string;
  averageRating?: number;
  primaryImage?: string | { url: string };
  description?: string;
  url: string;
};

// Helper function to process movie data
function processMovieData(item: MovieApiResponse) {
  // Handle both string and object formats for primaryImage
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
    rating: item.averageRating || "N/A",
    image: imageUrl,
    platform: "IMDb",
    description: item.description || "",
    url: item.url,
  };
}

export async function getTopMovies() {
  const topUrl = "https://imdb236.p.rapidapi.com/api/imdb/top250-movies";
  // const upcomingUrl =
  //"https://imdb236.p.rapidapi.com/api/imdb/upcoming-releases?countryCode=US&type=MOVIE";

  const options: RequestInit = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "1a23d5e762mshc6bdd66106811a0p1f4639jsn258336f3b440",
      "x-rapidapi-host": "imdb236.p.rapidapi.com",
    },
    next: { revalidate: 86400 }, // 24-hour cache
  };

  try {
    // Fetch both endpoints in parallel
    const [topRes] = await Promise.all([fetch(topUrl, options)]);

    // Check responses
    if (!topRes.ok) {
      throw new Error(
        `Top movies failed: ${topRes.status} ${topRes.statusText}`
      );
    }

    // Parse JSON responses
    const topMovies: MovieApiResponse[] = await topRes.json();

    return [...topMovies.map(processMovieData)];
  } catch (err) {
    console.error("❌ Failed to fetch movies:", err);
    return [];
  }
}
