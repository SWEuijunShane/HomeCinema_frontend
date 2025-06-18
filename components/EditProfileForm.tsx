import { useState } from "react"
import axios from "axios"
import UploadProfileImage from "./UploadProfileImage"

export default function EditProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const [nickname, setNickname] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>
        닉네임
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </label>

      <UploadProfileImage onUploadSuccess={(url) => setProfileImage(url)} />

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
        저장
      </button>
    </form>
  )
}
