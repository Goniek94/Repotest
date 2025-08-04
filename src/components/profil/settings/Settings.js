import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Lock,
  AlertCircle,
  CheckCircle,
  Plus,
  RefreshCw,
  Eye,
  Grid3X3,
  Settings as SettingsIcon
} from 'lucide-react';
import ProfileHeader from '../shared/ProfileHeader';
import UserDataSection from './components/UserDataSection';
import SecuritySection from './components/SecuritySection';
import NotificationsSection from './components/NotificationsSection';
import PrivacySection from './components/PrivacySection';
import { fetchUserSettings } from '../../../services/api/userSettingsApi';

/**
 * Główny komponent ustawień użytkownika z responsywnym designem
 * Na mobile: siatka ikonek 2x4 bez napisów
 * Na desktop: tradycyjny sidebar z opisami
 */
const Settings = () => {
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

  // Funkcja do zmiany sekcji z animacją
  const handleSectionChange = (sectionId) => {
    console.log('🔄 Zmiana sekcji na:', sectionId);
    
    // Wyczyść błędy i sukces przy zmianie sekcji
    setError('');
    setSuccess('');
    
    // Zmień sekcję
    setActiveSection(sectionId);
  };

  // Funkcja do renderowania zawartości sekcji
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-[#35530A] mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">Ładowanie danych...</p>
          </div>
        </div>
      );
    }

    // Wrapper z animacją fade-in dla zawartości
    const ContentWrapper = ({ children }) => (
      <div className="animate-fadeIn">
        {children}
      </div>
    );

    switch (activeSection) {
      case 'userData':
        return (
          <ContentWrapper>
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
          </ContentWrapper>
        );
      case 'security':
        return (
          <ContentWrapper>
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
          </ContentWrapper>
        );
      case 'notifications':
        return (
          <ContentWrapper>
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
          </ContentWrapper>
        );
      case 'privacy':
        return (
          <ContentWrapper>
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
          </ContentWrapper>
        );
      default:
        return (
          <ContentWrapper>
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🚧</div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Funkcja w budowie</h3>
                <p className="text-sm sm:text-base text-gray-600">Ta sekcja będzie dostępna wkrótce.</p>
              </div>
            </div>
          </ContentWrapper>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* CSS dla animacji */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Nagłówek z zielonym gradientem - zachowujemy oryginalny styl */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 rounded-xl shadow-lg p-6 mb-1" style={{background: 'linear-gradient(135deg, #35530A, #4a7c0c, #35530A)'}}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Ustawienia</h1>
              <p className="text-white/80">Zarządzaj swoim kontem i preferencjami</p>
            </div>
            <div className="flex items-center">
              <SettingsIcon className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        {/* Mobile & Tablet: Kafelki poziome */}
        <div className="lg:hidden mb-1">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveSection(section.id);
                  }}
                  type="button"
                  className={`flex-shrink-0 bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all duration-200 hover:shadow-lg ${
                    isActive
                      ? 'border-[#35530A] shadow-lg ring-2 ring-[#35530A]/20'
                      : 'hover:border-gray-300'
                  }`}
                  style={{ minWidth: '120px' }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'text-[#35530A]' : 'text-gray-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      isActive ? 'text-[#35530A]' : 'text-gray-600'
                    }`}>
                      {section.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout responsywny */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Desktop: Sidebar */}
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                KATEGORIE
              </h2>
              
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-[#35530A] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {section.title}
                        </div>
                        <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {section.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Główna zawartość - responsywna */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md lg:shadow-lg border border-gray-200 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
              {/* Messages - responsywne */}
              {error && (
                <div className="m-3 sm:m-4 lg:m-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="m-3 sm:m-4 lg:m-6 bg-green-50 border border-green-200 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Content */}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
