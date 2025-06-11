'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface MovieDto {
  id: number;
  title: string;
  poster_path: string;      
  overview: string;
  release_date: string;
  vote_average: number;
}

export default function WantToWatchPage() {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:8080/api/userMovie/me/wantToWatch', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMovies(res.data);
      } catch (err) {
        console.error('보고싶어요 목록 불러오기 실패:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">내 보고싶어요 목록</h1>
      {movies.length === 0 ? (
        <p>보고싶어요 목록이 비어 있습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <li key={movie.id} className="bg-white shadow p-2 rounded">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-64 object-cover mb-2"
              />
              <h2 className="text-base font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-500">{movie.release_date}</p>
              <p className="text-sm text-yellow-600">⭐ {movie.vote_average}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
