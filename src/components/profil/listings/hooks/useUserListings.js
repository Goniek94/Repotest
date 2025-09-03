import { useState, useMemo } from 'react';
import useListingsData from './useListingsData';
import useListingsSorting from './useListingsSorting';
import useLocalDrafts from './useLocalDrafts';
import useListingsActions from './useListingsActions';

/**
 * Main orchestrator hook for UserListings component
 * Combines all sub-hooks and provides unified interface
 */
const useUserListings = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Initialize data management hook
  const {
    allListings,
    notifications,
    loading,
    error,
    fetchListings,
    updateListing,
    removeListing,
    removeNotification,
    getFilteredListings,
    calculateDaysRemaining
  } = useListingsData();

  // Initialize sorting hook
  const {
    sortBy,
    sortOrder,
    sortListings,
    handleSortChange
  } = useListingsSorting();

  // Initialize local drafts hook
  const {
    localDrafts,
    deleteLocalDraft,
    continueLocalDraft,
    refreshDrafts
  } = useLocalDrafts();

  // Initialize actions hook
  const {
    extendingId,
    selectedListing,
    extendModalOpen,
    toggleFavorite,
    handleExtend,
    handleExtendFromModal,
    handleDelete,
    handleEnd,
    handleEdit,
    handleNavigate,
    closeExtendModal
  } = useListingsActions({
    updateListing,
    removeListing,
    removeNotification
  });

  // Get filtered and sorted listings with memoization for reactivity
  const listings = useMemo(() => {
    console.log('🔄 PRZELICZANIE LISTY:', { activeTab, sortBy, sortOrder });
    const filtered = getFilteredListings(activeTab);
    console.log('📋 PRZEFILTROWANE:', filtered.length, 'ogłoszeń');
    const sorted = sortListings(filtered);
    console.log('✅ POSORTOWANE:', sorted.length, 'ogłoszeń');
    return sorted;
  }, [activeTab, sortBy, sortOrder, allListings, getFilteredListings, sortListings]);

  // Handle tab change with drafts refresh
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'drafts') {
      refreshDrafts();
    }
  };

  // Enhanced extend handler that passes allListings
  const handleExtendWithData = (id) => {
    handleExtend(id, allListings);
  };

  // Enhanced favorite handler that passes allListings
  const handleToggleFavorite = (id) => {
    toggleFavorite(id, allListings);
  };

  return {
    // State
    activeTab,
    allListings,
    notifications,
    loading,
    error,
    localDrafts,
    sortBy,
    sortOrder,
    extendingId,
    selectedListing,
    extendModalOpen,

    // Processed data
    listings,

    // Tab management
    setActiveTab: handleTabChange,

    // Data actions
    fetchListings,
    calculateDaysRemaining,

    // Sorting actions
    handleSortChange,

    // Draft actions
    deleteLocalDraft,
    continueLocalDraft,

    // Listing actions
    toggleFavorite: handleToggleFavorite,
    handleExtend: handleExtendWithData,
    handleExtendFromModal,
    handleDelete,
    handleEnd,
    handleEdit,
    handleNavigate,
    closeExtendModal
  };
};

export default useUserListings;
