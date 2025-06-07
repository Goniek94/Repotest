import React, { useState, useEffect } from 'react';
import { fetchUserSettings } from '../../../services/api/userSettingsApi';

const UserDataPanel = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUserSettings()
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Nie udało się pobrać danych użytkownika.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userData) {
      // Debug: log userData to console
      // eslint-disable-next-line no-console
      debug('userData:', userData);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 p-4 rounded bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">Spróbuj odświeżyć stronę lub zaloguj się ponownie.</p>
            </div>
          </div>
        </div>
        <div className="mb-6 p-4 rounded bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Dane kluczowe</p>
              <p className="text-sm mt-1">
                Imię, nazwisko, data urodzenia oraz dane kontaktowe zostały zweryfikowane podczas rejestracji. 
                Te dane nie mogą być zmienione. Jeśli potrzebujesz wprowadzić korektę, skontaktuj się z administratorem.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display user data and messages based on registration type and verification status
  const isStandard = userData?.registrationType === 'standard';
  const isGoogle = userData?.registrationType === 'google';
  const isFullyVerified = userData?.isEmailVerified && userData?.isPhoneVerified;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Info box */}
      {isStandard && (
        <div className="mb-6 p-4 rounded border-l-4" style={{ background: '#FFF8E1', borderColor: '#FFC300', color: '#0A1931' }}>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" style={{ color: '#FFC300' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Konto zarejestrowane standardowo</p>
              <p className="text-sm mt-1">
                Twój adres e-mail oraz numer telefonu zostały zweryfikowane podczas rejestracji. <br />
                <span style={{ color: '#00C48C', fontWeight: 600 }}>Dane są potwierdzone.</span> <br />
                Jeśli chcesz zmienić dane, skontaktuj się z administratorem.
              </p>
            </div>
          </div>
        </div>
      )}

      {isGoogle && !isFullyVerified && (
        <div className="mb-6 p-4 rounded border-l-4" style={{ background: '#FFF8E1', borderColor: '#FFC300', color: '#0A1931' }}>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" style={{ color: '#FFC300' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Konto utworzone przez Google</p>
              <p className="text-sm mt-1">
                Aby korzystać w pełni z serwisu, musisz zweryfikować swoje dane: imię, nazwisko, numer telefonu oraz e-mail.<br />
                <span style={{ color: '#FF5733', fontWeight: 600 }}>Uzupełnij brakujące dane w panelu poniżej.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {isGoogle && isFullyVerified && (
        <div className="mb-6 p-4 rounded border-l-4" style={{ background: '#FFF8E1', borderColor: '#FFC300', color: '#0A1931' }}>
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" style={{ color: '#FFC300' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold">Dane zweryfikowane</p>
              <p className="text-sm mt-1">
                Twoje dane zostały zweryfikowane. Możesz korzystać w pełni z serwisu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dane użytkownika */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imię</label>
          <input
            type="text"
            value={userData?.name || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko</label>
          <input
            type="text"
            value={userData?.lastName || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data urodzenia</label>
          <input
            type="text"
            value={userData?.dob ? new Date(userData.dob).toLocaleDateString('pl-PL') : ''}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
          <input
            type="text"
            value={userData?.phoneNumber || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="text"
            value={userData?.email || ''}
            disabled
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default UserDataPanel;
