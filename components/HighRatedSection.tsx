'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface RatedMovieForAi {
  tmdbId: number;
  title: string;
  genres: string[];
  rating: number;
  posterPath: string;
}

export default function HighRatedSection() {
  const [movies, setMovies] = useState<RatedMovieForAi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighRated = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taste/high-rated`, {
          headers: { Authorization: `Bearer ${token}` },
        });

    const sorted = res.data
    .filter((movie: RatedMovieForAi) => movie.rating >= 4.0)
    .sort((a: RatedMovieForAi, b: RatedMovieForAi) => b.rating - a.rating);

        setMovies(sorted.slice(0,3));
      } catch (err) {
        console.error(err);
        setError('불러오기 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchHighRated();
  }, []);

  if (loading) return <p className="text-center">불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (movies.length === 0) return <p className="text-center">4점 이상 준 영화가 없습니다.</p>;

  return (
    <section className="mb-5">
  <h2 className="text-xl font-bold mb-5">선호 영화</h2>
      <div className="flex justify-center gap-6 flex-wrap">
        {movies.slice(0, 3).map((movie) => (
          <Link
            key={movie.tmdbId}
            href={`/movie/${movie.tmdbId}`}
            className="flex flex-col items-center text-center w-28 sm:w-32"
          >
            <div className="w-full aspect-[2/3] bg-white rounded-md shadow-md overflow-hidden">
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-white">?</div>
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-800 truncate w-full">{movie.title}</p>
            <p className="text-xs text-gray-500">{movie.rating.toFixed(1)}점</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
