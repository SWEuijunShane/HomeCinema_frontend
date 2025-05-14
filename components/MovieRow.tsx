// MovieRow.tsx
import React from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  popularity: number;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-semibold mb-2 px-4">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 px-4 scrollbar-hide">
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[150px]">
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
            <p className="text-white text-sm mt-1 truncate">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default MovieRow;