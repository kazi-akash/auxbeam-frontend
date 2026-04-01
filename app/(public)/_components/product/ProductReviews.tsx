'use client';

import { Star } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  text: string;
  reviewerName: string;
  reviewDate: string;
}

interface ProductReviewsProps {
  reviews?: Review[];
  totalReviews?: number;
  averageRating?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onWriteReview?: () => void;
}

export default function ProductReviews({
  reviews = [],
  totalReviews = 132,
  averageRating = 5,
  currentPage = 1,
  totalPages = 5,
  onPageChange = () => {},
  onWriteReview = () => {},
}: ProductReviewsProps) {
  // Default reviews if none provided
  const defaultReviews: Review[] = [
    {
      id: 1,
      rating: 5,
      text: "I recently installed the Auxbeam LED headlight bulbs on my Toyota Land Cruiser, and the difference is incredible. The brightness is much stronger than my previous halogen lights, but it doesn't create glare for oncoming traffic. Night driving on highways now feels much safer and more comfortable.",
      reviewerName: "Ahmed R.",
      reviewDate: "24 Nov 2025",
    },
    {
      id: 2,
      rating: 5,
      text: "I recently installed the Auxbeam LED headlight bulbs on my Toyota Land Cruiser, and the difference is incredible. The brightness is much stronger than my previous halogen lights, but it doesn't create glare for oncoming traffic. Night driving on highways now feels much safer and more comfortable.",
      reviewerName: "Ahmed R.",
      reviewDate: "24 Nov 2025",
    },
    {
      id: 3,
      rating: 5,
      text: "I recently installed the Auxbeam LED headlight bulbs on my Toyota Land Cruiser, and the difference is incredible. The brightness is much stronger than my previous halogen lights, but it doesn't create glare for oncoming traffic. Night driving on highways now feels much safer and more comfortable.",
      reviewerName: "Ahmed R.",
      reviewDate: "24 Nov 2025",
    },
    {
      id: 4,
      rating: 5,
      text: "I recently installed the Auxbeam LED headlight bulbs on my Toyota Land Cruiser, and the difference is incredible. The brightness is much stronger than my previous halogen lights, but it doesn't create glare for oncoming traffic. Night driving on highways now feels much safer and more comfortable.",
      reviewerName: "Ahmed R.",
      reviewDate: "24 Nov 2025",
    },
    {
      id: 5,
      rating: 5,
      text: "I recently installed the Auxbeam LED headlight bulbs on my Toyota Land Cruiser, and the difference is incredible. The brightness is much stronger than my previous halogen lights, but it doesn't create glare for oncoming traffic. Night driving on highways now feels much safer and more comfortable.",
      reviewerName: "Ahmed R.",
      reviewDate: "24 Nov 2025",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-[#F59E0B] text-[#F59E0B]'
                : 'fill-none text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    const pages = [];
    
    // Back button
    pages.push(
      <button
        key="back"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Back
      </button>
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-9 h-9 text-sm font-medium rounded transition-colors ${
            currentPage === i
              ? 'bg-[#FDE047] text-gray-900'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    );

    return pages;
  };

  return (
    <div className="bg-white font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reviews ({totalReviews})
          </h2>
          <p className="text-sm text-gray-600">
            Get specific details about this product from customers who own it.
          </p>
        </div>
        <button
          onClick={onWriteReview}
          className="bg-[#FDE047] hover:bg-[#FCD34D] text-gray-900 text-sm font-medium px-6 py-3 rounded transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Average Rating */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
        {renderStars(averageRating)}
        <span className="text-sm font-semibold text-gray-900">
          {averageRating} out of 5
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayReviews.map((review, index) => (
          <div
            key={review.id}
            className={`${
              index !== displayReviews.length - 1 ? 'pb-6 border-b border-gray-100' : ''
            }`}
          >
            {/* Star Rating */}
            <div className="mb-3">{renderStars(review.rating)}</div>

            {/* Review Text */}
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {review.text}
            </p>

            {/* Reviewer Info */}
            <p className="text-xs text-gray-600">
              Reviewed by{' '}
              <span className="font-semibold text-gray-900">
                {review.reviewerName}
              </span>{' '}
              on {review.reviewDate}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
        {renderPagination()}
      </div>
    </div>
  );
}
