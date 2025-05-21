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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const router = useRouter()

  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get<{ results: Movie[] }>('http://localhost:8080/api/tmdb/search', {
          params: { query },
        })
        setResults(res.data.results)
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
      {results.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {results.map((movie) => (
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
      <h2 className="font-semibold text-lg">{movie.title}</h2>
      <p className="text-sm text-muted-foreground">출시일: {movie.release_date}</p>
    </li>
  ))}
</ul>

      )}
    </div>
  )
}
