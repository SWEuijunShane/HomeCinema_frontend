import { Suspense } from "react"
import OAuth2FailureClient from "./OAuth2FailureClient"

export default function OAuth2FailurePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <OAuth2FailureClient />
    </Suspense>
  )
}
