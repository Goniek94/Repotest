// src/components/dashboard/UserPanel.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserPanel = ({ user }) => {
  // Use the user prop passed from UserDashboard
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Witaj w Panelu Użytkownika</h2>
      
      {user && (
        <div className="mb-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
            <h3 className="font-medium text-green-800 mb-2">Twoje dane</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Imię i Nazwisko:</p>
                <p className="font-medium">{user.firstName || user.name} {user.lastName || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefon:</p>
                <p className="font-medium">{user.phone || user.phoneNumber || 'Nie podano'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data dołączenia:</p>
                <p className="font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Nie dostępna'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Moje ogłoszenia</h3>
          <p className="text-gray-600 mb-3">Zarządzaj swoimi aktywnymi ogłoszeniami.</p>
          <div className="flex justify-end">
            <a href="/profil/listings" className="text-sm text-green-800 hover:underline">Przejdź do ogłoszeń →</a>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Wiadomości</h3>
          <p className="text-gray-600 mb-3">Masz 5 nieprzeczytanych wiadomości.</p>
          <div className="flex justify-end">
            <a href="/profil/messages" className="text-sm text-green-800 hover:underline">Przejdź do wiadomości →</a>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Historia transakcji</h3>
          <p className="text-gray-600 mb-3">Przeglądaj historię swoich transakcji.</p>
          <div className="flex justify-end">
            <a href="/profil/transactions" className="text-sm text-green-800 hover:underline">Przejdź do transakcji →</a>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Ustawienia konta</h3>
          <p className="text-gray-600 mb-3">Zmień dane lub ustawienia swojego konta.</p>
          <div className="flex justify-end">
            <a href="/profil/settings" className="text-sm text-green-800 hover:underline">Przejdź do ustawień →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;