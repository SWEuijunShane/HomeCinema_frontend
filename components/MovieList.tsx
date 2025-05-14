import React, { useEffect, useState } from 'react';
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
          <div key={movie.id} className="flex-none w-40">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-image.jpg'}
              alt={movie.title}
              className="w-full rounded-lg transition-transform transform hover:scale-105"
            />
            <h4 className="text-sm mt-2">{movie.title}</h4>
            <p className="text-xs text-gray-500">{movie.release_date}</p>
          </div>
        ))}
      </div>
      </section>
      
      <section id="diary" className='scroll-mt-20'>
      <h2 className="text-2xl font-bold mb-4">높은 평점</h2>
      <div className="flex overflow-x-auto space-x-4 py-4">
        {topRatedMovies.map((movie) => (
          <div key={movie.id} className="flex-none w-40">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-image.jpg'}
              alt={movie.title}
              className="w-full rounded-lg transition-transform transform hover:scale-105"
            />
            <h4 className="text-sm mt-2">{movie.title}</h4>
            <p className="text-xs text-gray-500">{movie.release_date}</p>
          </div>
        ))}
      </div>
      </section>
      <section id="recommend" className='scroll-mt-20'>
      <h2 className="text-2xl font-bold mb-4">최신 개봉</h2>
      <div className="flex overflow-x-auto space-x-4 py-4">
        {nowPlayingMovies.map((movie) => (
          <div key={movie.id} className="flex-none w-40">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-image.jpg'}
              alt={movie.title}
              className="w-full rounded-lg transition-transform transform hover:scale-105"
            />
            <h4 className="text-sm mt-2">{movie.title}</h4>
            <p className="text-xs text-gray-500">{movie.release_date}</p>
          </div>
        ))}
      </div>
      </section>

      <section id="analysis" className='scroll-mt-20'>
      <h2 className="text-2xl font-bold mb-4">개봉 예정</h2>
      <div className="flex overflow-x-auto space-x-4 py-4">
        {upcomingMovies.map((movie) => (
          <div key={movie.id} className="flex-none w-40">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-image.jpg'}
              alt={movie.title}
              className="w-full rounded-lg transition-transform transform hover:scale-105"
            />
            <h4 className="text-sm mt-2">{movie.title}</h4>
            <p className="text-xs text-gray-500">{movie.release_date}</p>
          </div>
        ))}
      </div>
      </section>
    </div>
  );
};

export default MovieList;
