'use client';

import { MessageSquare, Star, Package } from 'lucide-react';

interface Review {
  id: number;
  productName: string;
  productImage: string | null;
  rating: number;
  title: string;
  body: string;
  date: string;
  status: 'approved' | 'rejected' | 'pending';
  helpfulCount?: number;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    productName: 'Marcy Pro Adjustable Olympic Bench',
    productImage: null,
    rating: 4,
    title: 'Happy with purchase',
    body: 'Nice product. Would have given 5 stars if delivery was faster.',
    date: '4/11/2026',
    status: 'approved',
    helpfulCount: 2,
  },
  {
    id: 2,
    productName: 'SS Ton Reserve Edition English Willow Bat',
    productImage: null,
    rating: 5,
    title: 'Amazing quality!',
    body: 'My son loves this! Perfect for his cricket practice.',
    date: '3/25/2026',
    status: 'rejected',
    helpfulCount: 1,
  },
  {
    id: 3,
    productName: 'SG Test Red Leather Cricket Ball',
    productImage: null,
    rating: 4,
    title: 'Great product',
    body: 'Happy with the purchase. Good value for the price.',
    date: '3/21/2026',
    status: 'approved',
    helpfulCount: 0,
  },
  {
    id: 4,
    productName: 'Marcy Pro Plate Loaded Leg Press',
    productImage: null,
    rating: 5,
    title: 'Excellent product!',
    body: 'This is exactly what I was looking for. The quality is outstanding and delivery was super fast!',
    date: '3/16/2026',
    status: 'pending',
    helpfulCount: 15,
  },
];

const STATUS_STYLE: Record<Review['status'], string> = {
  approved: 'bg-green-50 text-green-600 border border-green-200',
  rejected: 'bg-gray-100 text-gray-500 border border-gray-200',
  pending:  'bg-yellow-50 text-yellow-600 border border-yellow-200',
};

const totalReviews = REVIEWS.length;
const averageRating =
  totalReviews > 0
    ? (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
const pendingReviews = REVIEWS.filter((r) => r.status === 'pending').length;

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
          strokeWidth={0}
        />
      ))}
      <span className="ml-1.5 text-sm text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Reviews</h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage your product reviews and ratings</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Total Reviews */}
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalReviews}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Average Rating</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{averageRating}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" strokeWidth={0} />
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Pending Reviews</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pendingReviews}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Review list */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Your Reviews</h3>
        <div className="space-y-3">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="flex gap-4">
                {/* Product image */}
                <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                  {review.productImage ? (
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {/* Left col */}
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-snug">
                      {review.productName}
                    </p>
                    <div className="mt-1.5">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>

                  {/* Right col */}
                  <div>
                    <p className="text-sm font-bold text-gray-900">{review.title}</p>
                    <p className="text-sm text-gray-500 mt-1 leading-snug">{review.body}</p>
                  </div>

                  {/* Footer spanning both cols */}
                  <div className="sm:col-span-2 flex items-center gap-3 mt-1 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                      </svg>
                      {review.date}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLE[review.status]}`}>
                      {review.status}
                    </span>
                    {review.helpfulCount !== undefined && review.helpfulCount > 0 && (
                      <span className="text-xs text-gray-400">
                        {review.helpfulCount} found helpful
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
