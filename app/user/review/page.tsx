'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface ReviewListResponseDto {
  content: string;
  gifPath: string;
  userNickname: string;
  emotions: string[];
}

export default function UserReviewPage() {
  const [reviews, setReviews] = useState<ReviewListResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:8080/api/reviews/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReviews(res.data);
      } catch (err) {
        console.error('리뷰 목록 불러오기 실패:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">내가 작성한 리뷰</h1>
      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review, index) => (
            <li key={index} className="p-4 bg-white shadow rounded">
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={review.gifPath}
                  alt="감정 GIF"
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <p className="text-sm text-gray-600">@{review.userNickname}</p>
                  <p className="font-medium">{review.content}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {review.emotions.map((emotion, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                  >
                    #{emotion}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
