// src/components/listings/ListingSummary.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingForm from './ListingForm'; // Przyjmujemy, że ListingForm zawiera już format danych dla podglądu
import PhotoUpload from './PhotoUpload';

const ListingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const listingData = location.state ? location.state.listingData : {};  // Dane ogłoszenia

  const handleEdit = () => {
    navigate('/createlisting', { state: { listingData } });
  };

  const handlePublish = () => {
    // Logika publikacji ogłoszenia (np. zapisywanie do bazy danych lub wysyłanie na serwer)
    alert('Ogłoszenie zostało opublikowane!');
    navigate('/listings');  // Przekierowanie na stronę listy ogłoszeń po publikacji
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="bg-white max-w-2xl mx-auto rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Podsumowanie Ogłoszenia</h2>

        {/* Wykorzystanie komponentu ListingForm do wyświetlenia danych */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Informacje Podstawowe</h3>
          <ListingForm formData={listingData} readonly={true} /> {/* Przekazujemy dane w trybie readonly */}
        </div>

        {/* Sekcja zdjęć (readonly) */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Zdjęcia</h3>
          <PhotoUpload className="h-40" readonly={true} photos={listingData.photos} /> {/* Dodajemy opcję readonly */}
        </div>

        {/* Przycisk do publikacji */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleEdit}
            className="py-3 px-8 rounded-lg font-semibold shadow-lg transition-all duration-200 bg-gray-600 text-white hover:bg-gray-700"
          >
            Edytuj
          </button>
          <button
            onClick={handlePublish}
            className="py-3 px-8 rounded-lg font-semibold shadow-lg transition-all duration-200 bg-green-600 text-white hover:bg-green-700"
          >
            Publikuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingSummary;
