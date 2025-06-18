'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface FriendActivity {
  userId: number;
  nickname: string;
  activityType: 'REVIEW' | 'RATING' | 'WISHLIST' | 'BADGE';
  movieId: number;
  movieTitle: string;
  moviePosterPath: string;
  content: string | null;
  createdAt: string; // ISO string
}

export default function FriendActivityPage() {
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:8080/api/friendActivity/recent', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(res.data);
      } catch (err) {
        console.error('친구 소식 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">친구 소식</h1>
      {activities.length === 0 ? (
        <p>최근 3일간 친구의 활동이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {activities.map((activity, index) => (
            <li key={index} className="p-4 bg-gray-50 rounded">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600 font-semibold">@{activity.nickname}</p>
                <span className="text-xs text-gray-400">{formatTime(activity.createdAt)}</span>
              </div>
              {/* BADGE 타입일 경우 별도 표시 */}
              {activity.activityType === 'BADGE' ? (
                <div className="text-center py-6">
                  <p className="text-gray-700 text-sm">
                    🏅 <strong>@{activity.nickname}</strong>님이{' '}
                    <strong>“{activity.content}”</strong> 뱃지를 획득했어요!
                  </p>
                </div>
              ) : (
                <>
                  {/* 활동 타입 라벨 */}
                  <div className="text-xs bg-gray-200 text-gray-600 inline-block px-2 py-1 rounded mb-2">
                    {activity.activityType === 'REVIEW' && '✏️ 리뷰 작성'}
                    {activity.activityType === 'RATING' && '⭐ 평점'}
                    {activity.activityType === 'WISHLIST' && '📝 보고싶어요'}
                  </div>

                  <hr className="my-2" />

                  <Link href={`/movie/${activity.movieId}`} className="flex gap-4 items-start hover:opacity-90">
                    <img
                      src={`https://image.tmdb.org/t/p/w154${activity.moviePosterPath}`}
                      alt={activity.movieTitle}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div>
                      <h2 className="text-md font-bold mb-4">{activity.movieTitle}</h2>
                      {activity.content && (
                        <p className="text-gray-800 text-sm mb-2">{activity.content}</p>
                      )}
                    </div>
                  </Link>

                  {/* 감정 키워드: REVIEW 타입일 때만 */}
                  {activity.activityType === 'REVIEW' && activity.content && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* 백엔드에서 감정 키워드 추출하면 배열로 내려주도록 추가하고 여기에 매핑 */}
                      {/* 예: ['감동적인', '웃긴'] */}
                      {/* 아래는 예시용 하드코딩 */}
                      {['감동적인', '생각하게 되는'].map((emotion, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                        >
                          #{emotion}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
