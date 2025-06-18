// // components/edit-profile-form.tsx
// "use client"

// import { useState } from "react"
// import customAxios from "@/lib/axios"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"

// export default function EditProfileForm({ onSuccess }: { onSuccess: () => void }) {
// //   const [password, setPassword] = useState("")
//   const [nickname, setNickname] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const accessToken = localStorage.getItem("accessToken")
//       await customAxios.put(
//         "/api/user/edit",
//         {
//         //   password: password || null,
//           nickname: nickname || null,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       )

//       alert("회원 정보가 수정되었습니다.")
//       onSuccess()
//     } catch (error: any) {
//       alert(error?.response?.data || "회원 정보 수정 실패")
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Label htmlFor="nickname">닉네임 수정</Label>
//         <Input
//           id="nickname"
//           value={nickname}
//           onChange={(e) => setNickname(e.target.value)}
//         />
//       </div>

//       <div className="flex gap-2">
//         <Button type="submit" className="flex-1">
//             수정 완료
//         </Button>
//         <Button
//             type="button"
//             variant="outline"
//             className="flex-1"
//             onClick={onSuccess}
//         >
//             취소
//         </Button>
//         </div>

//     </form>
//   )
// }
