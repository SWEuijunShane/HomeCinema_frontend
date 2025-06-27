'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ThumbsUp, Trash2, Pencil } from 'lucide-react';

interface Comment {
  commentId: number;
  content: string;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
}

interface ReviewDetail {
  reviewId: number;
  content: string;
  gifPath: string;
  nickname: string;
  profileImageUrl: string | null;
  userId: number;
  createdAt: string;
  movieId: number;
  movieTitle: string;
  releaseYear: string;
  posterPath: string;
  emotions: string[];
  comments: Comment[];
}

export default function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState<ReviewDetail | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // ✅ 댓글 수정 상태
  const [editedContent, setEditedContent] = useState(''); // ✅ 수정 중인 댓글 내용
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // ✅ 현재 로그인한 사용자 ID
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserIdAndProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const reviewRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviewData = reviewRes.data;
        setReview(reviewData);

        // ✅ 현재 로그인한 사용자 ID를 localStorage에서 가져옴
        const userIdStr = localStorage.getItem('userId');
        if (userIdStr) {
          setCurrentUserId(parseInt(userIdStr));
        }
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndProfile();
  }, [id]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reviewId: review?.reviewId,
        content: newComment,
      }),
    });

    if (res.ok) {
      setNewComment('');
      location.reload();
    } else {
      const msg = await res.text();
      alert(msg);
    }
  };

  // ✅ 댓글 수정 핸들러
  const handleCommentEdit = async (commentId: number) => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comment/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editedContent }),
    });

    if (res.ok && review) {
      setReview({
        ...review,
        comments: review.comments.map(c =>
          c.commentId === commentId ? { ...c, content: editedContent } : c
        ),
      });
      setEditingCommentId(null);
      setEditedContent('');
    }
  };

  // ✅ 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: number) => {
  const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
  if (!confirmDelete) return;

  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/comment/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok && review) {
    setReview({
      ...review,
      comments: review.comments.filter(c => c.commentId !== commentId),
    });
  } else {
    const msg = await res.text();
    alert(`삭제 실패: ${msg}`);
  }
};


  const handleToggleCommentLike = async (commentId: number, liked: boolean) => {
    const token = localStorage.getItem('accessToken');
    const method = liked ? 'DELETE' : 'POST';
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/commentLike/${commentId}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok && review) {
      setReview({
        ...review,
        comments: review.comments.map(c =>
          c.commentId === commentId
            ? { ...c, liked: !liked, likeCount: liked ? c.likeCount - 1 : c.likeCount + 1 }
            : c
        ),
      });
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (!review) return <p>리뷰가 없습니다.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pt-10">
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Link href={`/otherUser/${review.userId}/profile`}>
              <img src={review.profileImageUrl || '/images/default-profile.png'} className="w-8 h-8 rounded-full object-cover" />
            </Link>
            <span className="text-sm font-semibold">{review.nickname}</span>
          </div>
          <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString('ko-KR')}</span>
        </div>

        <div className="flex gap-4 mb-3">
          <Link href={`/movie/${review.movieId}`}>
            <img src={`https://image.tmdb.org/t/p/w154${review.posterPath}`} className="w-20 h-28 object-cover rounded" />
          </Link>
          <div className="flex flex-col justify-start">
            <div className="text-sm font-bold">{review.movieTitle}</div>
            <div className="text-xs text-gray-500">{review.releaseYear}</div>
          </div>
        </div>

        <p className="text-sm text-gray-800 whitespace-pre-line break-words break-all mb-2">{review.content}</p>
        <div className="text-sm text-gray-500">감정 키워드: {review.emotions.join(', ')}</div>
      </div>

      <div className="bg-gray-100 p-3 rounded-md mb-4">
        <textarea
          className="w-full p-2 border rounded text-sm"
          rows={3}
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded text-sm">
          등록
        </button>
      </div>

      <div className="space-y-4">
        {review.comments.map((comment) => (
          <div key={comment.commentId} className="border-b pb-2 flex gap-2 items-start">
            <Link href={`/otherUser/${comment.userId}/profile`}>
              <img src={comment.profileImageUrl || '/default-profile.png'} className="w-8 h-8 rounded-full object-cover mt-1" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Link href={`/otherUser/${comment.userId}/profile`}>
                  <span className="text-sm font-medium hover:underline">{comment.nickname}</span>
                </Link>
                {/* ✅ 본인 댓글일 경우에만 수정/삭제 버튼 노출 */}
                {currentUserId === comment.userId && (
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingCommentId(comment.commentId);
                      setEditedContent(comment.content);
                    }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleCommentDelete(comment.commentId)}>
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === comment.commentId ? (
                <>
                  <textarea
                    className="w-full p-1 border rounded text-sm mt-1"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button className="text-xs text-blue-600" onClick={() => handleCommentEdit(comment.commentId)}>수정</button>
                    <button className="text-xs text-gray-500" onClick={() => setEditingCommentId(null)}>취소</button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-800">{comment.content}</div>
              )}

              <div className="flex items-center mt-1 text-xs text-gray-500 gap-3">
                <span>{new Date(comment.createdAt).toLocaleString('ko-KR')}</span>
                <button
                  onClick={() => handleToggleCommentLike(comment.commentId, comment.liked)}
                  className={`flex items-center gap-1 ${comment.liked ? 'text-blue-500' : ''}`}
                >
                  <ThumbsUp size={14} />
                  {comment.likeCount}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
