'use client';

import Link from "next/link";
import Image from "next/image";

export function MinimalHeader() {
  return (
    <header>
      <nav className="fixed top-0 z-20 w-full h-[72px] bg-background/50 border-b backdrop-blur-3xl">
        <div className="mx-auto max-w-6xl px-6 h-full">
          <div className="flex items-center h-full">
            <Link href="/" scroll={false} className="flex items-center h-full">
              <Image
                src="/images/logo3.png"
                alt="방구석시네마 로고"
                width={120}
                height={50}
                className="h-auto w-auto block"
                priority
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
