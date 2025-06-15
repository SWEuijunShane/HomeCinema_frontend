// /app/search/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
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
  id: number;
  nickname: string;
  reviewCount: number;
  ratedCount: number;
  profileImageUrl: string | null;
}


export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const router = useRouter()

  const [movies, setMovies] = useState<Movie[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get<{
          movies: Movie[]
          people: Person[]
          users: User[]
        }>('http://localhost:8080/api/tmdb/search', {
          params: { query },
        })
        setMovies(res.data.movies || [])
        setPeople(res.data.people || [])
        setUsers(res.data.users || [])
      } catch (err) {
        console.error('검색 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  if (loading) return <p className="p-4">🔍 검색 중입니다...</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">🔎 &quot;{query}&quot; 검색 결과</h1>

      {/* 🎬 영화 결과 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">🎬 영화</h2>
      {movies.length === 0 ? (
        <p>영화 결과가 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="cursor-pointer border rounded p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => router.push(`/movie/${movie.id}`)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} 포스터`}
                  className="mb-2 rounded w-full h-auto object-cover"
                />
              ) : (
                <div className="mb-2 w-full h-72 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  이미지 없음
                </div>
              )}
              <h3 className="font-semibold text-lg">{movie.title}</h3>
              <p className="text-sm text-muted-foreground">출시일: {movie.release_date}</p>
            </li>
          ))}
        </ul>
      )}

      {/* 👤 인물 결과 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">👤 인물</h2>
      {people.length === 0 ? (
        <p>인물 결과가 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {people.map((person) => (
            <li
              key={person.id}
              className="cursor-pointer border rounded p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => router.push(`/person/${person.id}`)}
            >
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={`${person.name} 사진`}
                  className="mb-2 rounded-full w-full h-60 object-cover"
                />
              ) : (
                <div className="mb-2 w-full h-60 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  이미지 없음
                </div>
              )}
              <h3 className="font-semibold text-lg">{person.name}</h3>
              <p className="text-sm text-muted-foreground">{person.known_for_department || '직무 정보 없음'}</p>
            </li>
          ))}
        </ul>
      )}

      {/* 👤 유저 결과 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">👥 유저</h2>
      {users.length === 0 ? (
        <p>유저 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/profile/${user.id}`)}>
                <img
                  src={user.profileImageUrl || '/default-profile.png'}
                  alt={user.nickname}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.nickname}</p>
                  <p className="text-sm text-gray-500">
                    리뷰 {user.reviewCount}개 · 평점 {user.ratedCount}개
                  </p>
                </div>
              </div>

              {/* 팔로우/언팔 버튼은 이후 단계에서 추가 */}
              {/* <FollowButton userId={user.id} /> */}
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}
