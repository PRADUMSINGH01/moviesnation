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

type Movie = ReturnType<typeof processMovieData>;

function processMovieData(item: MovieApiResponse) {
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

export async function getLatestMovies(): Promise<Movie[]> {
  const url = "https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies";
  const options: RequestInit = {
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

    // Parse JSON
    const result = (await response.json()) as
      | MovieApiResponse[]
      | { results: MovieApiResponse[] };

    // Normalize to an array of MovieApiResponse
    const rawMovies: MovieApiResponse[] = Array.isArray(result)
      ? result
      : Array.isArray((result as any).results)
      ? (result as any).results
      : [];

    // Map & return
    console.log(rawMovies, "latest---");
    return rawMovies.map(processMovieData);
  } catch (error) {
    console.error("Failed to fetch latest movies:", error);
    return []; // return an empty array on failure
  }
}
