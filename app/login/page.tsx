"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  const [, setIsLoggedIn] = useState(false)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  )
}
