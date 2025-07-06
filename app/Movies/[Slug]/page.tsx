// app/movie/[slug]/page.tsx
import { Metadata } from "next";
import { FaPlay, FaStar, FaCalendarAlt, FaTv } from "react-icons/fa";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = "Inception (2010) | Movie Review, Cast, Story & Rating";
  const description =
    "Read a full review of Inception (2010), featuring story, cast, screenshots, ratings, and streaming platform details. Watch the trailer and discover more.";
  const image =
    "https://image.tmdb.org/t/p/w780/rqAHkvXldb9tHlnbQDwOzRi0yVD.jpg";

  return {
    title,
    description,
    keywords: [
      "Inception",
      "movie review",
      "movie rating",
      "watch trailer",
      "Leonardo DiCaprio",
      "sci-fi thriller",
    ],
    openGraph: {
      title,
      description,
      images: [image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};

const MovieSlugPage = () => {
  const movie = {
    title: "Inception",
    year: 2010,
    rating: 8.8,
    platform: "Netflix",
    posterUrl:
      "https://image.tmdb.org/t/p/w780/rqAHkvXldb9tHlnbQDwOzRi0yVD.jpg",
    story:
      "Dom Cobb is a thief with the rare ability to enter people's dreams and steal their secrets. He is given a chance to have his criminal history erased in exchange for implanting another person's idea into a target's subconscious.",
    cast: [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Elliot Page",
      "Tom Hardy",
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white px-4 py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start mt-10">
        {/* Movie Poster */}
        <div className="w-full md:w-1/2 relative">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="rounded-3xl shadow-2xl border border-zinc-800 object-cover w-full h-full"
          />
          <div className="absolute bottom-4 left-4 bg-purple-600/90 px-4 py-2 rounded-full text-sm shadow-md">
            <FaTv className="inline-block mr-2" /> {movie.platform}
          </div>
        </div>

        {/* Movie Details */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-purple-200">
            {movie.title}{" "}
            <span className="text-white text-3xl">({movie.year})</span>
          </h1>

          <div className="flex flex-wrap gap-4 text-zinc-400 text-sm font-medium">
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-400" /> {movie.rating}/10
            </span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt /> {movie.year}
            </span>
          </div>

          <div className="bg-zinc-800/80 backdrop-blur-lg p-6 rounded-2xl border border-zinc-700 shadow-md">
            <h2 className="text-xl font-semibold text-purple-400 mb-3">
              Story
            </h2>
            <p className="text-gray-300 leading-relaxed text-justify">
              {movie.story}
            </p>
          </div>

          <div className="bg-zinc-800/80 backdrop-blur-lg p-6 rounded-2xl border border-zinc-700 shadow-md">
            <h2 className="text-xl font-semibold text-purple-400 mb-3">Cast</h2>
            <div className="flex flex-wrap gap-3">
              {movie.cast.map((actor, i) => (
                <span
                  key={i}
                  className="bg-zinc-700 px-4 py-2 rounded-full border border-zinc-600 text-sm text-white hover:bg-purple-600 transition"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>

          {/* Trailer + Links */}
          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-2 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-full transition-all shadow-xl text-sm font-semibold">
              <FaPlay className="text-white" /> Watch Trailer
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="#"
                className="text-center bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-medium"
              >
                📥 Download Link 1
              </a>
              <a
                href="#"
                className="text-center bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-sm font-medium"
              >
                📥 Download Link 2
              </a>
              <a
                href="#"
                className="text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium"
              >
                ▶️ Watch Now 1
              </a>
              <a
                href="#"
                className="text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium"
              >
                ▶️ Watch Now 2
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MovieSlugPage;
