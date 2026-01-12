'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './swiper-custom.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
}

const MovieCoverflow: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, ] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('요즘 인기 🔥');
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'popular';

  const fetchMovies = (endpoint: string, titleLabel: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Access token not found');
      return;
    }

    setSelectedTitle(titleLabel);

    axios
      .get(`/api/tmdb/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error(`${endpoint} 영화 호출 실패:`, err));
  };

  useEffect(() => {
    fetchMovies(categoryParam, '요즘 인기 🔥');
  }, [categoryParam]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section id="popular">
      <div className="bg-black text-white flex flex-col items-center py-10 min-h-screen px-4">
        

{/* 🔘 필터 버튼 */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 w-full max-w-2xl ">
  <button
    onClick={() => fetchMovies('popular', '요즘 인기 🔥')}
    className="px-4 py-2 border border-gray-300 rounded transition-all duration-200 ease-in-out transform hover:bg-zinc-800 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2"
  >
    요즘 인기
  </button>
  <button
    onClick={() => fetchMovies('top-rated', '높은 평점 🌟')}
    className="px-4 py-2 border border-gray-300 rounded transition-all duration-200 ease-in-out transform hover:bg-zinc-800 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2"
  >
    높은 평점
  </button>
  <button
    onClick={() => fetchMovies('now-playing', '최신 개봉 🎬')}
    className="px-4 py-2 border border-gray-300 rounded transition-all duration-200 ease-in-out transform hover:bg-zinc-800 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2"
  >
    최신 개봉
  </button>
  <button
    onClick={() => fetchMovies('upcoming', '개봉 예정 🎞️')}
    className="px-4 py-2 border border-gray-300 rounded transition-all duration-200 ease-in-out transform hover:bg-zinc-800 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2"
  >
    개봉 예정
  </button>
</div>


        <h2 className="text-3xl font-bold mb-10 mt-20 mb-15">{selectedTitle}</h2>

        {/* 🎞️ 영화 슬라이더 */}
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          modules={[EffectCoverflow]}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 200,
            modifier: 1.3,
            slideShadows: false,
          }}
          className="custom-coverflow-swiper w-full max-w-5xl"
        >
          {filteredMovies.map((movie) => (
            <SwiperSlide
              key={movie.id}
              className="custom-coverflow-slide cursor-pointer"
              onClick={() => router.push(`/movie/${movie.id}`)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/no-image.jpg'
                }
                alt={movie.title}
                className="transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default MovieCoverflow;
