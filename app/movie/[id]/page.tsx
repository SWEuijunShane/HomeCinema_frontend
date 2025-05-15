// import MovieDetail from '@/components/MovieDetail';

// export default function MovieDetailPage() {
//   return <MovieDetail />;
// }


import { notFound } from 'next/navigation';

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genres?: { id: number; name: string }[];
}

// 서버에서 API 호출 함수
async function fetchMovieDetail(id: string): Promise<MovieDetail | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/tmdb/movie/${id}`, {
      next: { revalidate: 60 }, // ISR 캐시 (선택사항)
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('영화 API 요청 실패:', err);
    return null;
  }
}

// SSR 페이지
export default async function Page({ params }: { params: { id: string } }) {
  const movie = await fetchMovieDetail(params.id);

  if (!movie) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white  p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{movie.title}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-64 rounded-lg shadow-md"
          />

          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-semibold">개봉일:</span> {movie.release_date}
            </p>

            {movie.genres && (
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-semibold">장르:</span>{' '}
                {movie.genres.map((g) => g.name).join(', ')}
              </p>
            )}

            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

