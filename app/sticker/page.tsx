import { Suspense } from 'react';
import StickerClient from './StickerClient';

export default function StickerPage() {
  return (
    <Suspense fallback={<div className="p-4 pt-20">🎨 스티커 로딩 중...</div>}>
      <StickerClient />
    </Suspense>
  );
}
