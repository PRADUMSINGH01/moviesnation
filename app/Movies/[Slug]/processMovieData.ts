// lib/processMovieData.ts

// Define the raw response structure (you can update this type to match exact API shape)
type RawMovie = {
  id: string;
  primaryTitle?: string;
  originalTitle?: string;
  description?: string;
  primaryImage?: string | { url?: string };
  trailer?: { link?: string };
  contentRating?: string;
  releaseDate?: string;
  runtime?: { seconds?: number };
  ratings?: { averageRating?: number; numVotes?: number };
  metascore?: number;
  genres?: string[];
  interests?: string[];
  countriesOfOrigin?: string[];
  spokenLanguages?: string[];
  filmingLocations?: string[];
  productionCompanies?: { name: string }[];
  budget?: { amount?: number };
  grossWorldwide?: { amount?: number };
  directors?: { fullName: string }[];
  writers?: { fullName: string }[];
  cast?: any[]; // You can type this more strictly later
};

// Define the Movie type (import this from MovieTemplate if needed)
import { Movie } from "./MovieTemplate";
export function processMovieData(item: RawMovie): Movie {
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
    runtimeMinutes: Math.floor(Number(item.runtime?.seconds || 0) / 60),
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
        characters: actor.characters?.map((char: any) => char) || [],
      })) || [],
  };
}
