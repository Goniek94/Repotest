import React, { useState } from 'react';

const AdminDiscounts = () => {
  const [discounts] = useState([
    { id: 1, code: 'SPRING2024', value: '20%', validUntil: '2024-03-31', status: 'active' },
    // więcej przykładowych zniżek
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Zarządzanie Zniżkami</h2>
      
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Dodaj nową zniżkę
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kod</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wartość</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ważny do</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {discounts.map(discount => (
              <tr key={discount.id}>
                <td className="px-6 py-4">{discount.id}</td>
                <td className="px-6 py-4">{discount.code}</td>
                <td className="px-6 py-4">{discount.value}</td>
                <td className="px-6 py-4">{discount.validUntil}</td>
                <td className="px-6 py-4">{discount.status}</td>
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

export default AdminDiscounts;