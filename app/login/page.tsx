"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  const [, setIsLoggedIn] = useState(false)

  useEffect(() => {
  console.log("✅ API URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
}, []);


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  )
}
