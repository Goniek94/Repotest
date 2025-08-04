import React, { useState } from 'react';
import { FaLock, FaSave, FaUserTimes, FaExclamationTriangle } from 'react-icons/fa';

const PrivacySection = ({ privacy, setPrivacy, loading, setLoading, error, setError, success, setSuccess }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Ustawienia prywatności zostały zaktualizowane!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Wystąpił błąd podczas zapisywania ustawień');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Żądanie usunięcia konta zostało wysłane. Sprawdź email.');
      setShowDeleteConfirm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Wystąpił błąd podczas usuwania konta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Nagłówek sekcji */}
      <div className="flex items-center space-x-4 p-6 bg-white rounded-xl border border-gray-200 mb-6 flex-shrink-0">
        <div className="w-12 h-12 bg-[#35530A] rounded-xl flex items-center justify-center">
          <FaLock className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Zarządzanie kontem</h2>
          <p className="text-gray-600 mt-1">Prywatność, dane i zarządzanie kontem</p>
        </div>
      </div>

      {/* Przewijalna zawartość */}
      <div className="flex-1 overflow-y-auto px-6">
        {/* Sekcja Prywatności */}
        <form onSubmit={handleSavePrivacy} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl border border-gray-100">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Widoczność profilu</h3>
              <p className="text-gray-600">Kontroluj kto może zobaczyć Twój profil</p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={privacy.profileVisibility === 'public'}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-4 h-4 text-[#35530A] bg-white border-gray-300 focus:ring-[#35530A]"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">Publiczny - wszyscy mogą zobaczyć</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="friends"
                  checked={privacy.profileVisibility === 'friends'}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-4 h-4 text-[#35530A] bg-white border-gray-300 focus:ring-[#35530A]"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">Znajomi - tylko zalogowani użytkownicy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={privacy.profileVisibility === 'private'}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-4 h-4 text-[#35530A] bg-white border-gray-300 focus:ring-[#35530A]"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">Prywatny - tylko ja</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Udostępnianie danych</h3>
              <p className="text-gray-600">Pozwól na udostępnianie danych partnerom</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.dataSharing}
                onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35530A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Spersonalizowane reklamy</h3>
              <p className="text-gray-600">Wyświetlaj reklamy dopasowane do Twoich zainteresowań</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.personalizedAds}
                onChange={(e) => handlePrivacyChange('personalizedAds', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35530A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analityka użytkowania</h3>
              <p className="text-gray-600">Pomóż nam ulepszać serwis poprzez anonimowe dane</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.analytics}
                onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35530A]"></div>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-8 py-3 border border-transparent rounded-xl shadow-sm text-white font-semibold bg-[#35530A] hover:bg-[#2a4208] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#35530A] transition-all duration-200 disabled:opacity-50"
          >
            <FaSave className="mr-2" />
            {loading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
          </button>
        </div>
      </form>

      {/* Sekcja Usuwania Konta */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Strefa niebezpieczna</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center space-x-3">
              <FaUserTimes className="text-red-500 text-lg" />
              <div>
                <h4 className="font-medium text-red-900">Usuń konto</h4>
                <p className="text-sm text-red-600">Trwale usuń swoje konto i wszystkie dane</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Usuń konto
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">Potwierdź usunięcie konta</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Ta akcja jest nieodwracalna. Wszystkie Twoje dane, ogłoszenia i wiadomości zostaną trwale usunięte.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Usuwanie...' : 'Usuń konto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySection;
