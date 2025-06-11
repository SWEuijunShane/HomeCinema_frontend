'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  movieId: number;
}

export default function RatingStars({ movieId }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken);

    fetchRating(storedToken);
  }, [movieId]);

  const fetchRating = async (authToken: string | null) => {
    if (!authToken) return;

    try {
      const res = await axios.get('http://localhost:8080/api/movieRating/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const found = res.data.find((item: any) => item.movieId === movieId);
      if (found) setRating(found.rating);
      else setRating(null); // 없는 경우 null로 초기화
    } catch (err) {
      console.error('내 평점 불러오기 실패:', err);
    }
  };

  const handleRatingChange = async (value: number) => {
    setRating(value);
    if (!token) return;

    try {
      await axios.post(`http://localhost:8080/api/movieRating/${movieId}`, null, {
        params: { rating: value },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`⭐️ ${value}점 평점 저장 완료`);
      setEditMode(false); // 저장 후 보기 모드로 전환
    } catch (err) {
      console.error('평점 저장 실패:', err);
    }
  };

  const handleEditToggle = async () => {
    // 편집 버튼 누르면 초기화하고 서버에서 다시 GET
    setRating(null);
    setEditMode(true);
    await fetchRating(token); // 최신 평점 불러오기
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1 text-3xl select-none">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            onClick={() => editMode && handleRatingChange(num)}
            className={`cursor-pointer transition ${
              num <= (rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'
            } ${!editMode ? 'cursor-default' : ''}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* ✏️ 편집 / 취소 버튼 */}
      <button
        onClick={() => {
          if (editMode) {
            setEditMode(false);
            fetchRating(token); // 취소할 때도 다시 GET
          } else {
            handleEditToggle(); // 위에서 초기화 + fetch
          }
        }}
        className="text-[8px] text-gray-500 underline hover:text-gray-700 mt-4"
      >
        {editMode ? '취소' : '편집'}
      </button>
    </div>
  );
}
