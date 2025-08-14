import Link from "next/link";
type Movie = {
  id: string;
  primaryTitle: string;
  primaryImage: string | { url: string };
};
import Image from "next/image";
export default function MovieCard({ movie }: { movie: Movie }) {
  const imageUrl =
    typeof movie.primaryImage === "string"
      ? movie.primaryImage
      : movie.primaryImage?.url || "/fallback.jpg";

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden transition hover:scale-105 duration-300">
      <Link href={`/Movies/${movie.primaryTitle.replace(/\s+/g, "-")}`}>
        <Image
          src={imageUrl}
          alt={movie.primaryTitle}
          width={300}
          height={450}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">
            {movie.primaryTitle} Download 480P || 1080P Hindi || English{" "}
          </h3>
        </div>
      </Link>
    </div>
  );
}
