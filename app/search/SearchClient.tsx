'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import FollowButton from '@/components/FollowButton'

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
  const [myId, setMyId] = useState<number | null>(null)

  useEffect(() => {
    const fetchMyId = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const res = await axios.get<{ id: number }>(
          `/api/user/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setMyId(res.data.id)
      } catch (err) {
        console.error('내 ID 불러오기 실패:', err)
      }
    }

    fetchMyId()
  }, [])


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
        }>(`/api/tmdb/search`, {
          params: { query },
        })
        console.log('🔍 users:', res.data.users);
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
    <div className="max-w-5xl mx-auto px-4 py-6 pt-20">
      {/* <h1 className="text-2xl font-bold mb-4">🔎 &quot;{query}&quot; 검색 결과</h1> */}

      
      {/* 영화 결과 */}
<h1 className="text-2xl font-semibold mt-6 mb-2">영화</h1>
{movies.length === 0 ? (
  <p className="text-sm text-gray-500">영화 결과가 없습니다.</p>
) : (
  <div className="overflow-x-auto">
    <ul className="flex gap-4">
      {movies.map((movie) => (
        <li
          key={movie.id}
          className="min-w-[180px] max-w-[180px] flex-shrink-0 cursor-pointer rounded p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => router.push(`/movie/${movie.id}`)}
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              className="mb-2 rounded w-full h-auto object-cover"
            />
          ) : (
            <div className="mb-2 w-full h-60 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              이미지 없음
            </div>
          )}
          <h3 className="font-semibold text-base">{movie.title}</h3>
          <p className="text-xs text-muted-foreground">출시일: {movie.release_date}</p>
        </li>
      ))}
    </ul>
  </div>
)}

{/* 인물 결과 */}
<h1 className="text-2xl font-semibold mt-6 mb-2">인물</h1>
{people.length === 0 ? (
  <p className="text-sm text-gray-500">인물 결과가 없습니다.</p>
) : (
  <div className="overflow-x-auto">
    <ul className="flex gap-4">
      {people.map((person) => (
        <li
          key={person.id}
          className="min-w-[160px] max-w-[160px] flex-shrink-0 cursor-pointer rounded p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => router.push(`/person/${person.id}`)}
        >
          {person.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt={`${person.name} 사진`}
              className="mb-2 w-full h-40 aspect-square rounded-sm object-cover "
            />
          ) : (
            <div className="mb-2 w-full h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              이미지 없음
            </div>
          )}
          <h3 className="font-semibold text-base">{person.name}</h3>
          <p className="text-sm text-muted-foreground">{person.known_for_department || '직무 정보 없음'}</p>
        </li>
      ))}
    </ul>
  </div>
)}

{/* 유저 결과 */}
<h1 className="text-2xl font-semibold mt-6 mb-2">유저</h1>
{users.length === 0 || myId === null ? (
  <p className="text-sm text-gray-500">유저 결과가 없습니다.</p>
) : (
  <div className="overflow-x-auto">
    <ul className="flex gap-4">
      {users.map((user) => (
        <li
          key={user.id}
          className="min-w-[220px] max-w-[300px] flex-shrink-0 border rounded p-3 flex flex-row justify-between gap-5"
        >
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push(`/otherUser/${user.id}/profile`)}
          >
            <img
              src={user.profileImageUrl || '/images/default-profile.png'}
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
          {user.id !== myId && (
            <div className="mt-3">
              <FollowButton userId={user.id} />
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
)}


    </div>
  )
}
