// src/components/admin/sections/ListingsManagement.js
/**
 * Komponent do zarządzania ogłoszeniami w panelu administratora
 * Component for managing listings in admin panel
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponenty
import ListingPreviewModal from '../components/ListingPreviewModal';
import ListingTable from '../components/ListingTable';
import Pagination from '../components/Pagination';
import SearchFilterBar from '../components/SearchFilterBar';

const ListingsManagement = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');

  // Opcje filtrowania
  const filterOptions = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'active', label: 'Aktywne' },
    { value: 'pending', label: 'Oczekujące' },
    { value: 'rejected', label: 'Odrzucone' },
    { value: 'expired', label: 'Wygasłe' },
    { value: 'sold', label: 'Sprzedane' }
  ];

  // Pobieranie ogłoszeń
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/listings', {
          params: {
            page: currentPage,
            limit: 10,
            sort: sortField,
            direction: sortDirection,
            filter,
            search: searchTerm
          }
        });
        
        setListings(response.data.listings);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Wystąpił błąd podczas pobierania ogłoszeń.');
        setLoading(false);
        console.error('Error fetching listings:', err);
      }
    };

    fetchListings();
  }, [currentPage, sortField, sortDirection, filter, searchTerm]);

  // Obsługa zatwierdzania ogłoszenia
  const handleApproveListing = async (listingId) => {
    try {
      await axios.post(`/api/admin/listings/${listingId}/approve`);
      
      // Aktualizacja listy ogłoszeń
      setListings(listings.map(listing => 
        listing._id === listingId 
          ? { ...listing, status: 'active' } 
          : listing
      ));
    } catch (err) {
      console.error('Error approving listing:', err);
      alert('Wystąpił błąd podczas zatwierdzania ogłoszenia.');
    }
  };

  // Obsługa odrzucania ogłoszenia
  const handleRejectListing = async (listingId, reason) => {
    try {
      await axios.post(`/api/admin/listings/${listingId}/reject`, { reason });
      
      // Aktualizacja listy ogłoszeń
      setListings(listings.map(listing => 
        listing._id === listingId 
          ? { ...listing, status: 'rejected', rejectionReason: reason } 
          : listing
      ));
    } catch (err) {
      console.error('Error rejecting listing:', err);
      alert('Wystąpił błąd podczas odrzucania ogłoszenia.');
    }
  };

  // Obsługa usuwania ogłoszenia
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to ogłoszenie? Ta operacja jest nieodwracalna.')) {
      return;
    }
    
    try {
      await axios.delete(`/api/admin/listings/${listingId}`);
      
      // Aktualizacja listy ogłoszeń
      setListings(listings.filter(listing => listing._id !== listingId));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Wystąpił błąd podczas usuwania ogłoszenia.');
    }
  };

  // Obsługa zmiany sortowania
  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Obsługa podglądu ogłoszenia
  const handlePreviewListing = (listing) => {
    setSelectedListing(listing);
    setIsPreviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Błąd!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchFilterBar
        title="Zarządzanie Ogłoszeniami"
        searchPlaceholder="Szukaj ogłoszeń..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={filterOptions}
      />
      
      <ListingTable
        listings={listings}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onPreview={handlePreviewListing}
        onApprove={handleApproveListing}
        onDelete={handleDeleteListing}
      />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      <ListingPreviewModal
        listing={selectedListing}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onApprove={handleApproveListing}
        onReject={handleRejectListing}
      />
    </div>
  );
};

export default ListingsManagement;
