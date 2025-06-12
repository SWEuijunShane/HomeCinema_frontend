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
          <h1 className="text-xl font-bold mb-4 text-center">닉네임 수정</h1>
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

          {/* 로그아웃 / 회원탈퇴 */}
          <div className="mt-6 flex justify-center items-center text-sm text-gray-600 space-x-2">
            <button
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
              className="hover:underline"
            >
              로그아웃
            </button>

            <span className="text-gray-400">|</span>

            <button
              onClick={async () => {
                const confirmDelete = confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
                if (!confirmDelete) return;

                try {
                  await axios.delete("http://localhost:8080/api/user/delete", {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                  });
                  alert("회원 탈퇴가 완료되었습니다.");
                } catch (err) {
                  console.error("회원 탈퇴 실패", err);
                  alert("회원 탈퇴 중 오류가 발생했습니다.");
                  return;
                } finally {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }
              }}
              className="text-gray-600 hover:underline"
            >
              회원탈퇴
            </button>
          </div>

          {/* 아이콘 메뉴 */}
          <div className="mt-12 flex justify-center gap-12">
            <div className="flex flex-col items-center cursor-pointer" onClick={() => router.push('/user/wantToWatch')}>
              <img src="/images/myMovie.png" alt="내 영화" className="w-15 h-15 mb-1" />
              <span className="text-sm text-gray-700">내 영화</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => router.push('/user/rating')}>
              <img src="/images/myRating.png" alt="내 별점" className="w-15 h-15 mb-1" />
              <span className="text-sm text-gray-700">내 별점</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => router.push('/user/review')}>
              <img src="/images/myReview.png" alt="내 리뷰" className="w-15 h-15 mb-1" />
              <span className="text-sm text-gray-700">내 리뷰</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
