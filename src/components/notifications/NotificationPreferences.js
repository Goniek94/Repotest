import React, { useState, useEffect } from 'react';

/**
 * Komponent preferencji powiadomień
 * @returns {JSX.Element}
 */
const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: {
      system: true,
      listings: true,
      messages: true,
      comments: true,
      payments: true,
      offers: true
    },
    push: {
      system: true,
      listings: true,
      messages: true,
      comments: true,
      payments: true,
      offers: true
    },
    sms: {
      system: false,
      listings: false,
      messages: false,
      comments: false,
      payments: true,
      offers: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Symulacja ładowania preferencji z API
  useEffect(() => {
    // Tu będzie wywołanie API do pobrania preferencji użytkownika
    console.log('Ładowanie preferencji powiadomień...');
  }, []);

  // Obsługa zmiany preferencji
  const handlePreferenceChange = (type, category) => {
    setPreferences(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: !prev[type][category]
      }
    }));
  };

  // Zapisywanie preferencji
  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus(null);
    
    try {
      // Tu będzie wywołanie API do zapisania preferencji
      await new Promise(resolve => setTimeout(resolve, 1000)); // Symulacja
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Resetowanie do domyślnych
  const handleReset = () => {
    setPreferences({
      email: {
        system: true,
        listings: true,
        messages: true,
        comments: true,
        payments: true,
        offers: true
      },
      push: {
        system: true,
        listings: true,
        messages: true,
        comments: true,
        payments: true,
        offers: true
      },
      sms: {
        system: false,
        listings: false,
        messages: false,
        comments: false,
        payments: true,
        offers: false
      }
    });
  };

  const categories = [
    { id: 'system', label: 'Systemowe', description: 'Ważne informacje o systemie i bezpieczeństwie' },
    { id: 'listings', label: 'Ogłoszenia', description: 'Nowe ogłoszenia, wygaśnięcia, moderacja' },
    { id: 'messages', label: 'Wiadomości', description: 'Nowe wiadomości od innych użytkowników' },
    { id: 'comments', label: 'Komentarze', description: 'Komentarze do Twoich ogłoszeń' },
    { id: 'payments', label: 'Płatności', description: 'Transakcje, faktury, płatności' },
    { id: 'offers', label: 'Oferty', description: 'Nowe oferty i promocje' }
  ];

  const notificationTypes = [
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'push', label: 'Powiadomienia w aplikacji', icon: '🔔' },
    { id: 'sms', label: 'SMS', icon: '📱' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nagłówek */}
        <div className="rounded-2xl shadow-xl p-8 mb-8" style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c, #35530A)'}}>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Preferencje powiadomień
            </h1>
            <p className="text-green-100">
              Dostosuj sposób otrzymywania powiadomień do swoich potrzeb
            </p>
          </div>
        </div>

        {/* Informacja o preferencjach */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">ℹ️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Jak to działa?</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Dostosuj swoje preferencje powiadomień, aby otrzymywać tylko te informacje, które są dla Ciebie ważne. 
                Możesz wybrać różne kanały komunikacji dla różnych typów powiadomień.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-yellow-800 text-xs">
                  <strong>Uwaga:</strong> Niektóre powiadomienia systemowe są wymagane ze względów bezpieczeństwa i nie można ich wyłączyć.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela preferencji */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-green-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left">
                    <div className="text-sm font-semibold text-gray-900">Kategoria powiadomień</div>
                  </th>
                  {notificationTypes.map(type => (
                    <th key={type.id} className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{type.icon}</span>
                        <span className="text-sm font-semibold text-gray-900">{type.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category, index) => (
                  <tr key={category.id} className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-6">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          {category.label}
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {category.description}
                        </div>
                      </div>
                    </td>
                    {notificationTypes.map(type => (
                      <td key={type.id} className="px-6 py-6 text-center">
                        <label className="inline-flex items-center cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={preferences[type.id][category.id]}
                              onChange={() => handlePreferenceChange(type.id, category.id)}
                              className="sr-only"
                              disabled={category.id === 'system' && type.id === 'email'}
                            />
                            <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                              preferences[type.id][category.id] 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg' 
                                : 'bg-gray-300'
                            } ${category.id === 'system' && type.id === 'email' ? 'opacity-50 cursor-not-allowed' : 'group-hover:shadow-lg'}`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                preferences[type.id][category.id] ? 'translate-x-6' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dodatkowe opcje */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Częstotliwość powiadomień email */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📧</span>
              Częstotliwość emaili
            </h3>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer group">
                <input type="radio" name="emailFrequency" value="instant" className="sr-only" defaultChecked />
                <div className="w-4 h-4 border-2 border-green-500 rounded-full mr-3 flex items-center justify-center group-hover:border-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">Natychmiast</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input type="radio" name="emailFrequency" value="daily" className="sr-only" />
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center group-hover:border-green-600">
                  <div className="w-2 h-2 bg-transparent rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">Podsumowanie dzienne</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input type="radio" name="emailFrequency" value="weekly" className="sr-only" />
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center group-hover:border-green-600">
                  <div className="w-2 h-2 bg-transparent rounded-full"></div>
                </div>
                <span className="text-sm text-gray-700">Podsumowanie tygodniowe</span>
              </label>
            </div>
          </div>

          {/* Godziny ciszy */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🌙</span>
              Godziny ciszy
            </h3>
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" />
                <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600 hidden" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Włącz godziny ciszy</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Od</label>
                  <input type="time" defaultValue="22:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Do</label>
                  <input type="time" defaultValue="08:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Przyciski akcji */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c)'}}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Zapisywanie...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Zapisz preferencje
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="inline-flex items-center px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Przywróć domyślne
          </button>
        </div>

        {/* Status zapisywania */}
        {saveStatus && (
          <div className={`mt-6 p-4 rounded-xl text-center ${
            saveStatus === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {saveStatus === 'success' ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Preferencje zostały zapisane pomyślnie!
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Wystąpił błąd podczas zapisywania preferencji.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPreferences;
