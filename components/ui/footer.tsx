"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Footer() {
  const [ratingCount, setRatingCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchRatingCount = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/movieRating/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch rating count");
        const count = await res.json();
        setRatingCount(count);
      } catch (err) {
        console.error("Error fetching rating count:", err);
      }
    };

    fetchRatingCount();
  }, []);

  return (
    <footer className="w-full bg-[#141414] text-foreground border-t border-black">
      <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">

        {/* ⭐ 총 평점 수 표시 */}
        {ratingCount !== null && (
          <div className="text-center text-white text-sm sm:text-xl">
            So far{" "}
            <span className="text-[#F3344E] font-semibold inline-flex items-center gap-1">
              <span className="text-lg sm:text-xl">★</span>
              {ratingCount.toLocaleString()} ratings
            </span>{" "}
            have made.
          </div>
        )}

<div className="flex flex-row sm:flex-row items-start sm:items-center gap-4 w-full">
  {/* 로고 + 텍스트 옆 정렬 */}
  <div className="flex items-center gap-6">
    <Image
      src="/images/logo__h.png"
      alt="HomeCinema Logo"
      width={80}
      height={50}
      className="sm:w-[95px] sm:h-[60px]"
      priority
    />

    <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-left">
      <p className="text-white font-semibold">
        홈시네마 | made by 이의준, 이세인
      </p>
      <p>이메일 | SWEuijunShane@gmail.com</p>
      <p>연락처 | 02-123-4567</p>
    </div>
  </div>
</div>



        {/* 하단: 저작권 & 정책 */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground border-t pt-6 space-y-4 sm:space-y-0">
          <div>© 2025 SWEuijunShane. All rights reserved</div>
          <div className="flex items-center gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
