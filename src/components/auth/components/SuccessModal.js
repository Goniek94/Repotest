// src/components/auth/components/SuccessModal.js
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="bg-green-100 p-3 rounded-full mb-4">
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Rejestracja zakończona pomyślnie!
        </h2>
        <p className="text-gray-600 mb-6">
          Twoje konto zostało utworzone. Sprawdź swoją skrzynkę email, aby zweryfikować adres 
          i aktywować konto.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#35530A] hover:bg-[#2D4A06] text-white font-bold py-3 px-4 rounded uppercase transition-colors"
        >
          Przejdź do logowania
        </button>
      </div>
    </div>
  </div>
);

export default SuccessModal;
