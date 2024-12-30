// src/components/listings/SearchSection.js
import React from 'react';

const SearchSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Wyszukaj samochód po numerze VIN lub numerze rejestracyjnym</h2>
        <div className="flex items-center gap-4">
            <input
                type="text"
                placeholder="Wprowadź numer VIN lub numer rejestracyjny"
                className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                Wyszukaj
            </button>
        </div>
    </div>
);

export default SearchSection;
