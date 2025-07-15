import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AdminPagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange = null,
  showQuickJumper = true,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange = null,
  className = ''
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current
      if (currentPage <= 4) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show last 5 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between px-6 py-4 border-t border-gray-200 ${className}`}>
      {/* Results info */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">
          Wyświetlono {startItem} - {endItem} z {totalItems} wyników
        </span>
        
        {/* Page size selector */}
        {showSizeChanger && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Pokaż:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">na stronę</span>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* First page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Pierwsza strona"
        >
          <ChevronsLeft size={16} />
        </button>
        
        {/* Previous page */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Poprzednia strona"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {generatePageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={page === '...'}
              className={`
                px-3 py-1 text-sm border rounded
                ${page === currentPage
                  ? 'text-white border-green-600'
                  : page === '...'
                  ? 'text-gray-400 cursor-default border-transparent'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }
              `}
              style={page === currentPage ? { backgroundColor: '#35530A' } : {}}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Następna strona"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Ostatnia strona"
        >
          <ChevronsRight size={16} />
        </button>

        {/* Quick jumper */}
        {showQuickJumper && (
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-gray-700">Idź do:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              className="w-16 text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                    e.target.value = '';
                  }
                }
              }}
              placeholder={currentPage.toString()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPagination;