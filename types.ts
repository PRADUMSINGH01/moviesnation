// lib/types.ts

export type CastMember = {
  name?: {
    nameText?: {
      text?: string;
    };
  };
  primaryImage?: {
    url?: string;
  };
  attributes?: string[];
  characters?: { name: string }[];
};

export type RawMovie = {
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
  cast?: CastMember[];
};

export type Movie = {
  id: string;
  primaryTitle: string;
  originalTitle: string;
  description: string;
  primaryImage: string | { url: string };
  trailer?: string | null;
  contentRating?: string | null;
  releaseDate?: string | null;
  runtimeMinutes?: number | null;
  averageRating?: number | null;
  numVotes?: number | null;
  metascore?: number | null;
  genres?: string[];
  interests?: string[];
  countriesOfOrigin?: string[];
  spokenLanguages?: string[];
  filmingLocations?: string[];
  productionCompanies?: { name: string }[];
  budget?: number | null;
  grossWorldwide?: number | null;
  directors?: { fullName: string }[];
  writers?: { fullName: string }[];
  cast?: {
    fullName: string;
    primaryImage?: string | null;
    job?: string;
    characters?: string[];
  }[];
};
