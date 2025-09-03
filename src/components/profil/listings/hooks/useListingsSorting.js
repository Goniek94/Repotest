import { useState } from 'react';
import { sortListings as sortListingsUtil } from '../utils/sortingUtils';

/**
 * Custom hook for managing listings sorting functionality
 * Handles sort field, order, and sorting logic for different data types
 */
const useListingsSorting = (initialSortBy = 'createdAt', initialSortOrder = 'desc') => {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // Sort listings using utility function
  const sortListings = (listings) => {
    return sortListingsUtil(listings, sortBy, sortOrder);
  };

  // Handle sort change
  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Toggle sort order for current field
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Reset to default sorting
  const resetSorting = () => {
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
  };

  return {
    // State
    sortBy,
    sortOrder,
    
    // Actions
    sortListings,
    handleSortChange,
    toggleSortOrder,
    resetSorting,
    
    // Setters
    setSortBy,
    setSortOrder
  };
};

export default useListingsSorting;
