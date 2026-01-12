'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface FriendActivity {
  activityType: 'REVIEW' | 'RATING' | 'WISHLIST' | 'BADGE';
  userId: number;
  nickname: string;
  profileImage: string | null;
  movieId?: number;
  movieTitle?: string;
  moviePosterPath?: string;
  movieYear?: string;
  reviewContent?: string;
  rating?: number;
  emotions?: string[];
  badgeName?: string;
  createdAt: string;
}

export default function FriendActivityPage() {
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`/api/friendActivity/recent`, {
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
    <div className="p-4 max-w-3xl mx-auto pt-20">
      {/* <h1 className="text-2xl font-bold mb-6 text-center">친구 소식</h1> */}
      {activities.length === 0 ? (
        <p>최근 3일간 친구의 활동이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {activities.map((activity, index) => (
            <li key={index} className="p-4 bg-gray-50 rounded">
              {/* 상단 프로필 & 활동 멘트 */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Link href={`/otherUser/${activity.userId}/profile`}>
                    <img src={activity.profileImage || '/images/default-profile.png'} alt="프로필" className="w-6 h-6 rounded-full object-cover" />
                  </Link>
                  <span className="text-gray-500 mb-1">
                    <strong className="text-gray-900">{activity.nickname}</strong>님이 <strong className="text-gray-900">{activity.movieTitle}</strong>
                    {activity.reviewContent && activity.rating
                      ? '에 리뷰와 평점을 남겼어요.'
                      : activity.reviewContent
                        ? '에 리뷰를 남겼어요.'
                        : activity.rating
                          ? '에 평점을 남겼어요.'
                          : activity.activityType === 'WISHLIST'
                            ? '을 보고싶어요에 추가했어요.'
                            : activity.activityType === 'BADGE'
                              ? '뱃지를 획득했어요.'
                              : ''}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{formatTime(activity.createdAt)}</span>
              </div>

              {/* BADGE 타입 */}
              {activity.activityType === 'BADGE' ? (
                <div className="text-center py-6">
                  <p className="text-gray-700 text-sm">
                    🏅 <strong>{activity.badgeName}</strong> 뱃지를 획득했어요!
                  </p>
                </div>
              ) : (
                activity.movieId && (
                  <div className="mt-2">
                    <Link href={`/movie/${activity.movieId}`} className="flex gap-4 items-start hover:opacity-90">
                      <img
                        src={`https://image.tmdb.org/t/p/w154${activity.moviePosterPath}`}
                        alt={activity.movieTitle}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">{activity.movieTitle}</p>
                        <p className="text-xs text-gray-500 mb-1">{activity.movieYear}</p>

                        {activity.rating && (
                          <p className="text-sm text-yellow-600 mt-2">⭐ 평점 {activity.rating}점</p>
                        )}

                        {activity.reviewContent && (
                          <p className="text-sm text-gray-700 mt-2 whitespace-pre-line break-words break-all line-clamp-3 min-h-[63px]">
                            {activity.reviewContent}
                          </p>
                        )}

                        {/* ✅ 감정 키워드 감싸는 부분에 border-t, pt-2 추가 */}
                        {(activity.emotions?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-2 mt-2">
                            {activity.emotions!.map((emotion, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full border"
                              >
                                #{emotion}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
