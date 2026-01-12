"use client";

import { useEffect, useState } from "react";
import customAxios from "@/lib/axios";
import Profile from "@/components/profile";
//import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditProfileForm from "@/components/EditProfileForm"; // EditProfileForm
import EditForm from "@/components/Editform"; // EditForm

type UserInfo = {
  email: string;
  name: string;
  nickname: string;
  profileImage?: string;
};

type Badge = {
  id: number;
  name: string;
};

export default function ClientProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false); // 내 프로필 설정에 대한 편집 상태
  const [isProfileEditing, setIsProfileEditing] = useState(false); // 회원수정에 대한 편집 상태
  const [badges, setBadges] = useState<Badge[]>([]);


  const router = useRouter();
  const token = localStorage.getItem("accessToken");
  const fetchUserInfo = async () => {
    try {
      const res = await customAxios.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("사용자 정보를 불러올 수 없습니다.", err);
    }
  };

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await customAxios.get("/api/badge/me", {
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
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("✅ 프로필 이미지 URL:", user.profileImage);
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  if (isEditing) {
    return (
      <div className="max-w-md w-full mx-auto bg-white rounded p-6 mt-15">
        <label className="block mb-2 text-sm font-medium text-gray-700">프로필 사진 업로드</label>
        <EditProfileForm
          onSuccess={() => {
            setIsEditing(false);
            fetchUserInfo();
          }}
        />
      </div>
    );
  }

  if (isProfileEditing) {
    return (
      <div className="max-w-md w-full mx-auto bg-white rounded p-6 mt-15">
        <h1 className="text-xl font-bold mb-4 text-center">회원 정보 수정</h1>
        <EditForm
          onSuccess={() => {
            setIsProfileEditing(false);
            fetchUserInfo();
          }}
        />
      </div>
    );
  }

  return (
    <div className=" w-full max-w-5xl mx-auto mt-10 p-6 bg-white rounded pt-20 pb-20">
      {isEditing ? (
        // "내 프로필 설정" 버튼 클릭 시 EditProfileForm을 렌더링

        <>
          <div className="max-w-md w-full mx-auto bg-white rounded shadow p-6">

            {/* <h1 className="text-xl font-bold mb-4 text-center">내 프로필 설정</h1> */}
            <EditProfileForm
              onSuccess={() => {
                setIsEditing(false); // EditProfileForm 완료 후 숨기기
                fetchUserInfo(); // 사용자 정보 갱신
              }}
            />
          </div>
        </>
      ) : isProfileEditing ? (
        // "회원수정" 버튼 클릭 시 EditForm을 렌더링
        <EditForm
          onSuccess={() => {
            setIsProfileEditing(false); // EditForm 완료 후 숨기기
            fetchUserInfo(); // 사용자 정보 갱신
          }}
        />
      ) : (
        <>
          <div className="w-full flex justify-center">
            <div className="flex justify-between gap-5 items-center flex-wrap max-w-4xl w-full ">
              {/* 왼쪽: 유저 프로필 + 버튼 */}
              <div className="flex flex-col gap-4 items-center sm:items-start w-full sm:w-1/3 sm:min-w-[250px] ">
                <Profile
                  user={user}
                  onAIProfileClick={() => router.push("/user/profile-setting")}
                  onEditProfileClick={() => setIsEditing(true)}
                />

              </div>


              {/* 전체 오른쪽 박스 */}
              <div className="flex flex-col gap-4 w-full max-w-xl">

                {/* 🎖️ 뱃지 컨테이너 */}
                <div className="bg-[#0F1327] border border-gray-600 rounded-md p-4 text-white text-sm">
                  <div className="font-semibold mb-2">🎖️ 내 활동 뱃지</div>
                  <div className="flex flex-wrap gap-3">
                    {badges.length > 0 ? (
                      badges.map((badge) => (
                        <div
                          key={badge.id}
                          className="relative group w-fit flex flex-col items-center"
                        >
                          {/* 말풍선 텍스트 */}
                          <span className="absolute top-[100%] mt-2 px-3 py-1 bg-white text-black text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                            {badge.name}
                          </span>

                          {/* 뱃지 이미지 */}
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

                {/* 📌 버튼들 한 줄로 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* 버튼 1: 내 영화 */}
                  <button
                    onClick={() => router.push("/user/wantToWatch")}
                    className="flex flex-row items-center justify-center gap-2 p-5 bg-gradient-to-b from-white to-gray-30 text-gray-800 border-[0.5px] border-gray-300 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-150 ease-in-out"
                  >
                    <img src="/images/myMovie.png" alt="내 영화" className="w-12 h-12" />
                    <span className="text-base">내 영화</span>

                  </button>

                  {/* 버튼 2: 내 별점 */}
                  <button
                    onClick={() => router.push("/user/rating")}
                    className="flex flex-row items-center justify-center gap-2 p-5 bg-gradient-to-b from-white to-gray-30 text-gray-800 border-[0.5px] border-gray-300 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-150 ease-in-out"
                  >
                    <img src="/images/myRating.png" alt="내 별점" className="w-12 h-12" />
                    <span className="text-base">내 별점</span>

                  </button>

                  {/* 버튼 3: 내 리뷰 */}
                  <button
                    onClick={() => router.push("/user/review")}
                    className="flex flex-row items-center justify-center gap-2 p-5 bg-gradient-to-b from-white to-gray-30 text-gray-800 border-[0.5px] border-gray-300 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-150 ease-in-out"
                  >
                    <img src="/images/myReview.png" alt="내 리뷰" className="w-12 h-12" />
                    <span className="text-base">내 리뷰</span>

                  </button>

                  {/* 버튼 4: 친구 목록 */}
                  <button
                    onClick={() => router.push("/friend/list")}
                    className="flex flex-row items-center justify-center gap-2 p-5 bg-gradient-to-b from-white to-gray-30 text-gray-800 border-[0.5px] border-gray-300 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-150 ease-in-out"
                  >
                    <img src="/images/myFriend.png" alt="내 친구" className="w-12 h-12" />
                    <span className="text-base">내 친구</span>

                  </button>
                </div>

                <div className="flex text-sm text-gray-300 space-x-2 justify-center">
                  <button onClick={() => setIsProfileEditing(true)} className="hover:underline">
                    회원수정
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={async () => {
                      const confirmDelete = confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
                      if (!confirmDelete) return;

                      try {
                        await axios.delete(`/api/user/delete`, {
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
                    className="hover:underline"
                  >
                    회원탈퇴
                  </button>
                </div>
              </div>


            </div>
          </div>

        </>
      )}
    </div>
  );
}
