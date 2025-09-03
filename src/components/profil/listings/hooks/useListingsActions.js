import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingsService from '../../../../services/api/listingsApi';

/**
 * Custom hook for managing listings CRUD actions
 * Handles extend, delete, end, edit, favorite operations
 */
const useListingsActions = ({ updateListing, removeListing, removeNotification }) => {
  const [extendingId, setExtendingId] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle favorite status
  const toggleFavorite = (id, allListings) => {
    const listing = allListings.find(l => l._id === id);
    if (listing) {
      updateListing(id, { isFavorite: !listing.isFavorite });
    }
  };

  // Prepare listing for extension modal
  const handleExtend = (id, allListings) => {
    const listing = allListings.find(l => l._id === id);
    if (listing) {
      setSelectedListing({
        id: listing._id,
        title: `${listing.brand || ''} ${listing.model || ''}`.trim() || 'Ogłoszenie',
        price: listing.price || 0,
        image: listing.images && listing.images.length > 0 
          ? listing.images[listing.mainImageIndex || 0] 
          : listing.image || '/images/auto-788747_1280.jpg'
      });
      setExtendModalOpen(true);
    }
  };

  // Handle extension from modal
  const handleExtendFromModal = async (listingId, extensionType) => {
    try {
      setExtendingId(listingId);
      
      const response = await ListingsService.extendListing(listingId, extensionType);
      
      // Update listing in state
      updateListing(listingId, {
        createdAt: new Date().toISOString(),
        listingType: extensionType === 'featured' ? 'wyróżnione' : undefined
      });
      
      // Remove from notifications
      removeNotification(listingId);
      
      // Close modal
      setExtendModalOpen(false);
      setSelectedListing(null);
      
      toast.success(`Ogłoszenie zostało przedłużone${extensionType === 'featured' ? ' z wyróżnieniem' : ''}!`);
      toast.info('Przekierowywanie do płatności...');
      
    } catch (err) {
      console.error('Error extending listing:', err);
      toast.error('Błąd podczas przedłużania ogłoszenia.');
    } finally {
      setExtendingId(null);
    }
  };

  // Delete listing permanently
  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna!')) {
      try {
        await ListingsService.delete(id, true);
        removeListing(id);
        toast.success('Ogłoszenie zostało trwale usunięte.');
      } catch (err) {
        console.error('Error deleting listing:', err);
        toast.error('Błąd podczas usuwania ogłoszenia.');
      }
    }
  };

  // End listing (archive)
  const handleEnd = async (id) => {
    if (window.confirm('Czy na pewno chcesz zakończyć to ogłoszenie? Zostanie ono przeniesione do archiwalnych. Możesz je przywrócić w ciągu 30 dni za opłatą.')) {
      try {
        await ListingsService.finishListing(id);
        updateListing(id, { status: 'archived' });
        toast.success('Ogłoszenie zostało zakończone i przeniesione do archiwalnych. Możesz je przywrócić w ciągu 30 dni za opłatą.');
      } catch (err) {
        console.error('Error ending listing:', err);
        toast.error('Błąd podczas kończenia ogłoszenia.');
      }
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/profil/edytuj-ogloszenie/${id}`);
  };
  
  // Navigate to listing details
  const handleNavigate = (id) => {
    navigate(`/listing/${id}`);
  };

  // Close extend modal
  const closeExtendModal = () => {
    setExtendModalOpen(false);
    setSelectedListing(null);
  };

  return {
    // State
    extendingId,
    selectedListing,
    extendModalOpen,
    
    // Actions
    toggleFavorite,
    handleExtend,
    handleExtendFromModal,
    handleDelete,
    handleEnd,
    handleEdit,
    handleNavigate,
    closeExtendModal,
    
    // Setters
    setExtendingId,
    setSelectedListing,
    setExtendModalOpen
  };
};

export default useListingsActions;
