'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface FollowButtonProps {
  userId: number
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  const [myId, setMyId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // 내 ID 불러오기
  useEffect(() => {
    const fetchMyId = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const res = await axios.get<{ id: number }>(
          `/api/user/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setMyId(res.data.id)
      } catch (err) {
        console.error('내 ID 불러오기 실패:', err)
      }
    }

    fetchMyId()
  }, [])

  // 팔로우 상태 확인
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token || myId === null || myId === userId) return

        const res = await axios.get<boolean>(
          `/api/follow/check/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setIsFollowing(res.data)
      } catch (err) {
        console.error('팔로우 상태 확인 실패:', err)
      }
    }

    fetchFollowStatus()
  }, [myId, userId])

  // ✅ 모든 Hook 호출한 이후에 조건부 렌더링!
  if (myId === null || myId === userId || isFollowing === null) {
    console.log('🕓 내 ID 아직 로딩 중 or 자기 자신이므로 버튼 안 보임')
    return null
  }

  const handleClick = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    setLoading(true)
    try {
      if (isFollowing) {
        await axios.delete(`/api/follow/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setIsFollowing(false)
      } else {
        await axios.post(`/api/follow/${userId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setIsFollowing(true)
      }
    } catch (err) {
      console.error('팔로우 토글 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 text-sm rounded border transition ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {loading ? '...' : isFollowing ? '팔로잉' : '팔로우'}
    </button>
  )
}
