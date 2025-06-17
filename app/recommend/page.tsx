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


const steps: { question: string; options: Option[] }[] = [
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
      { id: 'dark', label: '어두운 분위기 🙂‍↕️' },
      { id: 'bright', label: '밝은 분위기 🙂' },
    ],
  },
  {
    question: '연령대를 골라주세요',
    options: [
      { id: 'all', label: '전체 관람가 👶' },
      { id: '15', label: '15세 이상 👦' },
      { id: '19', label: '19세 이상 👩‍❤️‍👨' },
    ],
  },
];

export default function RecommendPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // ✅ fade-in 상태

  const current = steps[step];

  const [taste, setTaste] = useState<TasteProfile | null>(null);

useEffect(() => {
  const fetchTaste = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  try {
    const res = await axios.get('http://localhost:8080/api/taste/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const raw = res.data;

    // 예: 백엔드에서 [{name: "드라마", count: 8}] 형태로 오면 → 가공 필요
    const parsedTaste = {
      topGenres: raw.topGenres.map((g: any) => g.name),
      topActors: raw.topActors.map((a: any) => a.name),
      topDirectors: raw.topDirectors.map((d: any) => d.name),
    };

    setTaste(parsedTaste);
  } catch (err) {
    console.error('취향 정보 로딩 실패', err);
  }
};


  fetchTaste();
}, []);


  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10); // mount 직후 opacity 전환
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    if (!selected) return;

    const newAnswers = [...answers];
    newAnswers[step] = selected;
    setAnswers(newAnswers);

    if (step + 1 < steps.length) {
      setStep(step + 1);
      setSelected(null);
    } else {
      try {
        setShowTeaser(true); // 로딩 애니메이션 표시

        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('토큰이 없습니다.');

        const res = await axios.post(
          'http://localhost:8080/api/recommend',
          { 
            choices: newAnswers,
            taste: taste,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

       
        const data = res.data;
        localStorage.setItem('recommendation', JSON.stringify(data));

        router.push('/recommend/result');
      } catch (err) {
        console.error('추천 요청 실패:', err);
        alert('추천을 불러오지 못했습니다.');
      }
    }
  };

  return (
    <div
      className={`
        relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{ backgroundImage: "url('/images/back.png')" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 max-w-md w-full p-6 bg-white rounded-xl shadow-lg backdrop-blur " >
        <h1 className="text-xl font-bold mb-6 ">{current.question}</h1>

        <ul className="space-y-4 mb-6">
          {current.options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <li
                key={option.id}
                onClick={() => setSelected(option.id)}
                className="cursor-pointer p-3 flex justify-between items-center"
              >
                <span>{option.label}</span>
                <Image
                  src={isSelected ? '/images/checked.png' : '/images/check-mark.png'}
                  alt={isSelected ? '선택됨' : '미선택'}
                  width={24}
                  height={24}
                />
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
          {step === steps.length - 1 ? '추천 받기' : '다음'}
        </button>
      </div>

      {showTeaser && <TeaserOverlay visible={true} />}
    </div>
  );
}
