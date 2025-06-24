'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface ReviewDto {
  content: string;
  gifPath: string;
  userNickname: string;
  emotions: string[];
  movieId: number;
  releaseYear: string;
  movieTitle: string;
  posterPath: string;
  createdAt: string;
}

export default function OtherUserReviewPage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/reviews/list/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error('리뷰 정보 로딩 실패:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto pt-20">
      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review, index) => (
            <li key={index} className="p-4 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 font-semibold">@{review.userNickname}</p>
                <span className="text-xs text-gray-500">{formatTime(review.createdAt)}</span>
              </div>

              {/* 구분선 */}
              <hr className="my-2" />

              {/* 영화 포스터 + 제목 */}
              <div className="flex gap-4 items-start mb-4">
                <Link href={`/movie/${review.movieId}`} className="flex gap-4 hover:opacity-90">
                  <img
                    src={`https://image.tmdb.org/t/p/w154${review.posterPath}`}
                    alt={review.movieTitle}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-sm font-bold">{review.movieTitle}</h2>
                    <div className="text-xs text-gray-500 mb-3">{review.releaseYear}</div>
                    <p className="text-gray-800 text-sm mb-2 whitespace-pre-line break-words break-all line-clamp-3 min-h-[63px]">{review.content}</p>
                  </div>
                </Link>
              </div>

              <hr className="my-2" />

              <div className="flex flex-wrap gap-2">
                {review.emotions.map((emotion, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
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
