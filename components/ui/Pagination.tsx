import { getPaginationRange } from '@/lib/utils/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex justify-end items-center gap-2 mt-12">
      {/* Back Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-[15px] font-medium text-gray-700 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[44px] h-[44px] flex items-center justify-center rounded-[2px] text-[15px] font-medium transition-colors ${
              page === currentPage
                ? 'bg-[#FCE32D] text-gray-900 hover:bg-[#e6cc28]'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-[15px] font-medium text-gray-700 transition-colors"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
