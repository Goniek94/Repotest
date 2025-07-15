import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, MoreVertical } from 'lucide-react';

const AdminTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  sortable = true,
  searchable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  onRowClick = null,
  onSort = null,
  onSearch = null,
  onFilter = null,
  className = '',
  emptyMessage = 'Brak danych do wyświetlenia'
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);

  // Update filtered data when data or search term changes
  useEffect(() => {
    let filtered = data;

    if (searchTerm && searchable) {
      filtered = data.filter(row =>
        columns.some(column => {
          const value = row[column.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, sortConfig, columns, searchable]);

  // Handle sorting
  const handleSort = (columnKey) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const newSortConfig = { key: columnKey, direction };
    setSortConfig(newSortConfig);

    if (onSort) {
      onSort(newSortConfig);
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  // Render cell content
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key];
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (!sortable) return null;

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' 
        ? <ChevronUp size={16} className="text-gray-600" />
        : <ChevronDown size={16} className="text-gray-600" />;
    }
    return <ChevronUp size={16} className="text-gray-300" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
        <div className="p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Błąd ładowania danych</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Search and filters */}
      {(searchable || filterable) && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {searchable && (
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            )}
            {filterable && (
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} className="text-gray-600" />
                <span>Filtry</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index}
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Wyświetlono {startIndex + 1} - {Math.min(endIndex, filteredData.length)} z {filteredData.length} wyników
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Poprzednia
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`
                    px-3 py-1 text-sm border rounded
                    ${currentPage === i + 1 
                      ? 'bg-green-600 text-white border-green-600' 
                      : 'border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Następna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;