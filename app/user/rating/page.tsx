'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; // ✅ 링크 import

interface UserRatingDto {
  movieId: number;
  movieTitle: string;
  rating: number;
  posterPath: string;
}

export default function UserRatingPage() {
  const [ratings, setRatings] = useState<UserRatingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:8080/api/movieRating/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRatings(res.data);
      } catch (err) {
        console.error('영화 평점 목록 불러오기 실패:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const groupedRatings: Record<string, UserRatingDto[]> = ratings.reduce((acc, r) => {
    const key = r.rating.toFixed(1);
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {} as Record<string, UserRatingDto[]>);

  const sortedRatings = Object.entries(groupedRatings).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">별점별 내가 평가한 영화</h1>
      {ratings.length === 0 ? (
        <p>아직 평점을 남긴 영화가 없습니다.</p>
      ) : (
        sortedRatings.map(([rating, movies]) => (
          <div key={rating} className="mb-8">
            <div className="flex justify-between items-center mb-2 border-b pb-1">
              <h2 className="text-lg font-semibold">
                {rating} Rated <span className="text-gray-500">{movies.length}</span>
              </h2>
            </div>
<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
  {movies.map((movie) => (
    <li key={movie.movieId} className="text-center">
      <Link href={`/movie/${movie.movieId}`}>
        <img
          src={`https://image.tmdb.org/t/p/w154${movie.posterPath}`}
          alt={movie.movieTitle}
          className="w-full max-w-[154px] h-auto mx-auto rounded hover:opacity-90 transition"
        />
        <p className="text-sm font-medium truncate">{movie.movieTitle}</p>
      </Link>
    </li>
  ))}
</ul>
          </div>
        ))
      )}
    </div>
  );
}
