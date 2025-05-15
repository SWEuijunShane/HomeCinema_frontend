"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function OAuth2RedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessToken = searchParams.get("accessToken")
  const refreshToken = searchParams.get("refreshToken")

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken ?? "")
      localStorage.setItem("refreshToken", refreshToken ?? "")
      router.push("/") // 로그인 성공 후 홈으로 리디렉션
    }
  }, [accessToken, refreshToken])

  return <div>로그인 중입니다...</div>
}
