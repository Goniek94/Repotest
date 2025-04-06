// src/components/listings/ListingPreview.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import AdsService from '../../services/ads';

const ListingPreview = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listingData } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicationStatus, setPublicationStatus] = useState({
    error: null,
    success: false
  });

  const handlePublish = async () => {
    if (!listingData || isSubmitting) return;

    setIsSubmitting(true);
    setPublicationStatus({ error: null, success: false });

    try {
      const response = await AdsService.create(listingData);
      
      if (response.success) {
        setPublicationStatus({ success: true, error: null });
        setTimeout(() => navigate('/listings'), 2000);
      } else {
        throw new Error(response.message || 'Błąd publikacji');
      }
    } catch (error) {
      setPublicationStatus({
        error: error.message || 'Wystąpił błąd podczas publikacji',
        success: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listingData) {
    navigate('/createlisting');
    return null;
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          Podgląd Ogłoszenia
        </h2>

        {/* Sekcja z danymi ogłoszenia */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-4">{listingData.title}</h3>
          <p className="text-gray-700 mb-4">{listingData.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md">
              <p className="font-semibold">Cena:</p>
              <p className="text-xl text-green-700">
                {listingData.price?.toLocaleString('pl-PL')} zł
              </p>
            </div>
            <div className="bg-white p-4 rounded-md">
              <p className="font-semibold">Przebieg:</p>
              <p>{listingData.mileage?.toLocaleString('pl-PL')} km</p>
            </div>
          </div>
        </div>

        {/* Komunikaty statusu */}
        {publicationStatus.error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {publicationStatus.error}
          </div>
        )}
        {publicationStatus.success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            Ogłoszenie opublikowane! Przekierowujemy...
          </div>
        )}

        {/* Przyciski sterujące */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg
                     hover:bg-gray-700 transition-all duration-200 shadow-lg
                     flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            Wróć do edycji
          </button>
          
          <button
            onClick={handlePublish}
            className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg
                     hover:bg-green-700 transition-all duration-200 shadow-lg
                     flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publikowanie...' : 'Opublikuj Ogłoszenie'}
          </button>
        </div>
      </div>
    </div>
  );
});

ListingPreview.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      listingData: PropTypes.object.isRequired
    })
  })
};

export default ListingPreview;