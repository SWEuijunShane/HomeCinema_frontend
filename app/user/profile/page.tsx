"use client"

import { useEffect, useState } from "react"
import customAxios from "@/lib/axios"
import Profile from "@/components/profile"
import EditProfileForm from "@/components/edit-profile-form"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter } from 'next/navigation';


type UserInfo = {
  email: string
  name: string
  nickname: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await customAxios.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUser(res.data)
    } catch (err) {
      console.error("사용자 정보를 불러올 수 없습니다.", err)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  if (!user) return <p>Loading...</p>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow pt-20 pb-20">
      {isEditing ? (
        <>
          <h1 className="text-xl font-bold mb-4 text-center">회원정보 수정</h1>
          <EditProfileForm
            onSuccess={() => {
              setIsEditing(false)
              fetchUserInfo()
            }}
          />
        </>
      ) : (
        <>
          <Profile user={user} />
          <Button
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full"
            variant="outline"
          >
            회원정보 수정
          </Button>
         <div className="mt-6 flex justify-center">
    <Button
      variant="ghost"
      size="sm"
      className="w-2/3 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent ring-0 outline-none shadow-none"
      onClick={async () => {
        try {
          await axios.post(
            "http://localhost:8080/api/user/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
        } catch (e) {
          console.log("Logout API Error", e)
        } finally {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("token")
          window.location.href = "/"
        }
      }}
    >
      로그아웃
    </Button>
  </div>

        </>
      )}
          <div className="mt-6 flex justify-between gap-2">
            <Button
              onClick={() => router.push('/user/wantToWatch')}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              보고싶어요 목록 보기
            </Button>
            <Button
              onClick={() => router.push('/user/rating')}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              내 별점 영화 보기
            </Button>
            <Button
              onClick={() => router.push('/user/review')}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              내가 쓴 리뷰 보기
            </Button>
          </div>
    </div>
    
  )
}
