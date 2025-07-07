import Link from "next/link";
type Movie = {
  id: string;
  title: string;
  year: string;
  rating: number | string;
  image: string | { url: string };
  platform: string;
  description: string;
  url: string;
};
export default function MovieCard({ movie }: { movie: Movie }) {
  const imageUrl =
    typeof movie.image === "string"
      ? movie.image
      : movie.image?.url || "/fallback.jpg";

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden transition hover:scale-105 duration-300">
      <Link href={`/Movies/${movie.id}`}>
        <img
          src={imageUrl}
          alt={movie.title}
          width={300}
          height={450}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">
            {movie.title} Download 480P || 1080P Hindi || English{" "}
          </h3>
          <div className="flex justify-between">
            <p className="text-sm text-gray-400">{movie.year}</p>
            <p className="text-yellow-400 font-bold">⭐ {movie.rating}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
