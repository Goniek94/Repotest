import React, { useState, useEffect } from 'react';
import { fetchPrivacySettings, updatePrivacySettings } from '../../../services/api/userSettingsApi';
import { 
  Shield, 
  Users, 
  Share2, 
  Tag, 
  Save, 
  Info,
  Globe
} from 'lucide-react';

// Primary color to match the rest of the application
const PRIMARY_COLOR = '#35530A';
const SECONDARY_COLOR = '#5A7D2A';

/**
 * Komponent odpowiedzialny za ustawienia prywatności użytkownika
 * @returns {JSX.Element}
 */
const PrivacyPanel = () => {
  const [settings, setSettings] = useState({
    publicProfile: true,
    dataSharing: false,
    personalizedAds: true,
    locationSharing: false,
    cookieTracking: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch privacy settings from the backend
  useEffect(() => {
    setIsLoading(true);
    fetchPrivacySettings()
      .then(data => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Błąd podczas pobierania ustawień prywatności:', err);
        setError('Nie udało się pobrać ustawień prywatności.');
        setIsLoading(false);
      });
  }, []);

  // Obsługa przełączania ustawień
  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Obsługa zapisywania zmian
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      await updatePrivacySettings(settings);
      setIsSaving(false);
      setShowSuccess(true);
      
      // Ukryj komunikat po 3 sekundach
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Błąd podczas zapisywania ustawień prywatności:', err);
      setError('Nie udało się zapisać ustawień prywatności.');
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
      {/* Nagłówek z gradientem */}
      <div className="bg-gradient-to-r from-[#35530A] to-[#5A7D2A] px-4 sm:px-6 py-5 flex items-center">
        <Shield size={24} className="text-white mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">Ustawienia prywatności</h2>
      </div>
      
      <form onSubmit={handleSaveChanges} className="p-4 sm:p-6">
        <p className="text-gray-600 mb-8">Zarządzaj swoją prywatnością i udostępnianiem danych</p>
        
        {/* Komunikat o błędzie */}
        {error && (
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
        )}
        
        {/* Wskaźnik ładowania */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
        
        <div className="space-y-6 sm:space-y-8">
          {/* Sekcja profilu */}
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-[#35530A]" size={20} />
              Profil i widoczność
            </h3>
            
            <div className="space-y-6">
              <PrivacyToggle 
                title="Profil publiczny"
                description="Udostępniaj swój profil innym użytkownikom"
                checked={settings.publicProfile}
                onChange={() => handleToggle('publicProfile')}
                icon={<Globe size={16} className="text-blue-500" />}
              />
              
              <PrivacyToggle 
                title="Udostępnianie lokalizacji"
                description="Umożliwia pokazywanie Twojej przybliżonej lokalizacji"
                checked={settings.locationSharing}
                onChange={() => handleToggle('locationSharing')}
                icon={<Globe size={16} className="text-green-500" />}
              />
            </div>
          </div>
          
          {/* Sekcja danych */}
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Share2 className="mr-2 text-[#35530A]" size={20} />
              Udostępnianie danych
            </h3>
            
            <div className="space-y-6">
              <PrivacyToggle 
                title="Udostępnianie danych"
                description="Zgoda na udostępnianie danych partnerom biznesowym"
                checked={settings.dataSharing}
                onChange={() => handleToggle('dataSharing')}
                icon={<Share2 size={16} className="text-purple-500" />}
              />
              
              <PrivacyToggle 
                title="Śledzenie przez pliki cookie"
                description="Zapisywanie Twoich preferencji i historii przeglądania"
                checked={settings.cookieTracking}
                onChange={() => handleToggle('cookieTracking')}
                icon={<Info size={16} className="text-orange-500" />}
              />
            </div>
          </div>
          
          {/* Sekcja reklam */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Tag className="mr-2 text-[#35530A]" size={20} />
              Reklamy i personalizacja
            </h3>
            
            <div className="space-y-6">
              <PrivacyToggle 
                title="Spersonalizowane reklamy"
                description="Dopasowane rekomendacje i oferty oparte na Twoich preferencjach"
                checked={settings.personalizedAds}
                onChange={() => handleToggle('personalizedAds')}
                icon={<Tag size={16} className="text-red-500" />}
              />
            </div>
          </div>
        </div>
        )}
        
        {/* Informacja o polityce prywatności */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-start">
          <Info size={20} className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="mb-2">
              Dbamy o Twoją prywatność. Twoje dane są bezpieczne i możesz w każdej chwili zmienić swoje preferencje.
            </p>
            <p>
              Więcej informacji znajdziesz w naszej{' '}
              <a href="#" className="underline font-medium">Polityce prywatności</a>.
            </p>
          </div>
        </div>
        
        {/* Przyciski akcji */}
        <div className="mt-8 flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className={`flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
              isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#35530A] to-[#5A7D2A] hover:shadow-md'
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                <span>Zapisywanie...</span>
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                <span>Zapisz zmiany</span>
              </>
            )}
          </button>
        </div>
        
        {/* Komunikat o sukcesie */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-start animate-fade-in-up">
            <div className="bg-green-200 rounded-full p-1 mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Zmiany zostały zapisane</p>
              <p className="text-sm">Twoje ustawienia prywatności zostały zaktualizowane</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

/**
 * Komponent pojedynczego przełącznika prywatności
 */
const PrivacyToggle = ({ title, description, checked, onChange, icon }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
    <div className="flex-grow flex items-start">
      {icon && <div className="mr-3 mt-1">{icon}</div>}
      <div>
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="flex-shrink-0">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:shadow-sm after:transition-all peer-checked:bg-[#35530A]"></div>
      </label>
    </div>
  </div>
);

// Dodanie animacji fade-in-up (jeśli jeszcze nie istnieje)
if (!document.querySelector('style[data-animation="fade-in-up"]')) {
  const style = document.createElement('style');
  style.setAttribute('data-animation', 'fade-in-up');
  style.textContent = `
    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.3s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
}

export default PrivacyPanel;