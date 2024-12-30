// src/components/listings/ListingPreview.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ListingPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listingData } = location.state || {};

  if (!listingData) {
    // Jeśli nie ma danych, przekieruj z powrotem do tworzenia ogłoszenia
    navigate('/createlisting');
    return null;
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Podgląd Ogłoszenia</h2>
        {/* Wyświetl dane ogłoszenia */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">{listingData.title}</h3>
          {/* Dodaj inne pola ogłoszenia */}
          <p>{listingData.description}</p>
          {/* Wyświetl zdjęcia, cenę, itp. */}
        </div>
        {/* Przyciski nawigacyjne */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg"
          >
            Wróć
          </button>
          <button
            onClick={() => {
              // Funkcja publikacji ogłoszenia
            }}
            className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg"
          >
            Opublikuj Ogłoszenie
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingPreview;
