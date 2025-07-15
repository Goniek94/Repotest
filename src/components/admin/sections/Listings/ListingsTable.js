import React, { useState } from 'react';
import { Eye, Edit, CheckCircle, XCircle, Star, Gift, MoreVertical } from 'lucide-react';
import AdminTable from '../../components/UI/AdminTable';
import AdminButton from '../../components/UI/AdminButton';
import AdminPagination from '../../components/UI/AdminPagination';
import { formatDate, formatCurrency } from '../../components/utils/adminHelpers';

const ListingsTable = ({
  listings = [],
  loading = false,
  selectedListings = [],
  onSelectListing = null,
  onSelectAll = null,
  onViewListing = null,
  onEditListing = null,
  onListingAction = null,
  pagination = {},
  onPageChange = null,
  onPageSizeChange = null
}) => {
  const [actionLoading, setActionLoading] = useState({});

  const handleAction = async (listingId, action) => {
    setActionLoading(prev => ({ ...prev, [listingId]: action }));
    try {
      await onListingAction(listingId, action);
    } finally {
      setActionLoading(prev => ({ ...prev, [listingId]: null }));
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { icon: XCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Oczekuje' },
      active: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Aktywne' },
      rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Odrzucone' },
      expired: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Wygasłe' },
      featured: { icon: Star, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Wyróżnione' }
    };

    const { icon: Icon, color, bg, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${color}`}>
        <Icon size={12} className="mr-1" />
        {label}
      </span>
    );
  };

  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedListings.length === listings.length && listings.length > 0}
          onChange={onSelectAll}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      ),
      render: (_, listing) => (
        <input
          type="checkbox"
          checked={selectedListings.includes(listing.id)}
          onChange={() => onSelectListing(listing.id)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      ),
      width: '50px',
      sortable: false
    },
    {
      key: 'image',
      title: '',
      render: (_, listing) => (
        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
          {listing.images?.[0] ? (
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Brak
            </div>
          )}
        </div>
      ),
      width: '80px',
      sortable: false
    },
    {
      key: 'title',
      title: 'Ogłoszenie',
      render: (_, listing) => (
        <div>
          <div className="font-medium text-gray-900">{listing.title}</div>
          <div className="text-sm text-gray-500">ID: {listing.id}</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'user',
      title: 'Użytkownik',
      render: (user) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{user?.name}</div>
          <div className="text-gray-500">{user?.email}</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'price',
      title: 'Cena',
      render: (price) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(price)}
        </span>
      ),
      sortable: true
    },
    {
      key: 'category',
      title: 'Kategoria',
      render: (category) => (
        <span className="text-sm text-gray-600">{category}</span>
      ),
      sortable: true
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => getStatusBadge(status),
      sortable: true
    },
    {
      key: 'created_at',
      title: 'Data utworzenia',
      render: (date) => (
        <div className="text-sm text-gray-600">
          {formatDate(date, 'date')}
        </div>
      ),
      sortable: true
    },
    {
      key: 'actions',
      title: 'Akcje',
      render: (_, listing) => (
        <ListingActions
          listing={listing}
          loading={actionLoading[listing.id]}
          onView={() => onViewListing(listing)}
          onEdit={() => onEditListing(listing)}
          onAction={(action) => handleAction(listing.id, action)}
        />
      ),
      width: '120px',
      sortable: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <AdminTable
        columns={columns}
        data={listings}
        loading={loading}
        emptyMessage="Brak ogłoszeń do wyświetlenia"
        sortable={true}
        searchable={false}
        pagination={false}
      />
      
      {pagination.totalPages > 1 && (
        <AdminPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

const ListingActions = ({ listing, loading, onView, onEdit, onAction }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getActions = () => {
    const actions = [];
    
    if (listing.status === 'pending') {
      actions.push(
        { label: 'Zatwierdź', action: 'approve', icon: CheckCircle, color: 'text-green-600' },
        { label: 'Odrzuć', action: 'reject', icon: XCircle, color: 'text-red-600' }
      );
    }
    
    if (listing.status === 'active') {
      actions.push(
        { label: 'Wyróżnij', action: 'feature', icon: Star, color: 'text-purple-600' },
        { label: 'Promuj', action: 'promote', icon: Gift, color: 'text-blue-600' }
      );
    }

    return actions;
  };

  return (
    <div className="flex items-center space-x-2">
      <AdminButton variant="secondary" size="small" icon={Eye} onClick={onView} />
      <AdminButton variant="secondary" size="small" icon={Edit} onClick={onEdit} />
      
      {getActions().length > 0 && (
        <div className="relative">
          <AdminButton
            variant="secondary"
            size="small"
            icon={MoreVertical}
            onClick={() => setShowDropdown(!showDropdown)}
          />

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                {getActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onAction(action.action);
                      setShowDropdown(false);
                    }}
                    disabled={loading === action.action}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${action.color}`}
                  >
                    <action.icon size={16} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingsTable;
