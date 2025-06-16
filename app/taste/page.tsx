'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import HighRatedSection from './HighRatedSection';

interface TasteItemDto {
  id: number;
  name: string;
  imageUrl: string | null;
  count: number;
  tmdbId: number;
}

interface TasteProfileDto {
  topActors: TasteItemDto[];
  topDirectors: TasteItemDto[];
  topGenres: TasteItemDto[];
  topCountries: TasteItemDto[];
  totalWatchTime: number;
}

export default function TastePage() {
  const [taste, setTaste] = useState<TasteProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaste = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:8080/api/taste/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaste(res.data);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTaste();
  }, []);

  if (loading) return <p className="text-center">불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">내 영화 취향 분석</h1>

            


      {taste && (
        <>
{/* 선호 인물 전체 컨테이너 */}
<section className="mb-2 p-6 border border-gray-100 rounded-xs bg-white shadow-sm max-w-2xl mx-auto">
  {/* 선호 배우 */}
  <h2 className="text-xl font-bold">선호 배우</h2>
  <div className="flex flex-col divide-y divide-gray-200">
    {taste.topActors.slice(0, 3).map((actor) => (
      <Link
        key={actor.id}
        href={`/person/${actor.tmdbId}`}
        className="flex items-center justify-between py-3 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {actor.imageUrl ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${actor.imageUrl}`}
                alt={actor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">?</div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-[15px] font-semibold text-gray-900">{actor.name}</p>
            <p className="text-sm text-gray-500">{actor.count}회</p>
          </div>
        </div>
        <div className="text-gray-400 text-lg">›</div>
      </Link>
    ))}
  </div>

  {/* 선호 감독 */}
  <h2 className="text-xl font-bold mt-6">선호 감독</h2>
  <div className="flex flex-col divide-y divide-gray-200">
    {taste.topDirectors.slice(0, 3).map((director) => (
      <Link
        key={director.id}
        href={`/person/${director.tmdbId ?? director.id}`}
        className="flex items-center justify-between py-3 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {director.imageUrl ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${director.imageUrl}`}
                alt={director.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">?</div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-[15px] font-semibold text-gray-900">{director.name}</p>
            <p className="text-sm text-gray-500">{director.count}회</p> 
          </div>
        </div>
        <div className="text-gray-400 text-lg">›</div>
      </Link>
    ))}
  </div>
</section>

<section className="mb-10 p-6 border border-gray-100 rounded-xs bg-white shadow-sm max-w-2xl mx-auto">
  {/* 선호 영화 */}
  <HighRatedSection />

  {/* 선호 장르 */}
  <section className="mb-5">
  <h2 className="text-xl font-bold mb-5">선호 장르</h2>
    <ul className="flex justify-center flex-wrap gap-3 mb-10">
      {taste.topGenres.slice(0, 3).map((genre) => (
        <li
          key={genre.id}
          className="bg-gray-100 px-3 py-1 rounded-full text-md text-gray-800"
        >
          {genre.name} ({genre.count})
        </li>
      ))}
    </ul>
  </section>

  {/* 선호 국가 */}
  <section className="mb-5">
  <h2 className="text-xl font-bold mb-5">선호 국가</h2>
    <ul className="flex justify-center flex-wrap gap-3 mb-15 ">
      {taste.topCountries.slice(0, 3).map((country) => (
        <li
          key={country.id}
          className="bg-gray-100 px-3 py-1 rounded-full text-md text-gray-800"
        >
          {country.name} ({country.count})
        </li>
      ))}
    </ul>
  </section>

  {/* 총 감상 시간 */}
  
  <div className="text-lg text-gray-700 text-center">
    총 감상 시간: <span className="font-semibold">{taste.totalWatchTime.toLocaleString()}</span>분
  </div>
</section>

        </>
      )}
    </div>





  );
}
