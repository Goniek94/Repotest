import React, { useState } from 'react';

const UserFavorites = () => {
  // Stan przechowujący informację, która wewnętrzna zakładka jest aktywna
  // Możliwe wartości: 'favorites' | 'myAds'
  const [activeTab, setActiveTab] = useState('favorites');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-[2px]">
        {/* NAGŁÓWEK */}
        <div className="bg-[#35530A] text-white p-4 rounded-t-[2px]">
          <h2 className="text-xl font-bold uppercase">Ulubione ogłoszenia</h2>
        </div>

        {/* WNĘTRZE */}
        <div className="p-6">
          {/* Przyciskowe „zakładki” */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-2 rounded font-semibold 
                ${activeTab === 'favorites' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Ulubione
            </button>
            <button
              onClick={() => setActiveTab('myAds')}
              className={`px-3 py-2 rounded font-semibold
                ${activeTab === 'myAds' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Moje ogłoszenia
            </button>
          </div>

          {/* SEKCJA: Ulubione */}
          {activeTab === 'favorites' && (
            <div>
              <h3 className="text-lg font-bold mb-2">Twoje ulubione ogłoszenia</h3>
              <p>Tu możesz wyświetlić listę ogłoszeń, które dodałeś do ulubionych.</p>
              {/* Przykładowa lista – w praktyce możesz pobrać dane z API czy bazy */}
              <ul className="list-disc list-inside mt-3 text-sm">
                <li>Ulubione ogłoszenie 1</li>
                <li>Ulubione ogłoszenie 2</li>
                <li>Ulubione ogłoszenie 3</li>
              </ul>
            </div>
          )}

          {/* SEKCJA: Moje ogłoszenia */}
          {activeTab === 'myAds' && (
            <div>
              <h3 className="text-lg font-bold mb-2">Moje ogłoszenia</h3>
              <p>Tu możesz wyświetlić wszystkie swoje ogłoszenia (niekoniecznie ulubione).</p>
              {/* Przykładowa lista */}
              <ul className="list-disc list-inside mt-3 text-sm">
                <li>Moje ogłoszenie A</li>
                <li>Moje ogłoszenie B</li>
                <li>Moje ogłoszenie C</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFavorites;
