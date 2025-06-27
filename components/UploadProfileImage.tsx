import { useState } from "react"
import axios from "axios"

export default function UploadProfileImage({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/upload-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      const imageUrl = res.data.url
      onUploadSuccess(imageUrl)
    } catch (err) {
      alert("이미지 업로드 실패")
      console.error(err)
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="미리보기" className="w-24 h-24 rounded-full object-cover" />}
    </div>
  )
}
