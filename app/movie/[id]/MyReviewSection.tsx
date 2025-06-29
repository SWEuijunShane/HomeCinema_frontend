'use client';

import { useEffect, useState } from 'react';

interface ReviewDetailDto {
  reviewId: number;
  content: string;
  //gifPath: string;
  nickname: string;
  emotions: string[];
  //comments: any[];
}

export default function MyReviewSection({ movieId }: { movieId: number }) {
  const [myReview, setMyReview] = useState<ReviewDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setAccessToken(storedToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

const fetchMyReview = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/my/${movieId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn('내 리뷰 조회 실패:', res.status);
      setMyReview(null);
      return;
    }

    const text = await res.text();
    if (!text) {
      // 응답 body가 비어있을 때
      setMyReview(null);
      return;
    }

    const data: ReviewDetailDto = JSON.parse(text);
    setMyReview(data);
  } catch (err) {
    console.error('내 리뷰 불러오기 실패:', err);
    setMyReview(null); // 실패해도 안전하게 null로
  } finally {
    setLoading(false);
  }
};


    fetchMyReview();
  }, [movieId, accessToken]);

  if (loading) return <p className="mt-6 text-sm text-gray-500">로딩 중...</p>;

  if (!myReview) {
    return <p className="mt-6 text-gray-500 italic">아직 작성한 한줄평이 없습니다.</p>;
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">내 한줄평</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-sm text-gray-800 mb-2 whitespace-pre-line break-words break-all line-clamp-3 min-h-[63px]">
          {myReview.content}
        </p>
        {/* {myReview.gifPath && (
          <img
            src={myReview.gifPath}
            alt="감정 gif"
            className="w-32 h-32 object-contain mb-2"
          />
        )} */}
        <p className="text-sm text-gray-500">
          감정 키워드: {myReview.emotions.join(', ')}
        </p>
      </div>
    </div>
  );
}
