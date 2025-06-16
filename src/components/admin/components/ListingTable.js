// src/components/admin/components/ListingTable.js
/**
 * Komponent tabeli ogłoszeń w panelu administratora
 * Listing table component for admin panel
 */

import React from 'react';
import { FaEye, FaCheck, FaTimes, FaTrash, FaCarAlt } from 'react-icons/fa';

// Komponent renderujący status ogłoszenia
const ListingStatus = ({ status }) => {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aktywne</span>;
    case 'pending':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Oczekujące</span>;
    case 'rejected':
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Odrzucone</span>;
    case 'expired':
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Wygasłe</span>;
    case 'sold':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Sprzedane</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  }
};

const ListingTable = ({ 
  listings, 
  sortField, 
  sortDirection, 
  onSortChange, 
  onPreview, 
  onApprove, 
  onDelete 
}) => {
  // Funkcja do zmiany sortowania
  const handleSort = (field) => {
    if (field === sortField) {
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  // Renderowanie nagłówka kolumny z sortowaniem
  const renderSortableHeader = (field, label) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(field)}
    >
      {label} {sortField === field && (sortDirection === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {renderSortableHeader('title', 'Tytuł')}
            {renderSortableHeader('price', 'Cena')}
            {renderSortableHeader('user', 'Sprzedający')}
            {renderSortableHeader('status', 'Status')}
            {renderSortableHeader('createdAt', 'Data dodania')}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listings.map((listing) => (
            <tr key={listing._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={listing.images[0]}
                        alt={listing.title}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                        <FaCarAlt className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {listing.title}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{listing.price} PLN</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{listing.user?.username || listing.user?.email || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ListingStatus status={listing.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(listing.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    title="Podgląd"
                    onClick={() => onPreview(listing)}
                  >
                    <FaEye />
                  </button>
                  
                  {listing.status === 'pending' && (
                    <button 
                      className="text-green-600 hover:text-green-900"
                      title="Zatwierdź"
                      onClick={() => onApprove(listing._id)}
                    >
                      <FaCheck />
                    </button>
                  )}
                  
                  {listing.status === 'pending' && (
                    <button 
                      className="text-red-600 hover:text-red-900"
                      title="Odrzuć"
                      onClick={() => onPreview(listing)}
                    >
                      <FaTimes />
                    </button>
                  )}
                  
                  <button 
                    className="text-red-600 hover:text-red-900"
                    title="Usuń"
                    onClick={() => onDelete(listing._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListingTable;
