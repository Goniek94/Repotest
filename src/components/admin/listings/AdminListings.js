import React, { useState } from 'react';

const AdminListings = () => {
  const [listings] = useState([
    { id: 1, title: 'Toyota na sprzedaż', author: 'Jan Kowalski', date: '2024-01-15', status: 'active' },
    // więcej przykładowych ogłoszeń
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Zarządzanie Ogłoszeniami</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tytuł</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listings.map(listing => (
              <tr key={listing.id}>
                <td className="px-6 py-4">{listing.id}</td>
                <td className="px-6 py-4">{listing.title}</td>
                <td className="px-6 py-4">{listing.author}</td>
                <td className="px-6 py-4">{listing.date}</td>
                <td className="px-6 py-4">{listing.status}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edytuj</button>
                  <button className="text-red-600 hover:text-red-800">Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminListings;