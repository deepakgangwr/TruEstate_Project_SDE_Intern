import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  // --- Generate Visible Page Numbers (Clean Version) ---
  const getVisiblePages = () => {
    const maxVisible = 6;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();


  /* ------------------------------
        Reusable Page Button
  ------------------------------ */
  const PageButton = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-md 
      text-sm font-medium transition-all duration-200
      ${
        active
          ? "bg-gray-900 text-white shadow-md scale-105"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm"
      }`}
    >
      {children}
    </button>
  );

  /* ------------------------------
        Reusable Arrow Button
  ------------------------------ */
  const ArrowButton = ({ disabled, onClick, children }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      className="
        p-1.5 rounded-md 
        text-gray-400 
        hover:text-gray-900 hover:bg-gray-100 
        disabled:opacity-40 disabled:cursor-not-allowed 
        transition-all
      "
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-2 py-6 bg-white border-t border-gray-200">
      
      {/* Previous */}
      <ArrowButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={20} />
      </ArrowButton>

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <PageButton
          key={page}
          active={currentPage === page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      {/* Next */}
      <ArrowButton
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={20} />
      </ArrowButton>
    </div>
  );
};

export default Pagination;
