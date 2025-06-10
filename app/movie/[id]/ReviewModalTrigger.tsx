'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import ReviewSection from './ReviewSection';
import OtherSection from './OtherSection'; 

export default function ReviewModal({ movieId }: { movieId: number }) {
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [plusModalOpen, setPlusModalOpen] = useState(false);

  return (
    <>
      {/* 버튼 두 개 */}
      <div className="flex justify-start gap-6 mt-12">
        <button onClick={() => setWriteModalOpen(true)}>
          <img
            src="/images/write.png"
            alt="리뷰 작성 버튼"
            className="w-7 h-7 object-contain hover:opacity-80 transition"
          />
        </button>

        <button onClick={() => setPlusModalOpen(true)}>
          <img
            src="/images/bookmark.png"
            alt="플러스 버튼"
            className="w-7 h-7 object-contain hover:opacity-80 transition"
          />
        </button>
      </div>

      {/* 첫 번째 모달 */}
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

      {/* 두 번째 모달 (예시로 OtherSection 사용) */}
      <Dialog open={plusModalOpen} onClose={() => setPlusModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4">다른 기능</Dialog.Title>

            <OtherSection /> 

            <div className="mt-4 text-right">
              <button
                onClick={() => setPlusModalOpen(false)}
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
