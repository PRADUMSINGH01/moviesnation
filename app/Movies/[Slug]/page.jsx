"use client";

import { processMovieData } from "./processMovieData";
import MovieTemplate from "./MovieTemplate";
import data from "@/data/Latest.json";
import { use } from "react";

export default function Page({ params }) {
  // Client components can access params directly
  const { Slug } = use(params); // unwrap Promise

  const slugLower = Slug.toLowerCase();

  const rawMovie = data.find(
    (m) =>
      m.id.toLowerCase() === slugLower ||
      m.primaryTitle.toLowerCase().replace(/\s+/g, "-") === slugLower
  );
  console.log(rawMovie);

  if (!rawMovie) return <div>Movie not found</div>;

  const movie = processMovieData(rawMovie);

  return <MovieTemplate movieData={movie} />;
}
