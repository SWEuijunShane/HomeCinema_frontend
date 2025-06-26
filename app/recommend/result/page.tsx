'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Movie {
  title: string;
  release_date: string;
  poster_path: string | null;
}

interface RecommendationItem {
  movie: Movie;
}

interface RecommendationResult {
  reason?: string;
  recommendations: RecommendationItem[];
}



export default function RecommendResultPage() {
const [result, setResult] = useState<RecommendationResult | null>(null);

  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('recommendation');
    if (data) {
      setResult(JSON.parse(data));
    }
  }, []);

  const handleRetry = () => {
    localStorage.removeItem('recommendation');
    router.push('/recommend');
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-4 py-10 pt-20"
      style={{ backgroundImage: "url('/images/back.png')" }}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-6xl text-white">
        {result ? (
          <>
            {/* 설명 */}
            {result.reason && (
              <p className="text-center text-white text-base sm:text-lg mb-8 max-w-2xl mx-auto bg-[#F3344E]/80 p-4 rounded-lg">
                💡 <span className="font-medium">이런 이유로 추천했어요:</span><br />
                <span className="text-gray-200">{result.reason}</span>
              </p>
            )}

            {/* 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
              {result.recommendations.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white text-black p-4 rounded-lg shadow-lg hover:scale-105 transition-transform w-full max-w-xs"
                >
                  <h2 className="font-bold text-lg mb-1">{item.movie.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{item.movie.release_date}</p>
                  {item.movie.poster_path && (
                    <img
                      src={item.movie.poster_path}
                      alt={item.movie.title}
                      className="mt-2 rounded w-full"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-[#F3344E] text-white rounded-lg font-semibold hover:bg-[#c8243b] transition"
              >
                다시 받기
              </button>
            </div>
          </>
        ) : (
          <p className="text-white text-center text-xl">결과를 불러오는 중입니다...</p>
        )}
      </div>
    </div>
  );
}
