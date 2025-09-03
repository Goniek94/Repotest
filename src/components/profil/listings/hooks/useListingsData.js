import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ListingsService from '../../../../services/api/listingsApi';

/**
 * Custom hook for managing listings data and API operations
 * Handles fetching, loading states, error handling, and notifications processing
 */
const useListingsData = () => {
  const [allListings, setAllListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate days remaining until expiry
  const calculateDaysRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Process listings data to ensure consistency
  const processListingsData = (ads) => {
    if (!ads || !Array.isArray(ads)) {
      throw new Error('Otrzymano nieprawidłowe dane ogłoszeń. Spróbuj odświeżyć stronę.');
    }
    
    return ads.map(ad => {
      // Ensure images array exists
      if (!ad.images || !Array.isArray(ad.images)) {
        ad.images = [];
      }
      
      // Validate main image index
      if (typeof ad.mainImageIndex !== 'number' || ad.mainImageIndex < 0 || ad.mainImageIndex >= ad.images.length) {
        ad.mainImageIndex = 0;
      }
      
      return ad;
    });
  };

  // Generate notifications for expiring ads
  const generateNotifications = (listings) => {
    return listings.filter(ad => {
      if (!ad.expiresAt || ad.status !== 'active') return false;
      const days = calculateDaysRemaining(ad.expiresAt);
      return days > 0 && days <= 3;
    });
  };

  // Fetch listings from API
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ads = await ListingsService.getUserListings();
      const processedAds = processListingsData(ads);
      
      setAllListings(processedAds);
      setNotifications(generateNotifications(processedAds));
      setLoading(false);
    } catch (err) {
      console.error('Błąd podczas pobierania ogłoszeń:', err);
      setError(err.message || 'Błąd podczas pobierania ogłoszeń użytkownika. Spróbuj odświeżyć stronę.');
      setLoading(false);
    }
  };

  // Update single listing in state
  const updateListing = (listingId, updates) => {
    setAllListings(prev =>
      prev.map(listing =>
        listing._id === listingId ? { ...listing, ...updates } : listing
      )
    );
  };

  // Remove listing from state
  const removeListing = (listingId) => {
    setAllListings(prev => prev.filter(listing => listing._id !== listingId));
  };

  // Remove notification
  const removeNotification = (listingId) => {
    setNotifications(prev => prev.filter(ad => ad._id !== listingId));
  };

  // Filter listings by tab
  const getFilteredListings = (activeTab) => {
    switch(activeTab) {
      case 'active':
        return allListings.filter(listing => listing.status === 'active');
      case 'drafts':
        return allListings.filter(listing => 
          listing.status === 'pending' || listing.status === 'needs_changes' || listing.isVersionRobocza
        );
      case 'completed':
        return allListings.filter(listing => listing.status === 'archived' || listing.status === 'sold');
      case 'favorites':
        return allListings.filter(listing => listing.isFavorite);
      default:
        return allListings;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchListings();
  }, []);

  return {
    // State
    allListings,
    notifications,
    loading,
    error,
    
    // Actions
    fetchListings,
    updateListing,
    removeListing,
    removeNotification,
    getFilteredListings,
    calculateDaysRemaining,
    
    // Setters for direct state manipulation if needed
    setAllListings,
    setNotifications
  };
};

export default useListingsData;
