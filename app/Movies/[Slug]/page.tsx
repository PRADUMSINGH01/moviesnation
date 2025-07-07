import { processMovieData } from "./processMovieData";
import MovieTemplate from "./MovieTemplate";
import { getMovieById } from "@/lib/getById"; // Your API logic

export default async function Page({ params }: { params: { Slug: string } }) {
  const rawMovie = await getMovieById(params.Slug);
  const movie = processMovieData(rawMovie); // ✅ convert safely

  return <MovieTemplate movie={movie} />;
}
