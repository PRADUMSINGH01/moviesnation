import { Movie } from "@/app/Movies/[Slug]/MovieTemplate";
import { RawMovie } from "../types";
import { processMovieData } from "../app/Movies/[Slug]/processMovieData";

interface ApiResponse {
  results?: RawMovie[];
  [key: string]: unknown;
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

    const result: ApiResponse | RawMovie[] = await response.json();

    let movieData: RawMovie;

    if (Array.isArray(result)) {
      movieData = result[0] as RawMovie;
    } else if (result.results && Array.isArray(result.results)) {
      movieData = result.results[0] as RawMovie;
    } else {
      movieData = result as RawMovie;
    }

    return processMovieData(movieData);
  } catch (error: unknown) {
    console.error(`Failed to fetch movie ${id}:`, error);
    return null;
  }
}
