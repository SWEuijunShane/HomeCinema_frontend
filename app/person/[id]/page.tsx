import { notFound } from 'next/navigation';
import Link from 'next/link';

interface MovieSummary {
  id: number;
  title: string;
  character: string;
  posterPath: string | null;
  voteAverage?: number;
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
  directedMovies?: MovieSummary[]; // ✅ 추가
}

async function fetchPersonDetail(id: string): Promise<PersonDetail | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/tmdb/person/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('인물 정보 가져오기 실패:', err);
    return null;
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const person = await fetchPersonDetail(params.id);

  if (!person) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white p-6">

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

        {/* {person.biography && (
          <div className="mt-6 text-gray-800 whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-2">소개</h2>
            <p>{person.biography}</p>
          </div>
        )} */}

{person.known_for_department === 'Directing' ? (
  // 🎬 직무가 감독이면: 감독 작품만 보여줌
  person.directedMovies && person.directedMovies.length > 0 && (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">감독한 작품</h2>
      <div className="space-y-4">
        {person.directedMovies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="flex items-center gap-4 p-2 bg-white transition border-b border-gray-200 dark:border-gray-700"
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
    <p className="font-semibold text-base">{movie.title}</p>
    {movie.voteAverage !== undefined && (
      <p className="text-sm text-gray-500 whitespace-nowrap">⭐ {movie.voteAverage.toFixed(1)}</p>
    )}
  </div>
  <p className="text-gray-600 text-sm">감독</p>
</div>

          </Link>
        ))}
      </div>
    </div>
  )
) : (
  // 🎭 그 외 직무(예: Acting)이면: 출연 작품만 보여줌
  person.movieCredits && person.movieCredits.length > 0 && (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">출연 작품</h2>
      <div className="space-y-4">
        {person.movieCredits.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="flex items-center gap-4 p-2 bg-white transition border-b border-gray-200 dark:border-gray-700"
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
    <p className="font-semibold text-base">{movie.title}</p>
    {movie.voteAverage !== undefined && (
      <p className="text-sm text-gray-500 whitespace-nowrap">⭐ {movie.voteAverage.toFixed(1)}</p>
    )}
  </div>
  <p className="text-gray-600 text-sm">{movie.character} 역</p>
</div>

          </Link>
        ))}
      </div>
    </div>
  )
)}


      </div>
    </main>
  );
}
