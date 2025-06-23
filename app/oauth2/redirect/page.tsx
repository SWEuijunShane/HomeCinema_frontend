"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OAuth2Redirect() {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get("accessToken")
    const refreshToken = urlParams.get("refreshToken")
    const userId = urlParams.get("userId")

    if (accessToken && refreshToken && userId) {
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("userId", userId)

      router.replace("/")  // 로그인 성공하면 메인 페이지로 이동
    } else {
      router.replace("/login") // 실패 시 로그인 페이지로 이동
    }
  }, [router])

  return <div>로그인 처리 중...</div>
}
