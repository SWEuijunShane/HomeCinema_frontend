'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import FollowButton from '@/components/FollowButton';

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

export default function OtherUserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserPublicProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>불러오는 중...</p>;
  if (!user) return <p>유저 정보를 불러오지 못했습니다.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow pt-20 pb-20 text-center pt-20">
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


      <div className="mt-6 flex justify-around text-sm text-gray-700">
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
    </div>
  );
}
