'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import TeaserOverlay from '@/app/recommend/TeaserOverlay';

interface Option {
  id: string;
  label: string;
}

interface TasteProfile {
  topGenres: string[];
  topActors: string[];
  topDirectors: string[];
}

interface TasteResponseItem {
  name: string;
}



const keywordSteps: { question: string; options: Option[] }[] = [
  {
    question: '어떤 영화를 보고싶으신가요?',
    options: [
      { id: 'nothink', label: '킬링타임용 💁‍♂️' },
      { id: 'think', label: '생각에 잠기고 싶음 🙍‍♂️' },
    ],
  },
  {
    question: '어떤 분위기를 원하시나요?',
    options: [
      { id: 'bright', label: '밝은, 해피엔딩 😃' },
      { id: 'dark', label: '어두운, 무거운 😐' },
      { id: 'healing', label: '잔잔한, 힐링되는 🙂' },
      { id: 'colorful', label: '감성적인, 색감이 이쁜 🎨' },
      { id: 'stylish', label: '스타일리쉬한, 세련된 🦸‍♂️' },
    ],
  },
  {
    question: '장르를 골라주세요',
    options: [
      { id: 'action', label: '액션' },
      { id: 'adventure', label: '어드벤쳐' },
      { id: 'animation', label: '애니메이션' },
      { id: 'comedy', label: '코미디' },
      { id: 'crime', label: '범죄' },
      { id: 'drama', label: '드라마' },
      { id: 'fantasy', label: '판타지' },
      { id: 'history', label: '역사' },
      { id: 'horror', label: '호러' },
      { id: 'music', label: '음악' },
      { id: 'mystery', label: '미스터리' },
      { id: 'romance', label: '로맨스' },
      { id: 'SF', label: 'SF' },
      { id: 'thriller', label: '스릴러' },
      { id: 'war', label: '전쟁' },
      { id: 'western', label: '서부' },
    ],
  },
];

export default function RecommendPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'keyword' | 'taste' | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [, ] = useState<TasteProfile | null>(null);

  const isKeywordMode = mode === 'keyword';
  const current = isKeywordMode ? keywordSteps[step - 1] : null;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleModeSelect = (selectedMode: 'keyword' | 'taste') => {
    setMode(selectedMode);
    setStep(1);

    if (selectedMode === 'taste') {
      handleTasteRecommendation();
    }
  };

  const handleTasteRecommendation = async () => {
    try {
      setShowTeaser(true);
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('토큰이 없습니다.');

      const res = await axios.get(`/api/taste/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res.data;
      const parsedTaste = {
        topGenres: (raw.topGenres as TasteResponseItem[]).map((g) => g.name),
        topActors: (raw.topActors as TasteResponseItem[]).map((a) => a.name),
        topDirectors: (raw.topDirectors as TasteResponseItem[]).map((d) => d.name),
      };


      const recommendRes = await axios.post(
        `/api/recommend`,
        { choices: [], taste: parsedTaste },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('recommendation', JSON.stringify(recommendRes.data));
      router.push('/recommend/result');
    } catch (err) {
      console.error('취향 기반 추천 실패:', err);
      alert('추천을 불러오지 못했습니다.');
    }
  };

  const handleNext = async () => {
    if (!selected) return;

    const newAnswers = [...answers];
    newAnswers[step - 1] = selected;
    setAnswers(newAnswers);

    if (step < keywordSteps.length) {
      setStep(step + 1);
      setSelected(null);
    } else {
      try {
        setShowTeaser(true);
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('토큰이 없습니다.');

        const res = await axios.post(
          `/api/recommend`,
          {
            choices: newAnswers,
            taste: null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        localStorage.setItem('recommendation', JSON.stringify(res.data));
        router.push('/recommend/result');
      } catch (err) {
        console.error('추천 요청 실패:', err);
        alert('추천을 불러오지 못했습니다.');
      }
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundImage: "url('/images/back.png')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 max-w-md w-full p-6 bg-white rounded-xl shadow-lg backdrop-blur">
        {mode === null ? (
          <>
            <h1 className="text-xl font-bold mb-6">추천 방식을 선택해주세요</h1>
            <ul className="space-y-4 mb-6">
              <li
                onClick={() => handleModeSelect('keyword')}
                className="cursor-pointer p-4 bg-white rounded-lg hover:bg-gray-100 text-center"
              >
                키워드 기반 추천
              </li>
              <li
                onClick={() => handleModeSelect('taste')}
                className="cursor-pointer p-4 bg-white rounded-lg hover:bg-gray-100 text-center"
              >
                취향 분석 기반 추천
              </li>
            </ul>
          </>
        ) : isKeywordMode && current ? (
          <>
            <h1 className="text-xl font-bold mb-6">{current.question}</h1>
            <ul
              className={`mb-6 ${
                step === 3 ? 'grid grid-cols-2 sm:grid-cols-4 gap-4' : 'space-y-4'
              }`}
            >
              {current.options.map((option) => {
                const isSelected = selected === option.id;
                return (
                  <li
                    key={option.id}
                    onClick={() => setSelected(option.id)}
                    className={`rounded-lg transition font-small cursor-pointer ${
                      step === 3
                        ? `h-12 flex items-center justify-center text-center ${
                            isSelected
                              ? 'border-2 border-pink-400 bg-pink-100'
                              : 'bg-white hover:bg-gray-100'
                          }`
                        : `p-3 flex justify-between items-center ${
                            isSelected
                              ? 'bg-pink-100'
                              : 'bg-white hover:bg-gray-100'
                          }`
                    }`}
                  >
                    <span>{option.label}</span>
                    {step !== 3 && (
                      <Image
                        src={
                          isSelected
                            ? '/images/checked.png'
                            : '/images/check-mark.png'
                        }
                        alt={isSelected ? '선택됨' : '미선택'}
                        width={24}
                        height={24}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <button
              onClick={handleNext}
              disabled={!selected}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                selected ? 'bg-[#F3344E]' : 'bg-gray-200 cursor-not-allowed'
              }`}
            >
              {step === keywordSteps.length ? '추천 받기' : '다음'}
            </button>
          </>
        ) : null}
      </div>

      {showTeaser && <TeaserOverlay visible={true} />}
    </div>
  );
}
