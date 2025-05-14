'use client';

import React from 'react';
import Image from 'next/image';
import { HeroHeader } from '@/components/hero8-header';
import ThreeDModel from '@/components/ThreeDCube';
import Features from "@/components/features-1";
import MovieList from "@/components/MovieList";


export default function HeroSection() {

  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden relative bg-white min-h-screen">
        <section>
          {/* ✅ 고정 높이 Hero 영역 */}
          <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] pb-12 pt-14 md:pb-12 lg:pt-30 z-0">
            {/* ✅ 배경 이미지 */}
            <div className="absolute inset-0 -z-10 top-[80px]">
              <Image
                className="block sm:hidden object-cover"
                src="/images/home_cinema1.jpg"
                alt="Small Screen Background"
                fill
                priority
              />
              <Image
                className="hidden sm:block md:block object-cover"
                src="/images/home_cinema.png"
                alt="Home Cinema Background"
                fill
                priority
              />
            </div>

            {/* ✅ 3D 모델 */}
            <div className="
              absolute 
              pointer-events-none 
              z-10 
              h-full 
              transform
              scale-75 -translate-y-8
              sm:scale-75 sm:-translate-y-7
              md:scale-95 md:translate-y-4
              lg:scale-105 lg:translate-y-2
              xl:scale-110 xl:translate-y-0
            ">
              <ThreeDModel />
            </div>
          </div>

          {/* ✅ Features 섹션 */}
          <Features />

          {/* ✅ Movie 섹션들 추가 */}
          <div className="px-4 md:px-12 space-y-12 pb-20 pt-20">
            <MovieList />
          </div>
        </section>
      </main>
    </>
  );
}
