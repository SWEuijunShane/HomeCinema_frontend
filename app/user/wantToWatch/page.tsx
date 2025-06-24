'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; // ✅ 링크 추가

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
    <div className="p-4 pt-20">
      {/* <h1 className="text-xl font-bold mb-4">내 보고싶어요 목록</h1> */}
      {movies.length === 0 ? (
        <p>보고싶어요 목록이 비어 있습니다.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="text-center">
              <img
                src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                alt={movie.title}
                className="w-full max-w-[154px] h-auto mx-auto rounded hover:opacity-90 transition"
              />
              <h2 className="text-sm mt-1 truncate">{movie.title}</h2>
              <p className="text-xs text-yellow-600">⭐ {movie.vote_average}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
