'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MovieSummary {
  id: number;
  title: string;
  character: string;
  posterPath: string | null;
  voteAverage?: number;
  releaseDate: string;
}

interface PersonDetail {
  id: number;
  name: string;
  gender: number;
  known_for_department: string;
  profile_path: string | null;
  birthday: string;
  biography: string;
  place_of_birth: string;
  movieCredits: MovieSummary[];
  directedMovies?: MovieSummary[];
}

function sortByReleaseDateDesc(movies: MovieSummary[]): MovieSummary[] {
  return [...movies].sort((a, b) => {
    const dateA = new Date(a.releaseDate || '1900-01-01').getTime();
    const dateB = new Date(b.releaseDate || '1900-01-01').getTime();
    return dateB - dateA;
  });
}

export default function PersonPageClient({ person }: { person: PersonDetail }) {
  const isDirector = person.known_for_department === 'Directing';
  const allMovies = sortByReleaseDateDesc(
  isDirector ? person.directedMovies ?? [] : person.movieCredits ?? []
);
  const [visibleCount, setVisibleCount] = useState(5);
  const visibleMovies = allMovies.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white p-6">
        {/* 인물 정보 */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={
              person.profile_path
                ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                : '/default-profile.png'
            }
            alt={person.name}
            className="w-25 h-auto md:w-25 rounded-lg shadow-md"
          />
          <div className="flex-1 text-sm text-gray-700">
            <h1 className="text-2xl mt-4 font-bold text-gray-800 mb-2">{person.name}</h1>
            <p><strong>직무:</strong> {person.known_for_department}</p>
            <p><strong>성별:</strong> {person.gender === 1 ? '여성' : '남성'}</p>
            <p><strong>출생일:</strong> {person.birthday || '정보 없음'}</p>
            <p><strong>출생지:</strong> {person.place_of_birth || '정보 없음'}</p>
          </div>
        </div>

        {/* 영화 목록 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-4">
          {isDirector ? '감독한 작품' : '출연 작품'}
        </h2>

        <div className="space-y-4">
          {visibleMovies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="flex items-center gap-4 p-2 bg-white transition border-b border-gray-200"
            >
              <div className="w-20 h-28 bg-gray-200 flex-shrink-0 overflow-hidden rounded">
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                    이미지 없음
                  </div>
                )}
              </div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{movie.title}</p>
                  {movie.voteAverage !== undefined && (
                    <p className="text-sm text-gray-500 whitespace-nowrap">⭐ {movie.voteAverage.toFixed(1)}</p>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{isDirector ? '감독' : `${movie.character} 역`} · {movie.releaseDate}</p>
              </div>
            </Link>
          ))}
        </div>

        {visibleCount < allMovies.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="mt-6 block mx-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            더 보기
          </button>
        )}
      </div>
    </main>
  );
}
