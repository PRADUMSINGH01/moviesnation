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

export async function getTopMovies() {
  const url = "https://imdb236.p.rapidapi.com/api/imdb/top250-movies";

  const options: RequestInit = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "1a23d5e762mshc6bdd66106811a0p1f4639jsn258336f3b440",
      "x-rapidapi-host": "imdb236.p.rapidapi.com",
    },
    // ✅ Enable 24 hour caching (86400 seconds)
    next: { revalidate: 86400 },
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const movies = await res.json();
    console.log("✅ API Data:", movies);

    return movies.map((item: MovieApiResponse) => ({
      id: item.id,
      title: item.primaryTitle || item.originalTitle,
      year: item.startYear || "N/A",
      rating: item.averageRating || "N/A",
      image: item.primaryImage,
      platform: "IMDb",
      description: item.description || "",
      url: item.url,
    }));
  } catch (err) {
    console.error("❌ Failed to fetch movies:", err);
    return [];
  }
}
