import React, { memo } from 'react';
import useResponsiveLayout from '../../../hooks/useResponsiveLayout';
import useUserListings from './hooks/useUserListings';
import ExtendListingModal from '../../common/ExtendListingModal';

// Import wszystkich komponentów
import ListingsHeader from './components/ListingsHeader';
import MobileTabsNavigation from './components/MobileTabsNavigation';
import DesktopSidebar from './components/DesktopSidebar';
import NotificationsPanel from './components/NotificationsPanel';
import DraftsList from './components/DraftsList';
import ListingsGrid from './components/ListingsGrid';
import MobileFooter from './components/MobileFooter';
import SortingControls from './components/SortingControls';

/**
 * Main UserListings component - serves as orchestrator
 * Uses custom hooks for business logic and state management
 */
const UserListings = memo(() => {
  const { isMobile } = useResponsiveLayout();
  
  // Main hook that orchestrates all business logic
  const {
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
    
    // Actions
    setActiveTab,
    fetchListings,
    calculateDaysRemaining,
    handleSortChange,
    deleteLocalDraft,
    continueLocalDraft,
    toggleFavorite,
    handleExtend,
    handleExtendFromModal,
    handleDelete,
    handleEnd,
    handleEdit,
    handleNavigate,
    closeExtendModal
  } = useUserListings();

  return (
    <div className="bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-0 sm:px-1 lg:px-2 py-0 sm:py-1 lg:py-1">
        {/* Nagłówek */}
        <ListingsHeader />

        {/* Mobile Layout - nawigacja */}
        {isMobile && (
          <MobileTabsNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allListings={allListings}
            localDrafts={localDrafts}
          />
        )}

        {/* Główny kontainer */}
        <div className="
          flex flex-col lg:flex-row
          min-h-[400px] sm:min-h-[450px] lg:h-[calc(100vh-150px)] max-h-[700px]
          bg-white rounded-b-2xl border border-gray-200 border-t-0 overflow-hidden
        " style={{
          boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Lewy panel - kategorie */}
          <DesktopSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allListings={allListings}
            localDrafts={localDrafts}
          />

          {/* Prawy panel - zawartość */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Sekcja powiadomień */}
            <NotificationsPanel 
              notifications={notifications}
              onExtend={handleExtend}
              extendingId={extendingId}
              calculateDaysRemaining={calculateDaysRemaining}
            />

            {/* Wersje robocze z localStorage - tylko w zakładce drafts */}
            {activeTab === 'drafts' && (
              <>
                <DraftsList 
                  localDrafts={localDrafts}
                  onContinueDraft={continueLocalDraft}
                  onDeleteDraft={deleteLocalDraft}
                />
                
                {/* Separator jeśli są też ogłoszenia z bazy danych */}
                {listings.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Ogłoszenia w trakcie weryfikacji
                    </h3>
                  </div>
                )}
              </>
            )}

            {/* Kontrolki sortowania - tylko gdy są ogłoszenia i nie na mobilnych */}
            {!loading && !error && listings.length > 0 && !isMobile && (
              <SortingControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                listingsCount={listings.length}
              />
            )}

            {/* Lista ogłoszeń */}
            <ListingsGrid 
              listings={listings}
              loading={loading}
              error={error}
              activeTab={activeTab}
              onNavigate={handleNavigate}
              onEdit={handleEdit}
              onEnd={handleEnd}
              onDelete={handleDelete}
              onExtend={handleExtend}
              onFavorite={toggleFavorite}
              onRefresh={fetchListings}
            />
          </div>
        </div>

        {/* Footer mobilny */}
        {isMobile && (
          <MobileFooter 
            allListings={allListings}
            activeTab={activeTab}
          />
        )}
      </div>

      {/* Modal przedłużania ogłoszenia */}
      <ExtendListingModal
        isOpen={extendModalOpen}
        onClose={closeExtendModal}
        listing={selectedListing}
        onExtend={handleExtendFromModal}
        isLoading={!!extendingId}
      />
    </div>
  );
});

UserListings.displayName = 'UserListings';

export default UserListings;
