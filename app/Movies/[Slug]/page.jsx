"use client";

import { useEffect, useState } from "react";
import { processMovieData } from "./processMovieData";
import MovieTemplate from "./MovieTemplate";

export default function Page({ params }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function loadMovie() {
      const resolvedParams = await params;
      const slug = resolvedParams?.Slug;

      const rawMovie = getMovieByIdFromLocal(slug);
      const processedMovie = processMovieData(rawMovie);

      setMovie(processedMovie);
    }

    loadMovie();
  }, [params]);

  if (!movie) return <div>Loading...</div>;

  return <MovieTemplate movie={movie} />;
}
