// components/TasteProfile.tsx
'use client';

import Link from 'next/link';
import HighRatedSection from './HighRatedSection';
import OtherUserHighRatedSection from './OtherUserHighRatedSection';

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

interface TasteProfileSectionProps {
  taste: TasteProfileDto;
  isMyProfile: boolean;
}

export default function TasteProfileSection({ taste, isMyProfile }: TasteProfileSectionProps) {
  return (
    <>
      <section className="mb-2 p-6 border border-gray-100 rounded-xs bg-white shadow-sm max-w-2xl mx-auto">
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
        {isMyProfile ? <HighRatedSection /> : <OtherUserHighRatedSection />}
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

        <div className="text-lg text-gray-700 text-center">
          총 감상 시간: <span className="font-semibold">{taste.totalWatchTime.toLocaleString()}</span>분
        </div>
      </section>
    </>
  );
}
