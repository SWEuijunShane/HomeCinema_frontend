// import HeroSection from "@/components/hero-section";
// //import Features from "@/components/features-1";
// //import ThreeDCube from "@/components/ThreeDCube";
// //import Movie from "@/components/Movie";

// export default function Home() {
//   return (
//     <>
//     <HeroSection />
    
    
//     </>
    
//   );
// }


"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import HeroSection from "@/components/hero-section"
import axios from "axios"

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      setIsLoggedIn(false)
      setLoading(false)
      return
    }

    // ✅ 백엔드에 유효성 확인
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsLoggedIn(true)
        setLoading(false)
      })
      .catch(() => {
        // ❌ 토큰 유효하지 않음 → 로그인 해제
        localStorage.removeItem("accessToken")
        setIsLoggedIn(false)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <>
      {isLoggedIn ? (
        <HeroSection />
      ) : (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          </div>
        </div>
      )}
    </>
  )
}
