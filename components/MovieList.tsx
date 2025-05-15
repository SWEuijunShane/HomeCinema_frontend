'use client';


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ 올바른 import


import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

const MovieList: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/movie/${id}`);
  };

  useEffect(() => {
    // 인기 영화
    axios.get('http://localhost:8080/api/tmdb/popular')
      .then(response => {
        setPopularMovies(response.data.results);
      })
      .catch(error => {
        console.error('TMDB 인기 영화 호출 실패:', error);
      });

    // 높은 평점 영화
    axios.get('http://localhost:8080/api/tmdb/top-rated')
      .then(response => {
        setTopRatedMovies(response.data.results);
      })
      .catch(error => {
        console.error('TMDB 높은 평점 영화 호출 실패:', error);
      });

    // 최신 개봉 영화
    axios.get('http://localhost:8080/api/tmdb/now-playing')
      .then(response => {
        setNowPlayingMovies(response.data.results);
      })
      .catch(error => {
        console.error('TMDB 최신 개봉 영화 호출 실패:', error);
      });

    // 개봉 예정 영화
    axios.get('http://localhost:8080/api/tmdb/upcoming')
      .then(response => {
        setUpcomingMovies(response.data.results);
      })
      .catch(error => {
        console.error('TMDB 개봉 예정 영화 호출 실패:', error);
      });
  }, []);

  return (
    
    <div>
        <section id="calendar" className='scroll-mt-20'>
      <h2 className="text-2xl font-bold mb-4">요즘 인기</h2>
      <div className="flex overflow-x-auto space-x-4 py-4">
        {popularMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleClick(movie.id)}
            className="w-40 h-[320px] flex-shrink-0 cursor-pointer overflow-hidden transition-shadow"
          >
            <div className="w-full h-[240px]">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/no-image.jpg'
                }
                alt={movie.title || '영화 포스터'}
                className="w-full h-full object-cover hover:scale-105"
              />
            </div>

  <div className="px-1 py-2 h-[80px] flex flex-col">
    <h4 className="text-sm font-medium leading-tight line-clamp-2">{movie.title}</h4>
    <p className="text-xs text-gray-500">{movie.release_date}</p>
  </div>
</div>

        ))}
      </div>
      </section>
      
      <section id="diary" className='scroll-mt-20'>
      <h2 className="text-2xl font-bold mb-4">높은 평점</h2>
      <div className="flex overflow-x-auto space-x-4 py-4">
        {topRatedMovies.map((movie) => (
          <div
          key={movie.id}
          onClick={() => handleClick(movie.id)}
          className="w-40 h-[320px] flex-shrink-0 cursor-pointer overflow-hidden transition-shadow"
        >
          <div className="w-full h-[240px]">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/no-image.jpg'
              }
              alt={movie.title || '영화 포스터'}
              className="w-full h-full object-cover hover:scale-105"
            />
          </div>

<div className="px-1 py-2 h-[80px] flex flex-col">
  <h4 className="text-sm font-medium leading-tight line-clamp-2">{movie.title}</h4>
  <p className="text-xs text-gray-500">{movie.release_date}</p>
</div>
</div>
        ))}
      </div>
      </section>
      <section id="recommend" className='scroll-mt-20'>
      <h2 className="text-2xl font-bold mb-4">최신 개봉</h2>
      <div className="flex overflow-x-auto space-x-4 py-4">
        {nowPlayingMovies.map((movie) => (
          <div
          key={movie.id}
          onClick={() => handleClick(movie.id)}
          className="w-40 h-[320px] flex-shrink-0 cursor-pointer overflow-hidden transition-shadow"
        >
          <div className="w-full h-[240px]">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/no-image.jpg'
              }
              alt={movie.title || '영화 포스터'}
              className="w-full h-full object-cover hover:scale-105"
            />
          </div>

<div className="px-1 py-2 h-[80px] flex flex-col">
  <h4 className="text-sm font-medium leading-tight line-clamp-2">{movie.title}</h4>
  <p className="text-xs text-gray-500">{movie.release_date}</p>
</div>
</div>
        ))}
      </div>
      </section>

      <section id="analysis" className='scroll-mt-20'>
      <h2 className="text-2xl font-bold mb-4">개봉 예정</h2>
      <div className="flex overflow-x-auto space-x-4 py-4">
        {upcomingMovies.map((movie) => (
          <div
          key={movie.id}
          onClick={() => handleClick(movie.id)}
          className="w-40 h-[320px] flex-shrink-0 cursor-pointer overflow-hidden transition-shadow"
        >
          <div className="w-full h-[240px]">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/no-image.jpg'
              }
              alt={movie.title || '영화 포스터'}
              className="w-full h-full object-cover hover:scale-105"
            />
          </div>

<div className="px-1 py-2 h-[80px] flex flex-col">
  <h4 className="text-sm font-medium leading-tight line-clamp-2">{movie.title}</h4>
  <p className="text-xs text-gray-500">{movie.release_date}</p>
</div>
</div>
        ))}
      </div>
      </section>
    </div>
  );
};

export default MovieList;
