// components/MovieCard.tsx
import Link from "next/link";
interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  platform: string;
  posterUrl?: string; // optional, if you're showing poster
}
const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative">
        <div className="bg-gray-700 border-2 border-dashed rounded-t-xl w-full h-48" />
        <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 px-2 py-1 rounded-md">
          <span className="text-yellow-400 font-semibold">
            {movie.rating}/10
          </span>
        </div>
        <div className="absolute bottom-4 left-4 bg-purple-600 px-3 py-1 rounded-md text-sm font-medium">
          {movie.platform}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
        <p className="text-gray-400 mb-4">{movie.year}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {["HD", "4K"].map((quality) => (
              <span
                key={quality}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
              >
                {quality}
              </span>
            ))}
          </div>
          <Link
            href={`/movie/${movie.id}`}
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            Download
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
