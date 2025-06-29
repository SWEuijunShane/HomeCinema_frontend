'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import heic2any from 'heic2any';

export default function ProfileSettingPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [emojiUrl, setEmojiUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    // ✅ [2] HEIC 파일이면 변환
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
      try {
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" }) as Blob;
        file = new File([convertedBlob], file.name.replace(/\.heic$/, ".jpg"), {
          type: "image/jpeg",
        });
      } catch (err) {
        alert("HEIC 이미지를 변환하는 데 실패했어요.");
        console.error("HEIC 변환 오류:", err);
        return;
      }
    }
    
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setEmojiUrl(null);
  };

  const generateEmoji = async () => {
    if (!imageFile) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const formData = new FormData();
      formData.append('file', imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/emoji/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('이모지 생성 실패');

      const data = await res.json();

      // 🔍 이 위치에 삽입
      console.log("data:", data);
      console.log("data.images:", data.images);
      console.log("data.images[0]:", data.images?.[0]);

      const url = data.emojiUrl ?? data.images?.[0];

      if (url) {
        setEmojiUrl(url);
      } else {
        throw new Error('응답 형식 오류 또는 이미지 없음');
      }
    } catch (err) {
      alert('이모지 생성 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 pt-20">
      {/* <h1 className="text-xl font-bold mb-6 text-center">AI 프로필 설정</h1> */}
      

      <label className="block mb-2 text-sm font-medium text-gray-700">프로필 사진 업로드</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">사진 미리보기</p>
          <Image
            src={previewUrl}
            alt="preview"
            width={100}
            height={200}
            className="rounded border shadow-sm"
            unoptimized
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
          {/* 외부 URL을 안전하게 표시하기 위해 unoptimized 추가 */}
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border shadow">

          <Image
            src={emojiUrl}
            alt="emoji"
            width={100}
            height={100}
            className="w-full h-full object-cover"
            unoptimized
          />
          </div>
          <div className="mt-4 space-x-4">
            <a
              href={emojiUrl}
              download="emoji.webp"
              className="text-blue-600 hover:underline text-sm"
            >
              이미지 다운로드
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
