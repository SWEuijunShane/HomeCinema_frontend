// app/taste/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import TasteProfile from '@/components/TasteProfile';

interface TasteItemDto {
  id: number;
  name: string;
  imageUrl: string | null;
  count: number;
  tmdbId: number;
}

interface TasteProfileDto {
  topActors: TasteItemDto[];
  topDirectors: TasteItemDto[];
  topGenres: TasteItemDto[];
  topCountries: TasteItemDto[];
  totalWatchTime: number;
}

export default function MyTastePage() {
  const [taste, setTaste] = useState<TasteProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaste = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/taste/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaste(res.data);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTaste();
  }, []);

  if (loading) return <p className="text-center">불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!taste) return null;

  return(
    <div className="mt-20">  
    <TasteProfile taste={taste} isMyProfile={true} />
  </div>

  );
}
