interface Movie {
  id: string;
  primaryTitle: string;
  originalTitle: string;
  description: string;
  primaryImage: string;
  trailer: string;
  contentRating: string;
  releaseDate: string;
  runtimeMinutes: number;
  averageRating: number;
  numVotes: number;
  metascore: number;
  genres: string[];
  interests: string[];
  countriesOfOrigin: string[];
  spokenLanguages: string[];
  filmingLocations: string[];
  productionCompanies: Array<{ name: string }>;
  budget: number;
  grossWorldwide: number;
  directors: Array<{ fullName: string }>;
  writers: Array<{ fullName: string }>;
  cast: Array<{
    fullName: string;
    primaryImage: string | null;
    job: string;
    characters: string[];
  }>;
}

//export type Movie = ReturnType<typeof processMovieData>;
function processMovieData(item: any): Movie {
  return {
    id: item.id || "N/A",
    primaryTitle: item.primaryTitle || "Untitled",
    originalTitle: item.originalTitle || "Untitled",
    description: item.description || "No description available",
    primaryImage:
      typeof item.primaryImage === "string"
        ? item.primaryImage
        : item.primaryImage?.url || "",
    trailer: item.trailer?.link || "",
    contentRating: item.contentRating || "N/A",
    releaseDate: item.releaseDate || "N/A",
    runtimeMinutes: Number(item.runtime?.seconds) / 60 || 0,
    averageRating: item.ratings?.averageRating || 0,
    numVotes: item.ratings?.numVotes || 0,
    metascore: item.metascore || 0,
    genres: item.genres || [],
    interests: item.interests || [],
    countriesOfOrigin: item.countriesOfOrigin || [],
    spokenLanguages: item.spokenLanguages || [],
    filmingLocations: item.filmingLocations || [],
    productionCompanies: item.productionCompanies || [],
    budget: item.budget?.amount || 0,
    grossWorldwide: item.grossWorldwide?.amount || 0,
    directors: item.directors || [],
    writers: item.writers || [],
    cast:
      item.cast?.map((actor: any) => ({
        fullName: actor.name?.nameText?.text || "Unknown",
        primaryImage: actor.primaryImage?.url || null,
        job: actor.attributes?.[0] || "Actor",
        characters: actor.characters?.map((char: any) => char.name) || [],
      })) || [],
  };
}

export async function getMovieById(id: string): Promise<Movie | null> {
  const url = `https://imdb236.p.rapidapi.com/api/imdb/${id}`;
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

    const result = await response.json();

    let movieData: any;
    if (Array.isArray(result)) {
      movieData = result[0];
    } else if (result.results && Array.isArray(result.results)) {
      movieData = result.results[0];
    } else {
      movieData = result;
    }
    console.log(movieData, "----server-");
    return processMovieData(movieData);
  } catch (error) {
    console.error(`Failed to fetch movie ${id}:`, error);
    return null;
  }
}
