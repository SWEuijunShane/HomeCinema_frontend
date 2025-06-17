import Lottie from 'lottie-react';
import loadingAnimation from '@/public/lottie/loading.json';

interface TeaserOverlayProps {
  visible: boolean;
}

export default function TeaserOverlay({ visible }: TeaserOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      <div className="w-64 h-64">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider mt-6 text-white">
        AI가 당신의 취향을 분석 중...
      </p>
      <span className="mt-2 text-sm text-gray-400">잠시만 기다려주세요</span>
    </div>
  );
}
