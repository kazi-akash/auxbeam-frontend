'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ChevronLeft, ChevronRight, Loader2, MessageSquarePlus, AlertCircle } from 'lucide-react';
import { useProductReviews } from '@/lib/hooks/public/useReviews';
import { useSubmitReview, useMarkReviewHelpful } from '@/lib/hooks/customer/useCustomerReviews';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'react-toastify';
import type { Review } from '@/lib/types/customer';

// ─── Star renderer ────────────────────────────────────────────────────────────

function StarRow({
  rating,
  size = 'sm',
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const dim = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const active = interactive ? hovered || rating : rating;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${dim} transition-colors ${
            s <= active ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-none text-gray-300'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
}

// ─── Rating bar ───────────────────────────────────────────────────────────────

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-6 text-right text-gray-500 font-medium shrink-0">{label}</span>
      <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-xs text-gray-400 shrink-0">{count}</span>
    </div>
  );
}

// ─── Single review card ───────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const markHelpful = useMarkReviewHelpful();
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
  const [voted, setVoted] = useState(false);

  function handleHelpful() {
    if (voted) return;
    markHelpful.mutate(review.id, {
      onSuccess: (data) => {
        setHelpfulCount(data.helpful_count);
        setVoted(true);
      },
    });
  }

  const name = review.user
    ? `${review.user.first_name} ${review.user.last_name}`
    : 'Anonymous';

  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-amber-700">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <StarRow rating={review.rating} />
      </div>

      {review.title && (
        <p className="text-sm font-semibold text-gray-800 mb-1">{review.title}</p>
      )}
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.comment}</p>

      {/* Helpful */}
      <button
        onClick={handleHelpful}
        disabled={voted || markHelpful.isPending}
        className={`flex items-center gap-1.5 text-xs transition-colors ${
          voted
            ? 'text-amber-600 cursor-default'
            : 'text-gray-400 hover:text-amber-600'
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        Helpful ({helpfulCount})
      </button>
    </div>
  );
}

// ─── Write review form ────────────────────────────────────────────────────────

function WriteReviewForm({
  productId,
  onClose,
}: {
  productId: number;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const submit = useSubmitReview();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }

    submit.mutate(
      { product_id: productId, rating, title: title || undefined, comment },
      {
        onSuccess: () => {
          toast.success('Review submitted — it will appear after approval');
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Failed to submit review';
          toast.error(msg);
        },
      }
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquarePlus className="w-4 h-4 text-amber-600" />
        Write a Review
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Your Rating *
          </label>
          <StarRow rating={rating} size="lg" interactive onRate={setRating} />
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            placeholder="Summarise your experience..."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 bg-white"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Your Review *
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={2000}
            placeholder="Tell others about your experience with this product..."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none bg-white"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/2000</p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submit.isPending}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-900 bg-[#FDE047] hover:bg-[#FCD34D] rounded-lg transition disabled:opacity-60"
          >
            {submit.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Review
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, isError } = useProductReviews(productId, {
    page,
    per_page: 5,
  });

  const stats = data?.stats;
  const reviews = data?.reviews?.data ?? [];
  const total = data?.reviews?.total ?? 0;
  const lastPage = data?.reviews?.last_page ?? 1;
  const avgRating = stats?.average_rating ?? 0;
  const dist = stats?.rating_distribution ?? {};

  // Page numbers window
  const pageNums: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNums.push(i);
  }

  function handleWriteReview() {
    if (!user) {
      toast.info('Please log in to write a review');
      return;
    }
    setShowForm(true);
  }

  return (
    <div className="bg-white p-4 lg:p-8 border border-gray-200 rounded-[6px] font-sans">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Reviews ({total})
          </h2>
          <p className="text-sm text-gray-500">
            Get specific details about this product from customers who own it.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleWriteReview}
            className="flex items-center gap-2 bg-[#FDE047] hover:bg-[#FCD34D] text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-lg transition shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </div>

      {/* ── Write review form ── */}
      {showForm && (
        <WriteReviewForm
          productId={productId}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* ── Stats summary ── */}
      {!isLoading && stats && total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-6 border-b border-gray-100">
          {/* Big average */}
          <div className="flex flex-col items-center justify-center bg-amber-50 rounded-xl px-8 py-5 shrink-0">
            <span className="text-5xl font-bold text-gray-900 leading-none mb-2">
              {avgRating.toFixed(1)}
            </span>
            <StarRow rating={Math.round(avgRating)} size="md" />
            <p className="text-xs text-gray-400 mt-2">{total} reviews</p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-2 justify-center flex flex-col">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                label={String(star)}
                count={Number(dist[star] ?? 0)}
                total={total}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-5 border-b border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gray-100" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 bg-gray-100 rounded" />
                  <div className="h-2.5 w-20 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-4/5 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="flex items-center gap-2 text-sm text-red-500 py-8 justify-center">
          <AlertCircle className="w-4 h-4" />
          Failed to load reviews. Please try again.
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !isError && reviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquarePlus className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No reviews yet</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to review this product</p>
        </div>
      )}

      {/* ── Reviews list ── */}
      {!isLoading && reviews.length > 0 && (
        <div>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!isLoading && lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          {pageNums.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${
                n === page
                  ? 'bg-[#FDE047] text-gray-900 border border-[#FDE047]'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page >= lastPage}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
