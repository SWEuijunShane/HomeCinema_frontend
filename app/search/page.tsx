import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4 pt-20">🔍 검색 중입니다...</div>}>
      <SearchClient />
    </Suspense>
  );
}
