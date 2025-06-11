'use client'

import Link from 'next/link'
import axios from 'axios'
//import { Logo } from './logo'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useEffect, useRef } from 'react'
import { SmilePlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
}

interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for_department?: string
}

const menuItems = [
  { name: '캘린더', href: '#link' },
  { name: '친구목록', href: '#link' },
  { name: '영화추천', href: '#link' },
  { name: '취향분석', href: '#link' },
]

export const HeroHeader = () => {
  const [query, setQuery] = React.useState('')
  //const [searchResults, setSearchResults] = React.useState<Movie[]>([])
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const [movies, setMovies] = React.useState<Movie[]>([])
  const [people, setPeople] = React.useState<Person[]>([])


const handleSearch = async () => {
  if (!query.trim()) {
    setMovies([])
    setPeople([])
    return
  }
  try {
    const res = await axios.get<{ movies: Movie[]; people: Person[] }>('http://localhost:8080/api/tmdb/search', {
      params: { query },
    })
    setMovies(res.data.movies || [])
    setPeople(res.data.people || [])
  } catch (err) {
    console.error('검색 실패:', err)
  }
}


  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(() => {
      handleSearch()
    }, 500)

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [query])

  const [menuState, setMenuState] = React.useState(false)

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed top-0 z-20 w-full h-18 bg-background/50 border-b backdrop-blur-3xl">
      
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Image
                  src="/images/logo3.png" // public 디렉토리 기준
                  alt="방구석시네마 로고"
                  width={120}      // 원하는 크기로 조절
                  height={50}
                  className="h-auto w-auto"
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20
              md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent"
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 검색창 + 버튼 + 결과 드롭다운 */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit relative">
                <Input
                  type="search"
                  placeholder="영화 검색"
                  className="sm:w-40 md:w-60"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      router.push(`/search?query=${encodeURIComponent(query.trim())}`)
                    }
                  }}
                />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
                >
                  <Link href="/user/profile">
                    <SmilePlus className="w-5 h-5" />
                  </Link>
                </Button>

                  
                {/* 검색 결과 드롭다운 */}
                {(movies.length > 0 || people.length > 0) && (
  <ul className="absolute top-full left-0 mt-1 max-h-80 w-full overflow-auto rounded-md border bg-white p-2 shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700 space-y-2">
    
    {/* 영화 섹션 */}
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

    {/* 인물 섹션 */}
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
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
