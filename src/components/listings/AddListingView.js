import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCar, FaInfoCircle, FaMoneyBillAlt, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';

const AddListingView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { listingData } = location.state || {};

  if (!listingData) {
    navigate('/createlisting');
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Nagłówek */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{listingData.title || 'Podgląd ogłoszenia'}</h1>
          <p className="text-lg text-gray-500">{listingData.headline || 'Sprawdź szczegóły swojego ogłoszenia przed publikacją.'}</p>
        </div>

        {/* Sekcja zdjęcia */}
        <div className="mb-8 text-center">
          {listingData.mainPhoto ? (
            <img
              src={URL.createObjectURL(listingData.mainPhoto)}
              alt="Główne zdjęcie"
              className="w-64 h-64 object-cover rounded-lg shadow-md mx-auto"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-300 rounded-lg mx-auto flex items-center justify-center shadow-inner">
              <span className="text-gray-500 text-lg">Brak zdjęcia</span>
            </div>
          )}
        </div>

        {/* Informacje o pojeździe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kafelek: Informacje o pojeździe */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaCar className="text-blue-500 text-2xl mr-3" />
              <h2 className="text-lg font-semibold text-gray-700">Informacje o pojeździe</h2>
            </div>
            <p><strong>Marka:</strong> {listingData.brand || 'Nie podano'}</p>
            <p><strong>Model:</strong> {listingData.model || 'Nie podano'}</p>
            <p><strong>Rocznik:</strong> {listingData.year || 'Nie podano'}</p>
            <p><strong>Paliwo:</strong> {listingData.fuel || 'Nie podano'}</p>
            <p><strong>Napęd:</strong> {listingData.drive || 'Nie podano'}</p>
          </div>

          {/* Kafelek: Opcje dodatkowe */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaCheck className="text-green-500 text-2xl mr-3" />
              <h2 className="text-lg font-semibold text-gray-700">Opcje dodatkowe</h2>
            </div>
            <p><strong>Dostosowane dla osób niepełnosprawnych:</strong> {listingData.options?.disabledAdapted ? 'Tak' : 'Nie'}</p>
            <p><strong>Kierownica po prawej stronie:</strong> {listingData.options?.rightHandDrive ? 'Tak' : 'Nie'}</p>
            <p><strong>Pierwszy właściciel:</strong> {listingData.options?.firstOwner ? 'Tak' : 'Nie'}</p>
          </div>

          {/* Kafelek: Lokalizacja */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-red-500 text-2xl mr-3" />
              <h2 className="text-lg font-semibold text-gray-700">Lokalizacja</h2>
            </div>
            <p><strong>Województwo:</strong> {listingData.region || 'Nie podano'}</p>
            <p><strong>Miejscowość:</strong> {listingData.city || 'Nie podano'}</p>
          </div>

          {/* Kafelek: Cena i Typ ogłoszenia */}
          <div className="bg-white shadow-md rounded-lg p-6 col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <FaMoneyBillAlt className="text-yellow-500 text-2xl mr-3" />
              <h2 className="text-lg font-semibold text-gray-700">Cena i Typ ogłoszenia</h2>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{listingData.price ? `${listingData.price} zł` : 'Cena do ustalenia'}</p>
            <p><strong>Typ:</strong> {listingData.listingType === 'wyroznione' ? 'Wyróżnione' : 'Standardowe'}</p>
          </div>
        </div>

        {/* Przyciski akcji */}
        <div className="mt-8 flex justify-center gap-6">
          <button
            onClick={() => navigate('/createlisting')}
            className="flex items-center bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-600"
          >
            Powrót do edycji
          </button>
          <button
            onClick={() => navigate('/payment')}
            className="flex items-center bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700"
          >
            Dodaj ogłoszenie
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListingView;
