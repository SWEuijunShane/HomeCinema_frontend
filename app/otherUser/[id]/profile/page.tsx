'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import customAxios from "@/lib/axios";
import { useParams, useRouter } from 'next/navigation';
import FollowButton from '@/components/FollowButton';
import TasteProfile from '@/components/TasteProfile';

interface UserPublicProfileDto {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  ratedCount: number;
  wantToWatchCount: number;
  isFollowing: boolean;
}

interface TasteItemDto {
  id: number;
  name: string;
  imageUrl: string | null;
  count: number;
  tmdbId: number;
}

interface TasteProfileDto {
  topActors: TasteItemDto[];
  topDirectors: TasteItemDto[];
  topGenres: TasteItemDto[];
  topCountries: TasteItemDto[];
  totalWatchTime: number;
}

type Badge = {
  id: number;
  name: string;
};

export default function OtherUserProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<UserPublicProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);

  const [taste, setTaste] = useState<TasteProfileDto | null>(null);
  const [tasteError, setTasteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8080/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error('유저 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await customAxios.get(`/api/badge/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBadges(res.data);
      } catch (err) {
        console.error("뱃지 데이터를 불러오지 못했습니다.", err);
      }
    };

    fetchBadges();
  }, []);

  useEffect(() => {
    const fetchTasteProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token || !id) return;

        const res = await axios.get(`http://localhost:8080/api/taste/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaste(res.data);
      } catch (err) {
        console.error("타인 취향 분석 불러오기 실패", err);
        setTasteError("취향 분석 데이터를 불러올 수 없습니다.");
      }
    };

    fetchTasteProfile();
  }, [id]);

  if (loading) return <p>불러오는 중...</p>;
  if (!user) return <p>유저 정보를 불러오지 못했습니다.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white pt-20 pb-20 text-center">
      <img
        src={user.profileImageUrl || '/images/default-profile.png'}
        alt="프로필 이미지"
        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
      />
      <h1 className="text-xl font-bold mb-2">{user.nickname}</h1>
      <FollowButton userId={user.userId} />

      <p
        className="mt-4 text-sm text-gray-600 cursor-pointer hover:underline"
        onClick={() => router.push(`/friend/list/${user.userId}`)}
      >
        팔로워 <b>{user.followerCount}</b> · 팔로잉 <b>{user.followingCount}</b>
      </p>

      <div className="mt-6 flex justify-around text-sm text-gray-700 mb-6">
        <div onClick={() => router.push(`/otherUser/${user.userId}/rating`)} className="cursor-pointer">
          <p className="font-bold text-lg">{user.ratedCount}</p>
          <p>평가</p>
        </div>
        <div onClick={() => router.push(`/otherUser/${user.userId}/review`)} className="cursor-pointer">
          <p className="font-bold text-lg">{user.reviewCount}</p>
          <p>리뷰</p>
        </div>
        <div onClick={() => router.push(`/otherUser/${user.userId}/wantToWatch`)} className="cursor-pointer">
          <p className="font-bold text-lg">{user.wantToWatchCount}</p>
          <p>보고싶어요</p>
        </div>
      </div>

      {/* 🎖️ 뱃지 */}
      <div className="bg-[#0F1327] border border-gray-600 rounded-md p-4 text-white text-sm">
        <div className="font-semibold mb-2">🎖️ <strong className="text-[15px]">{user.nickname}</strong> 님의 활동 뱃지</div>
        <div className="flex flex-wrap gap-3">
          {badges.length > 0 ? (
            badges.map((badge) => (
              <div key={badge.id} className="relative group w-fit flex flex-col items-center">
                <span className="absolute top-[100%] mt-2 px-3 py-1 bg-white text-black text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                  {badge.name}
                </span>
                <img
                  src={`/images/badge/${badge.id}.png`}
                  alt={badge.name}
                  className="w-15 h-12"
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">획득한 뱃지가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 🎬 취향 분석 섹션 */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">🎬 <strong className="text-[18px]">{user.nickname}</strong> 님의 취향 분석</h2>
        {tasteError ? (
          <p className="text-red-500 text-sm">{tasteError}</p>
        ) : taste ? (
          <TasteProfile taste={taste} isMyProfile={false}/>
        ) : (
          <p className="text-sm text-gray-500">취향 데이터를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}
