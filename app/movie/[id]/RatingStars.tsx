'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  movieId: number;
}

interface MovieRating {
  movieId: number;
  rating: number;
}

export default function RatingStars({ movieId }: Props) {
  const [rating, setRating] = useState<number>(0);
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

      const ratings: MovieRating[] = res.data;
      const found = ratings.find((item) => item.movieId === movieId);
      setRating(found ? found.rating : 0);
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
      setEditMode(false);
    } catch (err) {
      console.error('평점 저장 실패:', err);
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const full = i <= rating;
      const half = i - 0.5 === rating;

      stars.push(
        <span key={i} className="relative w-6 h-6 inline-block">
          {editMode && (
            <>
              <span
                onClick={() => handleRatingChange(i - 0.5)}
                className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              />
              <span
                onClick={() => handleRatingChange(i)}
                className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              />
            </>
          )}

          {full ? (
            <span className="text-yellow-400 text-2xl">★</span>
          ) : half ? (
            <img
              src="/images/half.jpg"
              alt="half star"
              className="w-6 h-6 object-contain"
            />
          ) : (
            <span className="text-gray-300 text-2xl">★</span>
          )}
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex gap-0.5 select-none">{renderStars()}</div>
      <button
        onClick={handleEditToggle}
        className="text-[10px] text-gray-500 underline hover:text-gray-700 mt-2"
      >
        {editMode ? '완료' : '편집'}
      </button>
    </div>
  );
}
