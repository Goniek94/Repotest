import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

/**
 * Komponenty dla stanów ładowania i błędów
 */

export const LoadingState = () => (
  <div className="min-h-screen bg-white py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#35530A] border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg">Ładowanie danych ogłoszenia...</p>
      </div>
    </div>
  </div>
);

export const ErrorState = ({ error }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center justify-center flex-col">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Wystąpił błąd</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/profil/listings')}
              className="flex items-center px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2A4208] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do listy ogłoszeń
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
