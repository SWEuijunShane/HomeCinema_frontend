'use client';

import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewSection from './ReviewSection';
import RatingStars from './RatingStars';

export default function ReviewModal({ movieId }: { movieId: number }) {
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    setToken(stored);
  }, []);

  // ✅ 단건 확인 API 사용
  useEffect(() => {
    const checkSaved = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/userMovie/me/wantToWatch/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSaved(res.data); // true or false
      } catch (err) {
        console.error('등록 여부 확인 실패:', err);
        setIsSaved(false);
      }
    };
    checkSaved();
  }, [token, movieId]);

  const handleAdd = async () => {
    if (!token) return alert('로그인이 필요합니다.');
    try {
      await axios.post(`http://localhost:8080/api/userMovie/${movieId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('보고싶어요에 추가했어요!');
      setIsSaved(true);
    } catch (err) {
      console.error('등록 실패:', err);
      alert('등록 실패!');
    }
  };

  const handleRemove = async () => {
    if (!token) return alert('로그인이 필요합니다.');
    try {
      await axios.delete(`http://localhost:8080/api/userMovie/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('보고싶어요에서 제거했어요!');
      setIsSaved(false);
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 실패!');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mt-12 px-4">
        <div className="flex gap-6">
          <button onClick={() => setWriteModalOpen(true)}>
            <img
              src="/images/pen.png"
              alt="리뷰 작성"
              className="w-12 h-12 object-contain hover:opacity-80 transition"
            />
          </button>

          <button onClick={isSaved ? handleRemove : handleAdd}>
            <img
              src={isSaved ? '/images/delete_eyes.png' : '/images/eyes.png'}
              alt="보고싶어요 토글"
              className="w-12 h-12 object-contain hover:opacity-80 transition"
            />
          </button>
        </div>

        <div className="scale-150 mr-18">
          <RatingStars movieId={movieId} />
        </div>
      </div>

      <Dialog open={writeModalOpen} onClose={() => setWriteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white p-6 rounded shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4">리뷰 작성</Dialog.Title>
            <ReviewSection movieId={movieId} />
            <div className="mt-4 text-right">
              <button
                onClick={() => setWriteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                닫기
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
