import React, { useState, useEffect } from 'react';
import { Plus, Download, Search, Filter } from 'lucide-react';
import ListingsTable from './ListingsTable';
import ListingsModal from './ListingsModal';
import ListingsFilters from './ListingsFilters';
import ListingsStats from './ListingsStats';
import AdminButton from '../../components/UI/AdminButton';
import AdminInput from '../../components/Forms/AdminInput';
import useAdminApi from '../../hooks/useAdminApi';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  });
  const [selectedListings, setSelectedListings] = useState([]);

  const { get, post, put, del } = useAdminApi();
  const { showSuccess, showError } = useAdminNotifications();

  useEffect(() => {
    fetchListings();
  }, [pagination.currentPage, pagination.pageSize, filters, searchTerm]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: searchTerm,
        ...filters
      };

      const response = await get('/listings', params);
      if (response.success) {
        setListings(response.data.listings);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.total,
          totalPages: response.data.totalPages
        }));
      }
    } catch (err) {
      showError('Nie udało się załadować ogłoszeń');
    } finally {
      setLoading(false);
    }
  };

  const handleListingAction = async (listingId, action) => {
    try {
      const response = await post(`/listings/${listingId}/${action}`);
      if (response.success) {
        showSuccess(`Ogłoszenie zostało ${action === 'approve' ? 'zatwierdzone' : action === 'reject' ? 'odrzucone' : 'zaktualizowane'}`);
        fetchListings();
      }
    } catch (err) {
      showError('Nie udało się wykonać akcji');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedListings.length === 0) return;
    
    try {
      const response = await post('/listings/bulk-action', {
        listingIds: selectedListings,
        action: action
      });
      
      if (response.success) {
        showSuccess(`Akcja została wykonana na ${selectedListings.length} ogłoszeniach`);
        setSelectedListings([]);
        fetchListings();
      }
    } catch (err) {
      showError('Nie udało się wykonać akcji zbiorczej');
    }
  };

  const handleModalSave = async (listingData) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await post('/listings', listingData);
      } else if (modalMode === 'edit') {
        response = await put(`/listings/${selectedListing.id}`, listingData);
      }
      
      if (response.success) {
        showSuccess(modalMode === 'create' ? 'Ogłoszenie utworzone' : 'Ogłoszenie zaktualizowane');
        setShowModal(false);
        fetchListings();
      }
    } catch (err) {
      showError('Nie udało się zapisać ogłoszenia');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zarządzanie ogłoszeniami</h1>
          <p className="text-gray-600">Przeglądaj i moderuj ogłoszenia</p>
        </div>
        <div className="flex items-center space-x-3">
          <AdminButton variant="secondary" icon={Download}>
            Eksportuj
          </AdminButton>
          <AdminButton 
            variant="primary" 
            icon={Plus}
            onClick={() => {
              setSelectedListing(null);
              setModalMode('create');
              setShowModal(true);
            }}
          >
            Dodaj ogłoszenie
          </AdminButton>
        </div>
      </div>

      {/* Stats */}
      <ListingsStats loading={loading} />

      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <AdminInput
              placeholder="Szukaj ogłoszeń..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center space-x-3">
            {selectedListings.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Wybrano: {selectedListings.length}</span>
                <AdminButton variant="success" size="small" onClick={() => handleBulkAction('approve')}>
                  Zatwierdź
                </AdminButton>
                <AdminButton variant="danger" size="small" onClick={() => handleBulkAction('reject')}>
                  Odrzuć
                </AdminButton>
              </div>
            )}
            
            <AdminButton
              variant="secondary"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtry
            </AdminButton>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ListingsFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}
      </div>

      {/* Listings table */}
      <ListingsTable
        listings={listings}
        loading={loading}
        selectedListings={selectedListings}
        onSelectListing={(id) => {
          setSelectedListings(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
          );
        }}
        onSelectAll={() => {
          setSelectedListings(selectedListings.length === listings.length ? [] : listings.map(l => l.id));
        }}
        onViewListing={(listing) => {
          setSelectedListing(listing);
          setModalMode('view');
          setShowModal(true);
        }}
        onEditListing={(listing) => {
          setSelectedListing(listing);
          setModalMode('edit');
          setShowModal(true);
        }}
        onListingAction={handleListingAction}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
        onPageSizeChange={(size) => setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }))}
      />

      {/* Modal */}
      {showModal && (
        <ListingsModal
          isOpen={showModal}
          mode={modalMode}
          listing={selectedListing}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default AdminListings;
