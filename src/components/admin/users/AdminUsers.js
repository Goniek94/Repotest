import React, { useState } from 'react';

const AdminUsers = () => {
  const [users] = useState([
    { id: 1, name: 'Jan Kowalski', email: 'jan@example.com', role: 'user' },
    { id: 2, name: 'Anna Nowak', email: 'anna@example.com', role: 'admin' },
    // więcej przykładowych użytkowników
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Zarządzanie Użytkownikami</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rola</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
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

export default AdminUsers;