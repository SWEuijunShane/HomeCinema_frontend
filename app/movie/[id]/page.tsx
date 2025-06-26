import { notFound } from 'next/navigation';
import Link from 'next/link';
import MyReviewSection from '@/app/movie/[id]/MyReviewSection';
import ReviewModalTrigger from '@/app/movie/[id]/ReviewModalTrigger';
import OtherReviewsSection from './OtherReviewsSection';


interface PersonSummary {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genres?: { id: number; name: string }[];
  director?: PersonSummary | null;
  cast?: PersonSummary[];
}

type PageParams = Promise<{ id: string }>;


async function fetchMovieDetail(id: string): Promise<MovieDetail | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/tmdb/movie/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('영화 API 요청 실패:', err);
    return null;
  }
}

export default async function Page({ params }: { params: PageParams }) {
  const { id } = await params;
  const movie = await fetchMovieDetail(id);
  const movieId = Number(id);

  if (!movie) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center pt-20">
      <div className="max-w-3xl w-full bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{movie.title}</h1>

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

            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{movie.overview}</p>
          </div>

          

        </div>

        <div>

          <ReviewModalTrigger movieId={movieId} />
          <MyReviewSection movieId={movieId} /> 


        </div>







        {/* 감독 */}
        {movie.director && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">감독</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Link href={`/person/${movie.director.id}`} className="flex flex-col items-center text-center w-20">
                <div className="w-20 h-28 bg-white rounded-md shadow-md overflow-hidden">
                  {movie.director.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${movie.director.profile_path}`}
                      alt={movie.director.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-lg text-white">
                      ?
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs font-semibold text-gray-800 truncate w-full">
                  {movie.director.name}
                </p>
              </Link>
            </div>
          </div>
        )}

        {/* 출연진 */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">출연진</h2>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-2">
                {movie.cast.map((actor) => (
                  <Link
                    key={actor.id}
                    href={`/person/${actor.id}`}
                    className="flex flex-col items-center text-center w-20 flex-shrink-0"
                  >
                    <div className="w-20 h-28 bg-white rounded-md shadow-md overflow-hidden">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-white">
                          ?
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-gray-800 truncate w-full">{actor.name}</p>
                    <p className="text-[10px] text-gray-500 truncate w-full">{actor.character} 역</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        <OtherReviewsSection movieId={movieId} />
      </div>
    </main>
  );
}
