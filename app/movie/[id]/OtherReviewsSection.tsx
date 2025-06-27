'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Review {
    reviewId: number;
    userId: number;
    profileImageUrl: string | null;
    userNickname: string;
    content: string;
    emotions: string[];
    rating?: number | null;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    liked?: boolean; // ✅ 프론트에서 좋아요 여부 추적용
}

export default function OtherReviewsSection({ movieId }: { movieId: number }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCommentId, setOpenCommentId] = useState<number | null>(null); // ✅ 댓글창 toggle
    const [commentText, setCommentText] = useState<{ [key: number]: string }>({});

    const router = useRouter();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/movie/${movieId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ❗ 이게 없으면 401 에러 뜸
                    },
                });
                if (!res.ok) throw new Error('리뷰 로딩 실패');
                const data = await res.json();
                setReviews(data.content);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [movieId]);

    const formatDate = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };


    // 댓글 등록 핸들러
    const handleCommentSubmit = async (reviewId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    reviewId,
                    content: commentText[reviewId],
                }),
            });

            if (!res.ok) {
                const errorMessage = await res.text(); // ← 백에서 보낸 메시지 받기
                console.log(errorMessage)
                alert("댓글을 입력해주세요."); // ❗ 사용자에게 에러 보여주기
                return;
            }

            // 등록 성공 후: 입력창 비우기 + 댓글 수 업데이트
            setCommentText((prev) => ({ ...prev, [reviewId]: '' }));
            setReviews((prev) =>
                prev.map((r) =>
                    r.reviewId === reviewId ? { ...r, commentCount: r.commentCount + 1 } : r
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    // ✅ 좋아요 핸들러
    const handleLikeToggle = async (reviewId: number, liked: boolean) => {
        try {
            const method = liked ? 'DELETE' : 'POST';
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviewLike/${reviewId}`, {
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            if (res.ok) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r.reviewId === reviewId
                            ? {
                                ...r,
                                liked: !liked,
                                likeCount: liked ? r.likeCount - 1 : r.likeCount + 1,
                            }
                            : r
                    )
                );
            }
        } catch (err) {
            console.error('좋아요 실패', err);
        }
    };

    if (loading) return <p className="mt-6 text-sm text-gray-500">리뷰 불러오는 중...</p>;

    if (reviews.length === 0) {
        return <p className="mt-6 text-gray-500 italic">아직 등록된 리뷰가 없습니다.</p>;
    }

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800">리뷰 ({reviews.length})</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <div
                        key={review.reviewId}
                        onClick={() => router.push(`/review/${review.reviewId}`)} // ✅ 카드 클릭 시 이동
                        className="cursor-pointer bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between min-h-[360px]"
                    >
                        {/* 상단: 프로필 & 닉네임 & 평점 */}
                        <div className="flex justify-between items-center mb-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center space-x-2">
                                <Link href={`/otherUser/${review.userId}/profile`} onClick={(e) => e.stopPropagation()}>
                                    <img src={review.profileImageUrl || '/images/default-profile.png'} alt="프로필" className="w-8 h-8 rounded-full object-cover" />
                                </Link>
                                <div className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                                    {review.userNickname}
                                </div>
                            </div>
                            {review.rating !== null && review.rating !== undefined && (
                                <div className="text-sm text-yellow-500 font-bold">★ {review.rating.toFixed(1)}</div>
                            )}
                        </div>

                        <div className="text-xs text-gray-400 mb-2">{formatDate(review.createdAt)}</div>
                        <hr className="border-gray-200 mb-2" />

                        {/* 본문 */}
                        <p className="text-sm text-gray-800 mb-2 whitespace-pre-line break-words break-all line-clamp-3 min-h-[63px]">
                            {review.content}
                        </p>

                        <div className="h-6 mt-1 mb-2">
                            {review.content.length > 100 && (
                                <div className="mb-3 mt-auto">
                                    <span className="text-sm text-blue-500 hover:underline">더보기</span>
                                </div>
                            )}
                        </div>

                        {/* 감정 키워드 */}
                        <p className="text-xs text-gray-500 mb-3 break-words">
                            감정 키워드: {review.emotions.join(', ')}
                        </p>

                        <hr className="border-gray-200 mb-3" />

                        {/* 좋아요 & 댓글 */}
                        <div
                            className="flex justify-between items-center text-sm text-gray-500 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`flex items-center gap-1 cursor-pointer ${review.liked ? 'text-blue-500' : ''}`}
                                    onClick={() => handleLikeToggle(review.reviewId, !!review.liked)}
                                >
                                    <ThumbsUp size={16} />
                                    <span className="text-xs mt-1">{review.likeCount}</span>
                                </div>
                                <div
                                    className="flex items-center gap-1 cursor-pointer"
                                    onClick={() =>
                                        setOpenCommentId((prev) => (prev === review.reviewId ? null : review.reviewId))
                                    }
                                >
                                    <MessageCircle size={16} />
                                    <span className="text-xs mt-1">{review.commentCount}</span>
                                </div>
                            </div>
                            <div className="text-gray-400 text-xl cursor-pointer">⋯</div>
                        </div>

                        {/* ✅ 댓글 입력창 토글 */}
                        {openCommentId === review.reviewId && (
                            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                                <textarea
                                    className="w-full border rounded-md p-2 text-sm"
                                    placeholder="댓글을 입력하세요..."
                                    value={commentText[review.reviewId] || ''}
                                    onChange={(e) =>
                                        setCommentText((prev) => ({ ...prev, [review.reviewId]: e.target.value }))
                                    }
                                ></textarea>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCommentSubmit(review.reviewId);
                                    }}
                                    className="mt-1 px-3 py-1 bg-blue-500 text-white text-xs rounded-md"
                                >
                                    등록
                                </button>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
