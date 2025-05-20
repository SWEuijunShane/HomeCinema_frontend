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


"use client"  // Next.js app router에서 클라이언트 컴포넌트로 명시

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
//import MainPage from "./MainPage" // 메인 화면 컴포넌트 임포트 (경로는 상황에 맞게 조정)
import HeroSection from "@/components/hero-section";


export default function Page() {
  const [loading, setLoading] = useState(true) // 로그인 상태 확인 중
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 예: 로컬스토리지에 token이 있으면 로그인된 상태로 판단
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div>로딩 중...</div> // 혹은 스켈레톤 UI, 스피너 등
  }

  return (
    <>
      {isLoggedIn ? (
        <HeroSection />
      ) : (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm setIsLoggedIn={setIsLoggedIn}/>
          </div>
        </div>
      )}
    </>
  )
}
