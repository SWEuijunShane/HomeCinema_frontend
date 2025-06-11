'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserRatingDto {
  movieId: number;
  movieTitle: string;
  rating: number;
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

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">내가 매긴 영화 평점</h1>
      {ratings.length === 0 ? (
        <p>아직 평점을 남긴 영화가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {ratings.map((r) => (
            <li key={r.movieId} className="p-4 bg-white shadow rounded">
              <h2 className="text-lg font-semibold">{r.movieTitle}</h2>
              <p className="text-sm text-gray-600">평점: {r.rating.toFixed(1)} ⭐</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
