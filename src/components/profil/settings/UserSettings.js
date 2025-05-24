import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import UserDataPanel from './UserDataPanel';
import SecurityPanel from './SecurityPanel';
import NotificationsPanel from './NotificationsPanel';
import PrivacyPanel from './PrivacyPanel';

const UserSettings = () => {
  const PRIMARY_COLOR = '#35530A';
  const PRIMARY_LIGHTER = '#EAF2DE';
  const [activeTab, setActiveTab] = useState('userData');
  const navigate = useNavigate();
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const refreshAttemptedRef = useRef(false);

  // Form state (przekazywany tylko do UserDataPanel)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phonePrefix: '+48',
    phoneNumber: '',
    dob: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    isEmailVerified: false,
    isPhoneVerified: false,
    registrationType: 'standard',
    name: '', // Dla kompatybilności z API (w przypadku różnych nazw pól)
  });

  // Funkcja do manualnego odświeżania danych użytkownika
  const handleRefreshData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await refreshUser();
      setIsLoading(false);
    } catch (err) {
      console.error("Błąd podczas pobierania danych użytkownika:", err);
      setError("Nie udało się pobrać danych użytkownika. Spróbuj odświeżyć stronę.");
      setIsLoading(false);
    }
  };

  // Aktualizacja formularza po pobraniu danych użytkownika
  useEffect(() => {
    if (user) {
      console.log('Ustawianie danych użytkownika w formularzu:', user);
      setForm({
        firstName: user.firstName || user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phonePrefix: user.phonePrefix || '+48',
        phoneNumber: user.phoneNumber || '',
        dob: user.dob || '',
        street: user.street || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
        isEmailVerified: user.isEmailVerified || false,
        isPhoneVerified: user.isPhoneVerified || false,
        registrationType: user.registrationType || 'standard',
        name: user.name || '', // Dla kompatybilności z API
      });
      // Dane załadowane z kontekstu, więc nie ma potrzeby dodatkowego ładowania
      setIsLoading(false);
    }
  }, [user]);

  const tabs = [
    { id: 'userData', label: 'Dane użytkownika' },
    { id: 'security', label: 'Bezpieczeństwo' },
    { id: 'notifications', label: 'Powiadomienia' },
    { id: 'privacy', label: 'Prywatność' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'userData':
        return <UserDataPanel form={form} />;
      case 'security':
        return <SecurityPanel />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'privacy':
        return <PrivacyPanel />;
      default:
        return <UserDataPanel form={form} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/profil')}
          className="mb-6 flex items-center px-4 py-2 rounded text-sm font-medium"
          style={{ backgroundColor: PRIMARY_LIGHTER, color: PRIMARY_COLOR }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wróć do panelu
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ustawienia konta</h1>
        <div className="bg-white rounded overflow-hidden shadow-sm" style={{ borderRadius: '10px' }}>
          {isLoading || authLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: PRIMARY_COLOR }}></div>
              <p className="mt-4 text-gray-600">Ładowanie danych użytkownika...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 text-white rounded-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Odśwież stronę
              </button>
            </div>
          ) : (
            <>
              <div className="flex border-b border-gray-200">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === tab.id 
                        ? `border-b-2 border-current` 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    style={{ 
                      color: activeTab === tab.id ? PRIMARY_COLOR : undefined,
                      borderColor: activeTab === tab.id ? PRIMARY_COLOR : undefined
                    }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {renderActiveTab()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
