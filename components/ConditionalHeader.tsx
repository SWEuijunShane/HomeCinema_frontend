'use client';

import { usePathname } from 'next/navigation';
import { HeroHeader } from './hero8-header';
import { MinimalHeader } from './MinimalHeader';
import { useEffect, useState } from 'react';

export function ConditionalHeader() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [pathname]);
  // pathname에 따라 아예 헤더 숨김 (예: 로그인 페이지)
  if (pathname.startsWith('/login')) return <MinimalHeader />;

  // 아직 상태 체크 중일 때 아무것도 렌더링하지 않음 (깜빡임 방지)
  if (isLoggedIn === false) return <MinimalHeader />;

  return isLoggedIn ? <HeroHeader /> : <MinimalHeader />;
   
}
