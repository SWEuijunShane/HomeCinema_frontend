'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function StickerPage() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [imgSize, setImgSize] = useState({ width: 600, height: 300 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState('/images/bubble/1.png'); // 기본 이미지

  useEffect(() => {
    const initialText = searchParams.get('text');
    if (initialText) setText(initialText);
  }, [searchParams]);

  useEffect(() => {
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      setImgSize({ width: img.width, height: img.height });
    };
  }, [selectedImage]);

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], x, y + j * lineHeight);
    }
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = imgSize;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.src = selectedImage;

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, img.width, img.height);

      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const textX = width * horizontalPosition / 100;
      const textY = height * verticalPosition / 100;
      const maxTextWidth = width * 0.8;
      const lineHeight = fontSize * 1.4;

      wrapText(ctx, text, textX, textY, maxTextWidth, lineHeight);
      setPreviewUrl(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      alert('❌ 이미지 로드 실패!');
    };
  };

  useEffect(() => {
    renderCanvas();
  }, [text, fontSize, horizontalPosition, verticalPosition, imgSize]);

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'sticker.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pt-20">
      {/* <h1 className="text-2xl font-bold mb-6 text-center">자유롭게 수정하는 스티커</h1> */}
      
            <div className="my-6">
      <h2 className="text-lg font-semibold mb-2">말풍선을 선택하세요:</h2>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }, (_, i) => {
          const imagePath = `/images/bubble/${i + 1}.png`;
          return (
            <img
              key={i}
              src={imagePath}
              alt={`bubble${i + 1}`}
              className={`w-24 h-16 object-contain border rounded cursor-pointer transition ${
                selectedImage === imagePath ? 'ring-2 ring-[#F3344E]/70' : 'hover:opacity-80'
              }`}
              onClick={() => setSelectedImage(imagePath)}
            />
          );
        })}
      </div>
    </div>

      <div className="mb-4">
        <label className="block mb-2 text-lg font-semibold">스티커 텍스트:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="예: 정말 생각을 많이 하게 되는 영화인 것 같다"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">텍스트 크기: {fontSize}px</label>
          <input
            type="range"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">수평 위치: {horizontalPosition}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={horizontalPosition}
            onChange={(e) => setHorizontalPosition(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">수직 위치: {verticalPosition}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={verticalPosition}
            onChange={(e) => setVerticalPosition(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      <div className="mt-8 border">
        <h2 className="text-lg font-semibold mb-2 text-center">미리보기</h2>
        <div className="flex justify-center">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="스티커 미리보기"
              style={{ width: imgSize.width / 2, height: imgSize.height / 2 }}
            />
          )}
        </div>
      </div>




      

        <p className="text-sm text-gray-500 text-center mt-5">
          저장 후 인스타그램에서 자유롭게 공유해보세요!
        </p>

      <div className="text-center mb-5 space-y-2 flex justify-center">
        <div className="flex flex-row sm:flex-row justify-center items-center gap-4 mt-6">
        <button
            onClick={handleSaveImage}
            className="px-4 py-2 bg-[#F3344E] text-white rounded hover:bg-[#d72b40] transition"
        >
            이미지 저장
        </button>

        <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 border text-[#F3344E] rounded hover:bg-[#F3344E]/10 transition"
        >
            Instagram
        </a>
        </div>

    </div>




    </div>
  );
}
