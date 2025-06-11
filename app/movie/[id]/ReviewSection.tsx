'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  movieId: number;
  onReviewUpdated?: () => void;
}

interface ReviewData {
  reviewId: number;
  content: string;
  gifPath: string;
  emotions: string[]; // 문자열
}

const EMOTIONS = [
  { id: 4, name: '😂 웃긴' },
  { id: 7, name: '😭 슬픈' },
  { id: 1, name: '💪 통쾌한' },
  { id: 19, name: '😃 거친' },
  { id: 16, name: '😌 편안한' },
  { id: 3, name: '🤔 동심 자극' },
  { id: 15, name: '🛸 신기한' },
  { id: 6, name: '☁️ 생각하게 되는' },
  { id: 8, name: '💞 감동적인' },
  { id: 9, name: '🏛️ 무거운' },
  { id: 10, name: '😢 안타까운' },
  { id: 11, name: '😱 무서운' },
  { id: 12, name: '🩸 충격적인' },
  { id: 13, name: '😌 힐링되는' },
  { id: 14, name: '💕 설레는' },
  { id: 17, name: '😬 긴장감 넘치는' },
  { id: 18, name: '🧍‍♂️ 비극적인' },
  { id: 2, name: '😮 흥미진진한' },
  { id: 5, name: '🔥 불쾌한' },
];

export default function ReviewSection({ movieId, onReviewUpdated }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  const [content, setContent] = useState('');
  const [emotionIds, setEmotionIds] = useState<number[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchReview = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/reviews/my/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: ReviewData = res.data;
        setReviewData(data);
        setContent(data.content);
        setEmotionIds(emotionNamesToIds(data.emotions));
      } catch {
        setReviewData(null);
        setContent('');
        setEmotionIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [token, movieId]);

  const emotionNamesToIds = (names: string[]) => {
    return names.map((name) => {
      const match = EMOTIONS.find((e) => e.name.includes(name));
      return match ? match.id : -1;
    }).filter((id) => id !== -1);
  };

  const toggleEmotion = (id: number) => {
    if (emotionIds.includes(id)) {
      setEmotionIds(emotionIds.filter((eid) => eid !== id));
    } else {
      if (emotionIds.length >= 3) {
        alert('감정 키워드는 최대 3개까지 선택 가능합니다.');
        return;
      }
      setEmotionIds([...emotionIds, id]);
    }
  };

  const handleSubmit = async () => {
    if (!token) return alert('로그인이 필요합니다.');

    const payload = {
      tmdbId: movieId,
      content,
      emotionIds,
    };

    try {
      if (reviewData) {
        await axios.put(`http://localhost:8080/api/reviews/${movieId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('리뷰가 수정되었습니다!');
        window.location.href = '/';
      } else {
        await axios.post(`http://localhost:8080/api/reviews/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('리뷰가 작성되었습니다!');
        window.location.href = '/';
      }

      if (onReviewUpdated) onReviewUpdated();
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    console.error('저장 실패:', err);
    alert('실패했습니다. ' + (err.response?.data || err.message));
  } else {
    alert('저장 실패: 알 수 없는 오류입니다.');
  }
}

  };

  const handleDelete = async () => {
    if (!reviewData || !token) return;
    const ok = confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:8080/api/reviews/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('리뷰가 삭제되었습니다!');
      window.location.href = '/';
      setReviewData(null);
      setContent('');
      setEmotionIds([]);
      if (onReviewUpdated) onReviewUpdated();
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    console.error('삭제 실패:', err);
    alert('삭제 실패: ' + (err.response?.data || err.message));
  } else {
    alert('삭제 실패: 알 수 없는 오류입니다.');
  }
}

  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mb-6">
      <h2 className="text-lg font-bold mb-2">{reviewData ? '내 리뷰 수정' : '리뷰 작성'}</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="한줄평 작성"
        className="w-full p-2 border rounded mb-2"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => toggleEmotion(emotion.id)}
            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition ${
              emotionIds.includes(emotion.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {emotion.name}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-[#3C3C3C] text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {reviewData ? '수정' : '등록'}
        </button>

        {reviewData && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
