'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Search } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
}

export default function Features() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) {
      setMovies([]);
      setPeople([]);
      return;
    }
    try {
      const res = await axios.get<{ movies: Movie[]; people: Person[] }>('http://localhost:8080/api/tmdb/search', {
        params: { query },
      });
      setMovies(res.data.movies || []);
      setPeople(res.data.people || []);
    } catch (err) {
      console.error('검색 실패:', err);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query]);

  return (
    <section className="bg-zinc-50 py-12 md:py-12 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center relative">
          <div className="relative mx-auto w-full max-w-xl">
            <Input
              type="search"
              placeholder="영화, 인물, 유저 검색"
              className="pl-4 pr-10 py-5 text-base w-full rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/search?query=${encodeURIComponent(query.trim())}`);
                }
              }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 w-4 h-4" />
          </div>

          {(movies.length > 0 || people.length > 0) && (
            <ul className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 max-h-80 w-full max-w-lg overflow-auto rounded-md border bg-white p-2 shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700 space-y-2">
              {movies.map((movie) => (
                <li
                  key={`movie-${movie.id}`}
                  className="cursor-pointer rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <div className="text-sm font-semibold">{movie.title}</div>
                  <div className="text-xs text-muted-foreground">{movie.release_date}</div>
                </li>
              ))}
              {people.map((person) => (
                <li
                  key={`person-${person.id}`}
                  className="cursor-pointer rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => router.push(`/person/${person.id}`)}
                >
                  <div className="text-sm font-semibold">{person.name}</div>
                  <div className="text-xs text-muted-foreground">{person.known_for_department || '인물'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mx-auto mt-10 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link href="#popular" className="flex items-center gap-8">
              <span className="text-nowrap">영화 탐색</span>
              <img src="/images/fire.png" alt="Start" className="w-8" />
            </Link>
          </Button>
          <Button
            key={2}
            asChild
            size="lg"
            variant="ghost"
            className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link href="/taste" className="flex items-center gap-8">
              <span className="text-nowrap">취향 분석</span>
              <img src="/images/nasa.png" alt="Start" className="w-8" />
            </Link>
          </Button>
          <Button
            key={3}
            asChild
            size="lg"
            variant="ghost"
            className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link href="/recommend" className="flex items-center gap-8">
              <span className="text-nowrap">영화 추천</span>
              <img src="/images/recommend.png" alt="Start" className="w-8" />
            </Link>
          </Button>
          <Button
            key={4}
            asChild
            size="lg"
            variant="ghost"
            className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link href="/friend/activity" className="flex items-center gap-8">
              <span className="text-nowrap">친구 소식</span>
              <img src="/images/star.png" alt="Start" className="w-8" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
