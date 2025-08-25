import React, { useState, useEffect, memo } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Lock,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import UserDataSection from './components/UserDataSection';
import SecuritySection from './components/SecuritySection';
import NotificationsSection from './components/NotificationsSection';
import PrivacySection from './components/PrivacySection';
import { fetchUserSettings } from '../../../services/api/userSettingsApi';
import useResponsiveLayout from '../../../hooks/useResponsiveLayout';

/**
 * Główny komponent ustawień użytkownika - spójny z resztą aplikacji
 * Wzorowany na Messages, UserListings i TransactionHistory
 */
const Settings = memo(() => {
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();
  const [activeSection, setActiveSection] = useState('userData');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Security section states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notifications section states
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    newsletter: false
  });

  // Privacy section states
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    personalizedAds: true,
    analytics: true
  });

  // Definicja sekcji ustawień
  const sections = [
    {
      id: 'userData',
      title: 'Dane',
      description: 'Dane osobowe',
      icon: User
    },
    {
      id: 'security',
      title: 'Bezpieczeństwo',
      description: 'Hasło i 2FA',
      icon: Shield
    },
    {
      id: 'notifications',
      title: 'Powiadomienia',
      description: 'Email i SMS',
      icon: Bell
    },
    {
      id: 'privacy',
      title: 'Prywatność',
      description: 'Zarządzanie kontem',
      icon: Lock
    }
  ];

  // Pobieranie danych użytkownika
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserSettings();
        setUserData(data);
        setError('');
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Błąd podczas ładowania danych użytkownika');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Funkcja do renderowania zawartości sekcji
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16 px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#35530A] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Ładowanie danych...</p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'userData':
        return (
          <UserDataSection 
            formData={userData || {}} 
            handleChange={(event) => {
              setUserData(prev => ({
                ...prev,
                [event.target.name]: event.target.value
              }));
            }}
            handleSubmit={() => {}}
            isSaving={loading}
          />
        );
      case 'security':
        return (
          <SecuritySection 
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        );
      case 'notifications':
        return (
          <NotificationsSection 
            notifications={notifications}
            setNotifications={setNotifications}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        );
      case 'privacy':
        return (
          <PrivacySection 
            privacy={privacy}
            setPrivacy={setPrivacy}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center py-16 px-4">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Funkcja w budowie</h3>
              <p className="text-gray-600">Ta sekcja będzie dostępna wkrótce.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-0 sm:px-1 lg:px-2 py-0 sm:py-1 lg:py-1">
        {/* Nagłówek - identyczny jak w Messages i UserListings */}
        <div className="bg-[#35530A] rounded-t-2xl shadow-lg p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Ustawienia
              </h1>
              <p className="text-white/80 text-sm sm:text-base">
                Zarządzaj swoim kontem i preferencjami
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Layout - przyciski pod nagłówkiem jak w Messages */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200">
            <div className="px-2 py-2">
              <div className="flex justify-center gap-2 relative">
                {/* Lewa kreska separator */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {/* Prawa kreska separator */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {sections.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setError('');
                        setSuccess('');
                      }}
                      className={`
                        flex items-center justify-center
                        w-12 h-12 rounded-xl
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-[#35530A] text-white' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                        }
                      `}
                      title={section.title}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Główny kontener - identyczny layout jak Messages */}
        <div className="
          flex flex-col lg:flex-row
          min-h-[400px] sm:min-h-[450px] lg:h-[calc(100vh-150px)] max-h-[600px]
          bg-white rounded-b-2xl border border-gray-200 border-t-0 overflow-hidden
        " style={{
          boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.15), -3px 0 6px -1px rgba(0, 0, 0, 0.1), 3px 0 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Lewy panel - kategorie normalnej wielkości */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0 border-r border-gray-200">
            <div className="bg-white h-full relative">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">KATEGORIE</h3>
                
                {/* Desktop - pełne przyciski pionowo */}
                <div className="space-y-1">
                  {sections.map(section => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setError('');
                          setSuccess('');
                        }}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-[#35530A] text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <div className="flex-1">
                          <div className="font-medium">{section.title}</div>
                          <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {section.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Informacja na dole panelu */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#35530A]/5 border-t border-gray-100">
                <p className="text-xs text-[#35530A] text-center font-medium">
                  Kliknij kategorię aby zobaczyć ustawienia
                </p>
              </div>
            </div>
          </div>

          {/* Prawy panel - zawartość z suwakiem */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages - responsywne */}
            {error && (
              <div className="flex-shrink-0 m-3 sm:m-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex-shrink-0 m-3 sm:m-4 bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Content z suwakiem */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Footer mobilny - tylko na urządzeniach mobilnych */}
        {isMobile && (
          <div className="bg-gray-50 border-t border-gray-200 p-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Ustawienia konta</span>
              <span className="text-[#35530A] font-medium">
                {sections.find(s => s.id === activeSection)?.title || 'Ustawienia'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Settings.displayName = 'Settings';

export default Settings;
