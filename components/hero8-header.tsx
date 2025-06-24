'use client'

import Link from 'next/link'
import axios from 'axios'
import Image from 'next/image'
import { Menu, X, Search, SmilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useEffect, useRef } from 'react'
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

interface User {
  profileImage?: string
  nickname: string
  email: string
  name: string
}

const menuItems = [
  { name: '친구목록', href: '/friend/list' },
  { name: '내 영화', href: '/user/wantToWatch' },
  { name: '내 별점', href: '/user/rating' },
  { name: '내 리뷰', href: '/user/review' },
]

export const HeroHeader = () => {
  const [query, setQuery] = React.useState('')
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const [movies, setMovies] = React.useState<Movie[]>([])
  const [people, setPeople] = React.useState<Person[]>([])
  const [user, setUser] = React.useState<User | null>(null)
  const [menuState, setMenuState] = React.useState(false)

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) return
      try {
        const res = await axios.get("http://localhost:8080/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(res.data)
      } catch (err) {
        console.error("❌ 사용자 정보 불러오기 실패", err)
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed top-0 z-20 w-full h-18 bg-background/50 border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center h-18 justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center h-full justify-between gap-12 lg:w-auto">
              <a href="/" onClick={() => (window.location.href = "/")} className="flex items-center h-full">
                <Image
                  src="/images/logo3.png"
                  alt="방구석시네마 로고"
                  width={120}
                  height={50}
                  className="h-auto w-auto"
                />
              </a>

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
                      <Link href={item.href} className="text-muted-foreground hover:text-accent-foreground block duration-150">
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

              {/* ✅ 데스크탑용 검색창 (프로필 버튼 왼쪽) */}
              <div className="hidden lg:block relative">
                <Input
                  type="search"
                  placeholder="영화, 인물, 유저 검색"
                  className="pl-4 pr-10 py-2 text-sm w-64 rounded-full border border-gray-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
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

              {/* ✅ 햄버거 메뉴용 검색창 (메뉴 아래에 꽉 차게) */}
              {menuState && (
                <div className="lg:hidden w-full space-y-6">
                  <div className="lg:hidden relative w-full">
                    <Input
                      type="search"
                      placeholder="영화, 인물, 유저 검색"
                      className="pl-4 pr-10 py-3 text-base w-full rounded-full border border-gray-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-pink-400"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && query.trim()) {
                          router.push(`/search?query=${encodeURIComponent(query.trim())}`);
                          setMenuState(false)
                        }
                      }}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 w-4 h-4" />
                  </div>
                  {/* ✅ 모바일 메뉴 항목들 */}
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuState(false)} 
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✅ 프로필 버튼 및 로그아웃 */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit relative">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 rounded-full p-0 flex items-center justify-center overflow-hidden"
                >
                  <Link 
                    href="/user/profile"
                    onClick={() => setMenuState(false)} 
                  >
                    <span suppressHydrationWarning>
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="프로필 이미지" className="w-full h-full object-cover" />
                      ) : (
                        <SmilePlus className="w-5 h-5" />
                      )}
                    </span>
                  </Link>
                </Button>

                <button
                  onClick={async () => {
                    try {
                      await axios.post("http://localhost:8080/api/user/logout", {}, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                      })
                    } catch (e) {
                      console.log("Logout API Error", e)
                    } finally {
                      localStorage.removeItem("accessToken")
                      localStorage.removeItem("refreshToken")
                      localStorage.removeItem("token")
                      window.location.href = "/"
                    }
                  }}
                  className="ml-3 text-sm text-gray-600 hover:underline"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
