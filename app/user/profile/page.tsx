'use client';

import dynamic from 'next/dynamic';

// ✅ ClientProfilePage를 dynamic import로 감쌈
const ClientProfilePage = dynamic(() => import('./ClientProfile'), {
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default function Page() {
  return <ClientProfilePage />;
}
