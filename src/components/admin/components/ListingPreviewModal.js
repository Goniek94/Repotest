// src/components/admin/components/ListingPreviewModal.js
/**
 * Komponent modalny do podglądu ogłoszenia w panelu administratora
 * Modal component for listing preview in admin panel
 */

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ListingPreviewModal = ({ listing, isOpen, onClose, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!isOpen || !listing) return null;

  const handleReject = () => {
    onReject(listing._id, rejectReason);
    setRejectReason('');
    setShowRejectForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">
            Podgląd ogłoszenia
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zdjęcia */}
          <div>
            {listing.images && listing.images.length > 0 ? (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-64 object-cover"
                />
                {listing.images.length > 1 && (
                  <div className="flex overflow-x-auto p-2 space-x-2">
                    {listing.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${listing.title} - zdjęcie ${index + 2}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500">Brak zdjęć</p>
              </div>
            )}
          </div>

          {/* Informacje o ogłoszeniu */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800">{listing.title}</h3>
              <p className="text-xl font-bold text-blue-600">{listing.price} PLN</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Marka:</span>
                <span className="ml-2 font-medium">{listing.brand}</span>
              </div>
              <div>
                <span className="text-gray-500">Model:</span>
                <span className="ml-2 font-medium">{listing.model}</span>
              </div>
              <div>
                <span className="text-gray-500">Rok produkcji:</span>
                <span className="ml-2 font-medium">{listing.year}</span>
              </div>
              <div>
                <span className="text-gray-500">Przebieg:</span>
                <span className="ml-2 font-medium">{listing.mileage} km</span>
              </div>
              <div>
                <span className="text-gray-500">Paliwo:</span>
                <span className="ml-2 font-medium">{listing.fuelType}</span>
              </div>
              <div>
                <span className="text-gray-500">Moc:</span>
                <span className="ml-2 font-medium">{listing.power} KM</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Opis</h4>
              <p className="text-sm text-gray-600">{listing.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Sprzedający</h4>
              <p className="text-sm">
                <span className="text-gray-500">Użytkownik:</span>
                <span className="ml-2 font-medium">{listing.user?.username || listing.user?.email || 'Nieznany'}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Lokalizacja:</span>
                <span className="ml-2 font-medium">{listing.location?.city || 'Nieznana'}</span>
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Status</h4>
              <p className="text-sm">
                <span className="text-gray-500">Data dodania:</span>
                <span className="ml-2 font-medium">{new Date(listing.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 font-medium">
                  {listing.status === 'pending' && 'Oczekujące'}
                  {listing.status === 'active' && 'Aktywne'}
                  {listing.status === 'rejected' && 'Odrzucone'}
                  {listing.status === 'expired' && 'Wygasłe'}
                  {listing.status === 'sold' && 'Sprzedane'}
                </span>
              </p>
              {listing.status === 'rejected' && listing.rejectionReason && (
                <p className="text-sm">
                  <span className="text-gray-500">Powód odrzucenia:</span>
                  <span className="ml-2 font-medium text-red-600">{listing.rejectionReason}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Przyciski akcji */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Zamknij
          </button>

          {listing.status === 'pending' && (
            <>
              {!showRejectForm ? (
                <>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => setShowRejectForm(true)}
                  >
                    Odrzuć
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={() => {
                      onApprove(listing._id);
                      onClose();
                    }}
                  >
                    Zatwierdź
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Podaj powód odrzucenia..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                  >
                    Odrzuć
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => setShowRejectForm(false)}
                  >
                    Anuluj
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPreviewModal;
