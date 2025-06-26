import { useState } from "react"
import axios from "axios"
import UploadProfileImage from "./UploadProfileImage"
import { Button } from "@/components/ui/button"  // Button 컴포넌트 불러오기

export default function EditProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const [nickname, ] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loading, ] = useState(false);
  const [, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.put("http://localhost:8080/api/user/edit", {
        nickname,
        profileImage,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })

      alert("수정 완료")
      onSuccess()
    } catch (err) {
      console.error(err)
      alert("수정 실패")
    }
  }

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setImageFile(file);  // 파일이 선택되면 imageFile 상태를 업데이트
  //     setProfileImage(URL.createObjectURL(file)); // 파일 미리보기 URL 생성
  //   }
  // };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 사진 업로드 컴포넌트 */}
      <UploadProfileImage onUploadSuccess={(url) => {
        setProfileImage(url);
        setImageFile(null);  // 업로드 성공시 파일 상태 초기화 (필요시)
      }} />

      {/* "저장 버튼" */}
      <Button
        className="w-full"
        disabled={loading || !profileImage}  // profileImage가 없으면 버튼 비활성화
      >
        저장
      </Button>
    </form>
  )
}
