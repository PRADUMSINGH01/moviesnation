"use client";

import { processMovieData } from "./processMovieData";
import MovieTemplate from "./MovieTemplate";
import data from "@/data/movies.json";
import moremovies from "@/data/IND.json";
import indtomo from "@/data/INDTOPM.json";
import TV from "@/data/TV.json";

import { use } from "react";
import AdManager from "./Ads";
export default function Page({ params }) {
  // Client components can access params directly
  const full = [...data, ...moremovies, ...indtomo, ...TV];
  const { Slug } = use(params); // unwrap Promise
  const slugLower = Slug.toLowerCase();

  const rawMovie = full.find(
    (m) =>
      m.id.toLowerCase() === slugLower ||
      m.primaryTitle.toLowerCase().replace(/\s+/g, "-") === slugLower
  );

  if (!rawMovie) return <div>Movie not found</div>;

  const movie = processMovieData(rawMovie);

  return (
    <div className="">
      <AdManager />
      <MovieTemplate movieData={movie} />;
    </div>
  );
}
