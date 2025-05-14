import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-12 md:py-12 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Choose your movies</h2>
                    {/* <p className="mt-4">Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.</p> */}
                </div> 
                <div className="mx-auto mt-10 grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* <div className="mt-12 flex flex-col items-center justify-center gap-20 sm:flex-row lg:justify-start"> */}
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <Link href="#calendar" className="flex items-center gap-8">
                                            
                                            <span className="text-nowrap">요즘 인기</span>
                                            <img src="/images/fire.png" alt="Start" className=" w-8" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <Link href="#diary" className="flex items-center gap-8">
                                            <span className="text-nowrap">높은 평점</span>
                                            <img src="/images/star.png" alt="Start" className=" w-8" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={3}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <Link href="#recommend" className="flex items-center gap-8">
                                            
                                            <span className="text-nowrap">최신 개봉</span>
                                            <img src="/images/recommend.png" alt="Start" className=" w-8" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={4}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="py-7 px-8 text-base border dark:border-zinc-800 rounded-md shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <Link href="#analysis" className="flex items-center gap-8">
                                            <span className="text-nowrap">개봉 예정</span>
                                            <img src="/images/nasa.png" alt="Start" className=" w-8" />
                                        </Link>
                                    </Button>
                                </div>
                                </div>
            {/* </div> */}
        </section>
    )
}