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
  movieTitle: string;
  posterPath: string;
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

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">작성한 리뷰</h1>
      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review, index) => (
            <li key={index} className="p-4 bg-gray-50 rounded">
              <div className="flex gap-4 items-start mb-4">
                <Link href={`/movie/${review.movieId}`} className="flex gap-4 hover:opacity-90">
                  <img
                    src={`https://image.tmdb.org/t/p/w154${review.posterPath}`}
                    alt={review.movieTitle}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-md font-bold mb-4">{review.movieTitle}</h2>
                    <p className="text-gray-800 text-sm mb-2">{review.content}</p>
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
