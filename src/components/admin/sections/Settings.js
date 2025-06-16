// src/components/admin/sections/Settings.js
/**
 * Komponent do zarządzania ustawieniami w panelu administratora
 * Component for managing settings in admin panel
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaUndo, FaExclamationTriangle } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteDescription: '',
      contactEmail: '',
      maxListingsPerUser: 10,
      maxImagesPerListing: 10
    },
    listings: {
      approvalRequired: true,
      expirationDays: 30,
      allowedCategories: ['Samochody osobowe', 'Samochody dostawcze', 'Motocykle', 'Części'],
      featuredListingsCost: 50
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      adminEmailForReports: ''
    },
    security: {
      loginAttempts: 5,
      lockoutTime: 30,
      passwordResetExpiry: 24
    }
  });
  
  const [originalSettings, setOriginalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // Pobieranie ustawień
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/settings');
        
        setSettings(response.data);
        setOriginalSettings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Wystąpił błąd podczas pobierania ustawień.');
        setLoading(false);
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  // Obsługa zmiany wartości pola
  const handleChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };

  // Obsługa zapisywania ustawień
  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      await axios.post('/api/admin/settings', settings);
      
      setOriginalSettings(settings);
      setSaveStatus('success');
      
      // Resetowanie statusu po 3 sekundach
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Error saving settings:', err);
      
      // Resetowanie statusu po 3 sekundach
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }
  };

  // Obsługa resetowania ustawień
  const handleReset = () => {
    setSettings(originalSettings);
  };

  // Renderowanie statusu zapisywania
  const renderSaveStatus = () => {
    if (saveStatus === 'saving') {
      return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
          <p>Zapisywanie ustawień...</p>
        </div>
      );
    } else if (saveStatus === 'success') {
      return (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>Ustawienia zostały pomyślnie zapisane.</p>
        </div>
      );
    } else if (saveStatus === 'error') {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>Wystąpił błąd podczas zapisywania ustawień.</p>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Błąd!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Ustawienia</h1>
        
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors flex items-center"
            onClick={handleReset}
          >
            <FaUndo className="mr-2" />
            Resetuj
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            onClick={handleSave}
          >
            <FaSave className="mr-2" />
            Zapisz
          </button>
        </div>
      </div>
      
      {renderSaveStatus()}
      
      {/* Zakładki */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            Ogólne
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'listings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('listings')}
          >
            Ogłoszenia
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Powiadomienia
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Bezpieczeństwo
          </button>
        </nav>
      </div>
      
      {/* Zawartość zakładek */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-800">Ustawienia ogólne</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa serwisu
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.general.siteName}
                  onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email kontaktowy
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.general.contactEmail}
                  onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opis serwisu
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={settings.general.siteDescription}
                  onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maksymalna liczba ogłoszeń na użytkownika
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.general.maxListingsPerUser}
                  onChange={(e) => handleChange('general', 'maxListingsPerUser', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maksymalna liczba zdjęć na ogłoszenie
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.general.maxImagesPerListing}
                  onChange={(e) => handleChange('general', 'maxImagesPerListing', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-800">Ustawienia ogłoszeń</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.listings.approvalRequired}
                    onChange={(e) => handleChange('listings', 'approvalRequired', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Wymagaj zatwierdzenia ogłoszeń</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Czas wygaśnięcia ogłoszenia (dni)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.listings.expirationDays}
                  onChange={(e) => handleChange('listings', 'expirationDays', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Koszt wyróżnienia ogłoszenia (PLN)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.listings.featuredListingsCost}
                  onChange={(e) => handleChange('listings', 'featuredListingsCost', parseInt(e.target.value))}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dozwolone kategorie
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {settings.listings.allowedCategories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => {
                          const newCategories = [...settings.listings.allowedCategories];
                          newCategories[index] = e.target.value;
                          handleChange('listings', 'allowedCategories', newCategories);
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
                  onClick={() => {
                    const newCategories = [...settings.listings.allowedCategories, ''];
                    handleChange('listings', 'allowedCategories', newCategories);
                  }}
                >
                  Dodaj kategorię
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-800">Ustawienia powiadomień</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Włącz powiadomienia email</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleChange('notifications', 'smsNotifications', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Włącz powiadomienia SMS</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email administratora do zgłoszeń
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.notifications.adminEmailForReports}
                  onChange={(e) => handleChange('notifications', 'adminEmailForReports', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-800">Ustawienia bezpieczeństwa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maksymalna liczba prób logowania
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.security.loginAttempts}
                  onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Czas blokady konta (minuty)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.security.lockoutTime}
                  onChange={(e) => handleChange('security', 'lockoutTime', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Czas ważności linku do resetowania hasła (godziny)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.security.passwordResetExpiry}
                  onChange={(e) => handleChange('security', 'passwordResetExpiry', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
