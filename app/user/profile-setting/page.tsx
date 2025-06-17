'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ProfileSettingPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [emojiUrl, setEmojiUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setEmojiUrl(null)
    }
  }

  const generateEmoji = async () => {
    if (!imageFile) return
    setLoading(true)

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        alert('로그인이 필요합니다.')
        return
      }

      const formData = new FormData()
      formData.append('file', imageFile)

      const res = await fetch('http://localhost:8080/api/emoji/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        throw new Error('이모지 생성 실패')
      }

      const data = await res.json()
      setEmojiUrl(data.emojiUrl)
    } catch (err) {
      alert('이모지 생성 중 오류가 발생했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-6 text-center">프로필 설정</h1>

      <label className="block mb-2 text-sm font-medium text-gray-700">프로필 사진 업로드</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">사진 미리보기</p>
          <Image
            src={previewUrl}
            alt="preview"
            width={200}
            height={200}
            className="rounded border shadow-sm"
          />
        </div>
      )}

      <Button
        className="mt-6 w-full"
        onClick={generateEmoji}
        disabled={loading || !imageFile}
      >
        {loading ? '생성 중...' : '이모지 생성하기'}
      </Button>

      {emojiUrl && (
        <div className="mt-6 text-center">
          <p className="mb-2 text-sm text-gray-500">이모지 결과</p>
          <Image
            src={emojiUrl}
            alt="emoji"
            width={100}
            height={100}
            className="rounded-full mx-auto border shadow"
          />
        </div>
      )}
    </div>
  )
}
