// components/CategorySection.tsx
import Link from "next/link";
import MovieCard from "./MovieCard";

const CategorySection = ({
  title,
  description,
  category,
}: {
  title: string;
  description: string;
  category: string;
}) => {
  const movies = [
    { id: 1, title: "Movie 1", year: 2023, rating: 7.8, platform: category },
    { id: 2, title: "Movie 2", year: 2023, rating: 8.2, platform: category },
    { id: 3, title: "Movie 3", year: 2022, rating: 7.5, platform: category },
    { id: 4, title: "Movie 4", year: 2024, rating: 8.9, platform: category },
  ];

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </div>
        <Link
          href={`/category/${category}`}
          className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
        >
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
