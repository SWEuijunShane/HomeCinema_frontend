'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import FollowButton from '@/components/FollowButton'
import { useRouter } from 'next/navigation'

interface User {
  userId: number
  nickname: string
  profileImageUrl: string | null
  reviewCount: number
  ratedCount: number
}

export default function FollowListPage({ userId }: { userId?: string }) {
  const router = useRouter()
  const isMyPage = !userId

  const [following, setFollowing] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const headers = { Authorization: `Bearer ${token}` }
        const baseUrl = `/api/follow`

        const followingsUrl = isMyPage ? `${baseUrl}/me_followings` : `${baseUrl}/${userId}/followings`
        const followersUrl = isMyPage ? `${baseUrl}/me_followers` : `${baseUrl}/${userId}/followers`

        const [followingsRes, followersRes] = await Promise.all([
          axios.get<User[]>(followingsUrl, { headers }),
          axios.get<User[]>(followersUrl, { headers }),
        ])

        setFollowing(followingsRes.data)
        setFollowers(followersRes.data)
      } catch (error) {
        console.error('팔로우 정보 불러오기 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFollowData()
  }, [userId])

  const renderUserItem = (user: User) => (
    <li key={user.userId} className="flex items-center justify-between p-3 border rounded">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push(`/otherUser/${user.userId}/profile`)}
      >
        <img
          src={user.profileImageUrl || '/images/default-profile.png'}
          alt={user.nickname}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{user.nickname}</p>
          <p className="text-sm text-gray-500">
            리뷰 {user.reviewCount}개 · 평점 {user.ratedCount}개
          </p>
        </div>
      </div>
      <FollowButton userId={user.userId} />
    </li>
  )

  if (loading) return <p className="p-4">불러오는 중...</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pt-20">
      {/* <h1 className="text-2xl font-bold mb-6">{isMyPage ? '👥 나의 팔로우 현황' : '👥 팔로우 목록'}</h1> */}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Followers</h2>
          {followers.length === 0 ? (
            <p className="text-gray-500">팔로워가 없습니다.</p>
          ) : (
            <ul className="space-y-4">{followers.map(renderUserItem)}</ul>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Following</h2>
          {following.length === 0 ? (
            <p className="text-gray-500">팔로우한 유저가 없습니다.</p>
          ) : (
            <ul className="space-y-4">{following.map(renderUserItem)}</ul>
          )}
        </div>

        
      </div>
    </div>
  )
}
