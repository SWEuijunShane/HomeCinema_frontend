// /app/otherUser/[id]/rating/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface UserRatingDto {
  movieId: number;
  movieTitle: string;
  rating: number;
  posterPath: string;
}

export default function OtherUserRatingPage() {
  const { id } = useParams();
  const [ratings, setRatings] = useState<UserRatingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movieRating/${id}`);
        setRatings(res.data);
      } catch (err) {
        console.error('유저 평점 정보 로딩 실패:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [id]);

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
    <div className="p-4 max-w-4xl mx-auto pt-20">
      {ratings.length === 0 ? (
        <p>해당 사용자가 남긴 평점이 없습니다.</p>
      ) : (
        sortedRatings.map(([rating, movies]) => (
          <div key={rating} className="mb-8">
            <div className="flex justify-between items-center mb-2 border-b pb-1">
              <h2 className="text-lg font-semibold">
                ⭐ {rating}점 <span className="text-gray-500">({movies.length})</span>
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
                    <p className="text-sm font-medium truncate mt-1">{movie.movieTitle}</p>
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
