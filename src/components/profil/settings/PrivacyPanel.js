import React, { useState } from 'react';

const PrivacyPanel = () => {
  const PRIMARY_COLOR = '#35530A';
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" style={{ color: PRIMARY_COLOR }}>
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-800">Ustawienia prywatności</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Zarządzaj swoją prywatnością i udostępnianiem danych</p>
      <div className="space-y-6">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-gray-800">Profil publiczny</h3>
            <p className="text-sm text-gray-500">Udostępniaj swój profil innym użytkownikom</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-gray-800">Udostępnianie danych</h3>
            <p className="text-sm text-gray-500">Zgoda na udostępnianie danych partnerom</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <h3 className="font-medium text-gray-800">Spersonalizowane reklamy</h3>
            <p className="text-sm text-gray-500">Dopasowane rekomendacje i oferty</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button 
          className="px-4 py-2 text-white font-medium rounded hover:opacity-90 transition-opacity"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          Zapisz zmiany
        </button>
      </div>
    </div>
  );
};

export default PrivacyPanel;