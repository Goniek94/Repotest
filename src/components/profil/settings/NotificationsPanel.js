import React, { useState } from 'react';

const NotificationsPanel = () => {
  const PRIMARY_COLOR = '#35530A';

  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    newsletter: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ustawienia konta</h1>
        <div className="bg-white rounded overflow-hidden shadow-sm" style={{ borderRadius: '10px' }}>
          <div className="flex border-b border-gray-200">
            <button
              className="px-6 py-3 text-sm font-medium border-b-2 border-current"
              style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
            >
              Powiadomienia
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" style={{ color: PRIMARY_COLOR }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">Ustawienia powiadomień</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">Dostosuj sposób otrzymywania powiadomień</p>
            <div className="space-y-6">
              {/* Powiadomienia email */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-800">Powiadomienia e-mail</h3>
                  <p className="text-sm text-gray-500">Ważne aktualizacje, informacje o koncie i transakcjach</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={() => handleToggle('email')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {/* Powiadomienia SMS */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-800">Powiadomienia SMS</h3>
                  <p className="text-sm text-gray-500">Pilne informacje i alerty dotyczące konta</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sms}
                    onChange={() => handleToggle('sms')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {/* Powiadomienia push */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-800">Powiadomienia push</h3>
                  <p className="text-sm text-gray-500">Błyskawiczne powiadomienia w aplikacji lub przeglądarce</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.push}
                    onChange={() => handleToggle('push')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              {/* Newsletter */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-800">Newsletter</h3>
                  <p className="text-sm text-gray-500">Promocje, nowości i oferty specjalne</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.newsletter}
                    onChange={() => handleToggle('newsletter')}
                    className="sr-only peer"
                  />
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
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
