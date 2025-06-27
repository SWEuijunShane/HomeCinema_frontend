"use client"

import { useSearchParams } from "next/navigation"

export default function OAuth2FailureClient() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  const getMessage = () => {
    switch (reason) {
      case "no_email":
        return "이메일 정보 제공에 동의하지 않아 로그인할 수 없습니다."
      case "unknown":
      default:
        return "소셜 로그인 중 알 수 없는 오류가 발생했습니다."
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">로그인 실패</h1>
      <p className="text-gray-700">{getMessage()}</p>
      <a
        href="/login"
        className="mt-6 inline-block text-blue-500 underline underline-offset-4"
      >
        로그인 페이지로 돌아가기
      </a>
    </div>
  )
}
