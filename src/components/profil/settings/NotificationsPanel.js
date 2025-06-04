import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Phone, 
  Info, 
  Save, 
  ShoppingBag,
  MessageSquare 
} from 'lucide-react';

// Primary color to match the rest of the application
const PRIMARY_COLOR = '#35530A';
const SECONDARY_COLOR = '#5A7D2A';

/**
 * Komponent odpowiedzialny za ustawienia powiadomień użytkownika
 * @returns {JSX.Element}
 */
const NotificationsPanel = () => {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    newsletter: true,
    updates: false,
    marketing: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Obsługa przełączania ustawień
  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Obsługa zapisywania zmian
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Symulacja opóźnienia API
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Ukryj komunikat po 3 sekundach
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
      {/* Nagłówek z gradientem */}
      <div className="bg-gradient-to-r from-[#35530A] to-[#5A7D2A] px-4 sm:px-6 py-5 flex items-center">
        <Bell size={24} className="text-white mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">Ustawienia powiadomień</h2>
      </div>
      
      <form onSubmit={handleSaveChanges} className="p-4 sm:p-6">
        <p className="text-gray-600 mb-8">Dostosuj sposób otrzymywania powiadomień i alertów</p>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Sekcja powiadomień email */}
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Mail className="mr-2 text-[#35530A]" size={20} />
              Powiadomienia email
            </h3>
            
            <div className="space-y-6">
              <NotificationToggle 
                title="Powiadomienia e-mail"
                description="Ważne aktualizacje, informacje o koncie i transakcjach"
                checked={settings.email}
                onChange={() => handleToggle('email')}
              />
              
              <NotificationToggle 
                title="Biuletyn informacyjny"
                description="Cotygodniowe aktualności i nowości"
                checked={settings.newsletter}
                onChange={() => handleToggle('newsletter')}
              />
              
              <NotificationToggle 
                title="Aktualizacje produktów"
                description="Informacje o zmianach w produktach i usługach"
                checked={settings.updates}
                onChange={() => handleToggle('updates')}
              />
            </div>
          </div>
          
          {/* Sekcja powiadomień SMS */}
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Phone className="mr-2 text-[#35530A]" size={20} />
              Powiadomienia SMS
            </h3>
            
            <div className="space-y-6">
              <NotificationToggle 
                title="Powiadomienia SMS"
                description="Pilne informacje i alerty dotyczące konta"
                checked={settings.sms}
                onChange={() => handleToggle('sms')}
              />
            </div>
          </div>
          
          {/* Sekcja powiadomień aplikacji */}
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Bell className="mr-2 text-[#35530A]" size={20} />
              Powiadomienia aplikacji
            </h3>
            
            <div className="space-y-6">
              <NotificationToggle 
                title="Powiadomienia push"
                description="Błyskawiczne powiadomienia w aplikacji lub przeglądarce"
                checked={settings.push}
                onChange={() => handleToggle('push')}
              />
            </div>
          </div>
          
          {/* Sekcja powiadomień marketingowych */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ShoppingBag className="mr-2 text-[#35530A]" size={20} />
              Powiadomienia marketingowe
            </h3>
            
            <div className="space-y-6">
              <NotificationToggle 
                title="Promocje i oferty specjalne"
                description="Informacje o zniżkach, promocjach i ofertach specjalnych"
                checked={settings.marketing}
                onChange={() => handleToggle('marketing')}
              />
            </div>
          </div>
        </div>
        
        {/* Informacja o ochronie prywatności */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-start">
          <Info size={20} className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Możesz w dowolnym momencie zmienić swoje preferencje dotyczące powiadomień.
            Więcej informacji o tym, jak wykorzystujemy Twoje dane, znajdziesz w naszej 
            <a href="#" className="underline font-medium ml-1">Polityce prywatności</a>.
          </p>
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
              <p className="text-sm">Twoje preferencje powiadomień zostały zaktualizowane</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

/**
 * Komponent pojedynczego przełącznika powiadomień
 */
const NotificationToggle = ({ title, description, checked, onChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
    <div className="flex-grow">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
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

// Dodanie animacji fade-in-up
const style = document.createElement('style');
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

export default NotificationsPanel;