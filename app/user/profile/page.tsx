import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 클라이언트 컴포넌트를 다이내믹으로 불러오되 SSR은 끔
const ClientProfile = dynamic(() => import('./ClientProfile'), {
  ssr: false,
});

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="pt-20 p-6">로딩 중...</div>}>
      <ClientProfile />
    </Suspense>
  );
}
