import React from 'react';

const UserDataPanel = ({ form }) => {
  const PRIMARY_COLOR = '#35530A';
  const PRIMARY_LIGHT = '#546F20';
  const PRIMARY_LIGHTER = '#EAF2DE';
  const WARN_COLOR = '#F59E0B';
  const WARN_LIGHTER = '#FEF3C7';

  // Helper component for verification badge
  const VerificationBadge = ({ isVerified }) => (
    <span className="text-xs px-2 flex items-center border border-l-0 rounded-r"
      style={{ 
        backgroundColor: isVerified ? PRIMARY_LIGHTER : WARN_LIGHTER, 
        color: isVerified ? PRIMARY_COLOR : WARN_COLOR, 
        borderColor: isVerified ? PRIMARY_LIGHTER : WARN_LIGHTER 
      }}>
      {isVerified ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Zweryfikowany
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Niezweryfikowany
        </>
      )}
    </span>
  );

  // Registration type display
  const RegistrationType = () => (
    <div className="md:col-span-2 mb-4">
      <div className="p-3 rounded text-sm" style={{ backgroundColor: form.registrationType === 'google' ? '#E8F0FE' : '#F3F4F6' }}>
        <div className="font-medium mb-1">
          {form.registrationType === 'google' ? (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
              </svg>
              Konto połączone z Google
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Standardowa rejestracja
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600">
          {form.registrationType === 'google' 
            ? 'Twoje konto zostało utworzone przez logowanie Google. Twój adres email został automatycznie zweryfikowany.' 
            : 'Twoje konto zostało utworzone poprzez standardową rejestrację.'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" style={{ color: PRIMARY_COLOR }}>
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-800">Profil użytkownika</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">Zarządzaj swoimi podstawowymi informacjami</p>
      <div className="p-4 rounded-sm mb-6 flex items-start" style={{ backgroundColor: PRIMARY_LIGHTER }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" style={{ color: PRIMARY_COLOR }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: PRIMARY_COLOR }}>Dane kluczowe</p>
          <p className="text-xs" style={{ color: PRIMARY_LIGHT }}>
            Imię, nazwisko, data urodzenia oraz dane kontaktowe zostały zweryfikowane podczas rejestracji. Te dane nie mogą być zmienione. Jeśli potrzebujesz wprowadzić korektę, skontaktuj się z administratorem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration type info */}
        <RegistrationType />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imię <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.firstName || form.name || ''}
            disabled
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            name="firstName"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nazwisko <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.lastName || ''}
            disabled
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            name="lastName"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data urodzenia <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.dob || 'Nie określono'}
            disabled
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            name="dob"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adres email
          </label>
          <div className="flex">
            <input
              type="email"
              value={form.email || ''}
              disabled
              className="flex-grow p-2 border border-gray-300 rounded-l text-gray-700"
              name="email"
            />
            <VerificationBadge isVerified={form.isEmailVerified || form.registrationType === 'google'} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numer telefonu
          </label>
          <div className="flex">
            <div className="flex-none w-16">
              <input
                type="text"
                value={form.phonePrefix || '+48'}
                disabled
                className="w-full p-2 border border-gray-300 rounded-l text-gray-700"
                name="phonePrefix"
              />
            </div>
            <input
              type="text"
              value={form.phoneNumber || ''}
              disabled
              className="flex-grow p-2 border-t border-b border-r border-gray-300 text-gray-700"
              name="phoneNumber"
            />
            <VerificationBadge isVerified={form.isPhoneVerified} />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ulica
          </label>
          <input
            type="text"
            value={form.street}
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            name="street"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Miasto
          </label>
          <input
            type="text"
            value={form.city}
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            name="city"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kod pocztowy
          </label>
          <input
            type="text"
            value={form.postalCode}
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            name="postalCode"
            disabled
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kraj
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            name="country"
            value={form.country}
            disabled
          >
            <option value="pl">Polska</option>
            <option value="de">Niemcy</option>
            <option value="uk">Wielka Brytania</option>
          </select>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button 
          className="px-4 py-2 text-white font-medium rounded hover:opacity-90 transition-opacity"
          style={{ backgroundColor: PRIMARY_COLOR }}
          disabled
        >
          Zapisz zmiany
        </button>
      </div>
    </>
  );
};

export default UserDataPanel;
