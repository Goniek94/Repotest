import React, { useState } from 'react';
import { X, Clock, Star, CreditCard } from 'lucide-react';

const ExtendListingModal = ({ isOpen, onClose, listing, onExtend }) => {
  const [selectedOption, setSelectedOption] = useState('standard');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const extensionOptions = [
    {
      id: 'standard',
      name: 'Standardowe przedłużenie',
      duration: '30 dni',
      price: 30,
      description: 'Przedłuż ogłoszenie o 30 dni',
      icon: <Clock className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'featured',
      name: 'Wyróżnione przedłużenie',
      duration: '30 dni',
      price: 50,
      description: 'Przedłuż ogłoszenie o 30 dni z wyróżnieniem',
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      featured: true
    }
  ];

  const handleExtend = async () => {
    setLoading(true);
    try {
      await onExtend(listing.id, selectedOption);
    } catch (error) {
      console.error('Error extending listing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Przedłuż ogłoszenie</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Listing info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {listing?.image && (
              <img
                src={listing.image}
                alt={listing.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-medium text-gray-900">{listing?.title}</h3>
              <p className="text-sm text-gray-600">{listing?.price?.toLocaleString('pl-PL')} zł</p>
            </div>
          </div>
        </div>

        {/* Extension options */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Wybierz opcję przedłużenia</h3>
          <div className="space-y-3">
            {extensionOptions.map((option) => (
              <div
                key={option.id}
                className={`relative rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOption === option.id
                    ? 'border-[#35530A] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${option.featured ? 'ring-2 ring-yellow-200' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-shrink-0">
                          {option.icon}
                        </div>
                        <h4 className="text-base font-medium text-gray-900">
                          {option.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                      {option.featured && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Wyróżnione
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-[#35530A]">
                        {option.price.toLocaleString('pl-PL')} zł
                      </div>
                      <div className="text-sm text-gray-600">
                        {option.duration}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedOption === option.id
                          ? 'border-[#35530A] bg-[#35530A]'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={handleExtend}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-[#35530A] rounded-md hover:bg-[#44671A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Przetwarzanie...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Przejdź do płatności</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtendListingModal;
