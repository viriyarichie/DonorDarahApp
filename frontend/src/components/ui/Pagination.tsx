import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, lastPage, onPageChange }: PaginationProps) => {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
    const start = Math.max(1, currentPage - 2);
    return Math.min(start + i, lastPage);
  }).filter((p, i, arr) => arr.indexOf(p) === i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-red-600 text-white'
              : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
