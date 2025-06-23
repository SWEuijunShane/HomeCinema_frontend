import { notFound } from 'next/navigation';
import PersonPageClient from './PersonPageClient';

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

async function fetchPersonDetail(id: string): Promise<PersonDetail | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/tmdb/person/${id}`, { cache: 'no-store' });
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

  return <PersonPageClient person={person} />;
}
