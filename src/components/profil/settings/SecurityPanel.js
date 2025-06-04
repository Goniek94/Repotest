import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  AlertTriangle, 
  Trash2, 
  Info, 
  Check, 
  X 
} from 'lucide-react';

// Primary color to match the rest of the application
const PRIMARY_COLOR = '#35530A';
const SECONDARY_COLOR = '#5A7D2A';

/**
 * Komponent odpowiedzialny za ustawienia bezpieczeństwa użytkownika
 * @returns {JSX.Element}
 */
const SecurityPanel = () => {
  // Stan formularza zmiany hasła
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Stan widoczności haseł
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Stan procesu zmiany hasła
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Stan potwierdzenia usunięcia konta
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Stan siły hasła
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  // Stan wskazówek dot. hasła
  const [showPasswordTips, setShowPasswordTips] = useState(false);

  // Obsługa zmiany w formularzu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
    
    // Resetuj błąd przy zmianach w formularzu
    setPasswordError('');
  };

  // Przełączanie widoczności hasła
  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Sprawdzanie siły hasła
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };
  
  // Obliczanie wyniku siły hasła (0-5)
  const getPasswordStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };
  
  // Klasa kolorystyczna dla wskaźnika siły hasła
  const getPasswordStrengthClass = () => {
    const score = getPasswordStrengthScore();
    if (score === 0) return '';
    if (score < 3) return 'bg-red-500';
    if (score < 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Walidacja formularza przed wysłaniem
  const validateForm = () => {
    if (!passwordForm.currentPassword) {
      setPasswordError('Podaj obecne hasło');
      return false;
    }
    
    if (!passwordForm.newPassword) {
      setPasswordError('Podaj nowe hasło');
      return false;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Hasła nie są identyczne');
      return false;
    }
    
    if (getPasswordStrengthScore() < 3) {
      setPasswordError('Hasło jest zbyt słabe');
      return false;
    }
    
    return true;
  };

  // Obsługa zmiany hasła
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    // Symulacja opóźnienia API
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Resetuj formularz
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Ukryj komunikat po 3 sekundach
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  // Obsługa usuwania konta
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'USUŃ KONTO') {
      setPasswordError('Wpisz "USUŃ KONTO" aby potwierdzić');
      return;
    }
    
    // Tutaj kod do faktycznego usunięcia konta
    alert('Konto zostało usunięte');
    // Przekierowanie do strony głównej
    // window.location.href = '/';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
      {/* Nagłówek z gradientem */}
      <div className="bg-gradient-to-r from-[#35530A] to-[#5A7D2A] px-4 sm:px-6 py-5 flex items-center">
        <Lock size={24} className="text-white mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-white">Ustawienia bezpieczeństwa</h2>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Sekcja zmiany hasła */}
        <form onSubmit={handleChangePassword} className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Lock size={18} className="mr-2 text-[#35530A]" />
            Zmiana hasła
          </h3>
          <p className="text-gray-600 mb-6">Zaktualizuj swoje hasło dostępu</p>
          
          {/* Błąd formularza */}
          {passwordError && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
              <AlertTriangle size={18} className="text-red-500 mr-2 flex-shrink-0" />
              <p>{passwordError}</p>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Obecne hasło */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="currentPassword">
                Obecne hasło
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={passwordVisible.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Wprowadź obecne hasło"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none transition-colors"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#35530A] transition-colors"
                  onClick={() => togglePasswordVisibility('current')}
                  aria-label={passwordVisible.current ? 'Ukryj hasło' : 'Pokaż hasło'}
                >
                  {passwordVisible.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Nowe hasło */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">
                  Nowe hasło
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-[#35530A] flex items-center hover:underline"
                  onClick={() => setShowPasswordTips(!showPasswordTips)}
                >
                  <Info size={14} className="mr-1" />
                  Wymagania hasła
                </button>
              </div>
              
              {/* Wskazówki dotyczące hasła */}
              {showPasswordTips && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="font-medium text-sm mb-2 text-gray-700">Hasło musi zawierać:</p>
                  <ul className="space-y-1">
                    <PasswordRequirement 
                      met={passwordStrength.length} 
                      text="Co najmniej 8 znaków" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.uppercase} 
                      text="Co najmniej jedną wielką literę (A-Z)" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.lowercase} 
                      text="Co najmniej jedną małą literę (a-z)" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.number} 
                      text="Co najmniej jedną cyfrę (0-9)" 
                    />
                    <PasswordRequirement 
                      met={passwordStrength.special} 
                      text="Co najmniej jeden znak specjalny (!@#$%^&*)" 
                    />
                  </ul>
                </div>
              )}
              
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={passwordVisible.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={handleInputChange}
                  placeholder="Wprowadź nowe hasło"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none transition-colors"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#35530A] transition-colors"
                  onClick={() => togglePasswordVisibility('new')}
                  aria-label={passwordVisible.new ? 'Ukryj hasło' : 'Pokaż hasło'}
                >
                  {passwordVisible.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Wskaźnik siły hasła */}
              {passwordForm.newPassword && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthClass()} transition-all duration-300 ease-in-out`}
                      style={{ width: `${getPasswordStrengthScore() * 20}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    Siła hasła: {' '}
                    {getPasswordStrengthScore() === 0 && 'Nie podano'}
                    {getPasswordStrengthScore() === 1 && 'Bardzo słabe'}
                    {getPasswordStrengthScore() === 2 && 'Słabe'}
                    {getPasswordStrengthScore() === 3 && 'Średnie'}
                    {getPasswordStrengthScore() === 4 && 'Dobre'}
                    {getPasswordStrengthScore() === 5 && 'Silne'}
                  </p>
                </div>
              )}
            </div>

            {/* Potwierdź nowe hasło */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                Potwierdź nowe hasło
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={passwordVisible.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Potwierdź nowe hasło"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] focus:outline-none transition-colors"
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#35530A] transition-colors"
                  onClick={() => togglePasswordVisibility('confirm')}
                  aria-label={passwordVisible.confirm ? 'Ukryj hasło' : 'Pokaż hasło'}
                >
                  {passwordVisible.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Informacja o zgodności haseł */}
              {passwordForm.newPassword && passwordForm.confirmPassword && (
                <div className="mt-2 flex items-center">
                  {passwordForm.newPassword === passwordForm.confirmPassword ? (
                    <div className="text-green-600 text-sm flex items-center">
                      <Check size={16} className="mr-1" />
                      Hasła są zgodne
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm flex items-center">
                      <X size={16} className="mr-1" />
                      Hasła nie są zgodne
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

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
                  <span>Zmień hasło</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Niebezpieczna strefa */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6">
          <div className="flex items-start">
            <AlertTriangle size={24} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Niebezpieczna strefa</h3>
              <p className="text-red-600 mb-4">
                Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane, ogłoszenia i wiadomości 
                zostaną trwale usunięte z naszego systemu.
              </p>
              
              {showDeleteConfirm ? (
                <div className="space-y-4 p-4 bg-red-100 rounded-lg border border-red-300">
                  <p className="text-red-700 font-medium">
                    Aby potwierdzić, wpisz "USUŃ KONTO" w polu poniżej:
                  </p>
                  <input 
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full p-2 border border-red-300 rounded bg-white text-red-700"
                    placeholder="USUŃ KONTO"
                  />
                  <div className="flex space-x-3">
                    <button 
                      type="button"
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                    >
                      Potwierdzam usunięcie konta
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded hover:bg-red-200 transition-colors flex items-center"
                >
                  <Trash2 size={18} className="mr-2" />
                  Usuń konto
                </button>
              )}
            </div>
          </div>
        </div>
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
            <p className="font-medium">Hasło zostało zmienione</p>
            <p className="text-sm">Twoje hasło zostało zaktualizowane pomyślnie</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Komponent do wyświetlania wymagań hasła z ikonami statusu
 */
const PasswordRequirement = ({ met, text }) => (
  <li className="flex items-center text-xs">
    {met ? (
      <Check size={14} className="text-green-500 mr-1.5 flex-shrink-0" />
    ) : (
      <X size={14} className="text-red-500 mr-1.5 flex-shrink-0" />
    )}
    <span className={met ? 'text-green-700' : 'text-gray-600'}>
      {text}
    </span>
  </li>
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

export default SecurityPanel;