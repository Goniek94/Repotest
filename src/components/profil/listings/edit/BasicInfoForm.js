import React from 'react';

/**
 * Komponent formularza podstawowych informacji ogłoszenia
 * Uproszczony - tylko tytuł, opis i cena
 */
const BasicInfoForm = ({ formData, onChange }) => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-[#35530A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        Podstawowe informacje
      </h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="headline">
          Tytuł ogłoszenia
        </label>
        <input
          type="text"
          id="headline"
          name="headline"
          value={formData.headline}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
          placeholder="Wprowadź tytuł ogłoszenia..."
          maxLength={100}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
          Opis ogłoszenia
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
          placeholder="Szczegółowy opis pojazdu..."
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
          Cena (PLN)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] transition-all duration-200"
          placeholder="Cena w złotych"
          min="0"
          step="1"
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
