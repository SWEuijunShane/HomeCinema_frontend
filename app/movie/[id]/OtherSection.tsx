'use client';

import { useState } from 'react';

export default function OtherSection() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="p-6 bg-yellow-50 rounded shadow text-gray-800">
      <h2 className="text-lg font-bold mb-4">✨ 다른 모달 콘텐츠</h2>

      <p className="mb-4">{clicked ? '버튼이 눌렸어요!' : '아직 아무 것도 안 눌렸어요.'}</p>

      <button
        onClick={() => setClicked(true)}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
      >
        눌러보기
      </button>
    </div>
  );
}
