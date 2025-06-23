"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import axios from "@/lib/axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps extends React.ComponentProps<"div"> {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export function LoginForm({ className, setIsLoggedIn, ...props }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      })

      const { accessToken, refreshToken, userId } = response.data
      alert("로그인 성공!")

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("userId", userId.toString())

      setIsLoggedIn(true)   // 로그인 성공 상태 업데이트
      router.replace("/")   // 메인 페이지로 이동
    } catch (err) {
      console.error("로그인 실패", err)
      alert("로그인 정보가 올바르지 않습니다.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                   Did you Forget your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}>
                  Login with Google
                </Button>
                <Button variant="outline" onClick={() => {window.location.href = "http://localhost:8080/oauth2/authorization/naver"}}>
                  Login with Naver
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
