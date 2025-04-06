import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUser, FaLock, FaPhone, FaBell, FaShieldAlt, FaTrash, 
  FaExclamationTriangle, FaCheckCircle, FaEnvelope, FaMapMarkedAlt, 
  FaInfoCircle, FaCheck, FaTimes, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import api from '../../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  
  // Inicjalizacja formData z danymi użytkownika
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phonePrefix: '+48', // Dodane pole prefiksu telefonu
    phoneNumber: '',
    dob: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    isEmailVerified: true,
    isPhoneVerified: true,
  });
  
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [missingFields, setMissingFields] = useState([]);
  const [activeTab, setActiveTab] = useState('userData');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [verificationData, setVerificationData] = useState({
    showModal: false,
    type: '',
    step: 1,
    code1: '',
    code2: '',
    tempValue: '',
  });

  // Stan dla siły hasła
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Stan dla powiadomień
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    newsletter: true,
  });

  // Stan dla prywatności
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    personalizedAds: true,
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };
  
  // Funkcja do sprawdzenia wieku
  const isValidAge = (dateString) => {
    const dob = new Date(dateString);
    const today = new Date();
    
    // Oblicz wiek
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    // Jeśli nie mamy jeszcze urodzin w tym roku, odejmij 1 rok
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    // Sprawdź czy wiek jest między 16 a 100 lat
    return age >= 16 && age <= 100;
  };
  
  // Aktualizacja danych formularza po załadowaniu danych użytkownika
  useEffect(() => {
    if (user) {
      console.log('Settings - dane użytkownika:', user);
      
      // Wypełnij formularz dostępnymi danymi
      const fullPhone = user.phoneNumber || user.phone || '';
      let phonePrefix = '+48';
      let phoneNumber = fullPhone;
      
      // Sprawdź czy numer telefonu zawiera prefiks
      if (fullPhone.startsWith('+')) {
        // Wytnij prefiks (pierwsze 2-3 znaki z plusem)
        const prefixMatch = fullPhone.match(/^(\+\d{1,3})/);
        if (prefixMatch) {
          phonePrefix = prefixMatch[0];
          phoneNumber = fullPhone.substring(prefixMatch[0].length);
        }
      }
      
      setFormData({
        firstName: user.firstName || user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phonePrefix: phonePrefix,
        phoneNumber: phoneNumber,
        dob: formatDate(user.dob) || '',
        street: user.street || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || 'Polska',
        isEmailVerified: true,
        isPhoneVerified: true,
      });
      
      // Sprawdź czy profil jest kompletny
      checkProfileCompleteness(user);
    }
  }, [user]);
  
  // Funkcja formatująca datę
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };
  
  // Funkcja sprawdzająca kompletność profilu
  const checkProfileCompleteness = (userData) => {
    const requiredFields = [
      { name: 'firstName', label: 'Imię' },
      { name: 'lastName', label: 'Nazwisko' },
      { name: 'phoneNumber', label: 'Numer telefonu' },
      { name: 'email', label: 'Email' }
    ];
    
    const missing = requiredFields.filter(field => {
      if (field.name === 'phoneNumber') {
        return !userData[field.name] && !userData.phone;
      }
      return !userData[field.name] && !userData.name;
    });
    
    setMissingFields(missing);
    setIsProfileComplete(missing.length === 0);
    
    // Sprawdź sposób rejestracji
    if (userData.registrationType === 'google' || userData.registrationType === 'facebook') {
      console.log('Użytkownik zalogowany przez zewnętrzny serwis - może brakować danych');
    }
  };
  
  // Ukryj alert po 3 sekundach
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    
    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'oldPassword') {
      setShowPassword(!showPassword);
    } else if (field === 'newPassword' || field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Przygotuj dane do wysłania - łącząc prefiks z numerem telefonu
      const submitData = {
        ...formData,
        phoneNumber: `${formData.phonePrefix}${formData.phoneNumber}` // Połączony prefiks z numerem
      };
      
      // W rzeczywistej aplikacji - wysłanie danych do API
      console.log('Zapisuję dane użytkownika:', submitData);
      // const response = await api.put('/user/profile', submitData);
      
      // Symulacja zapisywania danych
      await simulateAPI();
      
      // Aktualizacja danych użytkownika w kontekście
      if (typeof updateUser === 'function') {
        updateUser({
          ...user,
          phoneNumber: submitData.phoneNumber, // Zaktualizowany pełny numer z prefiksem
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          profileCompleted: true
        });
      }
      
      showAlert('Dane zostały zaktualizowane', 'success');
    } catch (error) {
      console.error('Błąd zapisywania danych:', error);
      showAlert('Wystąpił błąd podczas zapisywania danych', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert('Hasła nie są identyczne', 'error');
      return;
    }
    if (!isStrongPassword(passwordForm.newPassword)) {
      showAlert('Hasło musi zawierać min. 8 znaków, w tym wielką i małą literę, cyfrę i znak specjalny', 'error');
      return;
    }
    startVerificationProcess('password');
  };

  const startVerificationProcess = (type) => {
    setVerificationData({
      showModal: true,
      type,
      step: 1,
      code1: '',
      code2: '',
      tempValue: type === 'email' 
        ? formData.email 
        : type === 'phone' 
          ? `${formData.phonePrefix}${formData.phoneNumber}` // Połączony prefiks z numerem
          : '',
    });
  };

  const handleVerification = async () => {
    if (verificationData.step === 1) {
      // Symulacja wysyłki kodów
      await simulateAPI();
      setVerificationData({ ...verificationData, step: 2 });
    } else {
      // Symulacja weryfikacji
      await simulateAPI();
      if (verificationData.type === 'email') {
        setFormData({ ...formData, isEmailVerified: true });
        if (typeof updateUser === 'function') {
          updateUser({ ...user, isEmailVerified: true });
        }
      }
      if (verificationData.type === 'phone') {
        setFormData({ ...formData, isPhoneVerified: true });
        if (typeof updateUser === 'function') {
          updateUser({ ...user, isPhoneVerified: true });
        }
      }
      if (verificationData.type === 'password') {
        showAlert('Hasło zostało zmienione', 'success');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
      closeVerificationModal();
    }
  };

  const closeVerificationModal = () => {
    setVerificationData({
      showModal: false,
      type: '',
      step: 1,
      code1: '',
      code2: '',
      tempValue: '',
    });
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  };

  const simulateAPI = () => new Promise(resolve => setTimeout(resolve, 1000));

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(password);
  };

  const getPasswordStrengthClass = () => {
    const { length, uppercase, lowercase, number, special } = passwordStrength;
    const strength = [length, uppercase, lowercase, number, special].filter(Boolean).length;
    if (strength === 0) return '';
    if (strength < 3) return 'bg-red-500';
    if (strength < 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Komunikat o niekompletnym profilu */}
      {!isProfileComplete && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded">
          <div className="flex">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <p className="font-medium">Uzupełnij swój profil</p>
              <p className="text-sm">
                Prosimy o uzupełnienie brakujących danych:
                {missingFields.map(field => ` ${field.label}`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    
      {/* Alerty */}
      {alert.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg flex items-center 
          ${alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {alert.type === 'success' ? (
            <FaCheckCircle className="w-5 h-5 mr-2 text-green-600" />
          ) : (
            <FaExclamationTriangle className="w-5 h-5 mr-2 text-red-600" />
          )}
          <span className="text-sm">{alert.message}</span>
        </div>
      )}

      {/* Nagłówek */}
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Ustawienia konta</h1>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Panel nawigacji */}
        <aside className="lg:col-span-3 mb-8 lg:mb-0">
          <nav className="space-y-1">
            {[
              { name: 'Dane użytkownika', icon: FaUser, tab: 'userData' },
              { name: 'Bezpieczeństwo', icon: FaLock, tab: 'accountSettings' },
              { name: 'Powiadomienia', icon: FaBell, tab: 'notifications' },
              { name: 'Prywatność', icon: FaShieldAlt, tab: 'privacy' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full group flex items-center px-4 py-3 rounded-lg transition-colors
                  ${activeTab === item.tab 
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon className={`mr-3 flex-shrink-0 ${activeTab === item.tab ? 'text-green-500' : 'text-gray-400'}`} />
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Główna zawartość */}
        <main className="lg:col-span-9 space-y-8">
          {/* Sekcja danych użytkownika */}
          {activeTab === 'userData' && (
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaUser className="mr-2 text-green-600" />
                  Profil użytkownika
                </h2>
                <p className="mt-1 text-sm text-gray-500">Zarządzaj swoimi podstawowymi informacjami</p>
              </div>

              {/* Informacja o niemożliwości zmiany kluczowych danych */}
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 rounded">
                <div className="flex">
                  <FaInfoCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Dane kluczowe</p>
                    <p className="text-sm">
                      Imię, nazwisko, data urodzenia oraz dane kontaktowe zostały zweryfikowane podczas rejestracji.
                      Te dane nie mogą być zmienione. Jeśli potrzebujesz wprowadzić korektę,
                      skontaktuj się z administratorem.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imię - disabled */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imię *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>

                {/* Nazwisko - disabled */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>

                {/* Data urodzenia - disabled */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data urodzenia *</label>
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob || 'Nie określono'}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>

                {/* Email - zweryfikowany */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                    />
                    <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md">
                      <FaCheckCircle className="mr-2" /> Zweryfikowany
                    </div>
                  </div>
                </div>

                {/* Telefon - zweryfikowany */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numer telefonu</label>
                  <div className="flex gap-2">
                    <div className="flex flex-1">
                      <span className="inline-flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-md text-gray-500">
                        {formData.phonePrefix}
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        disabled
                        className="flex-1 px-4 py-2 bg-gray-100 border-l-0 border border-gray-300 rounded-r-md cursor-not-allowed"
                      />
                    </div>
                    <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md">
                      <FaCheckCircle className="mr-2" /> Zweryfikowany
                    </div>
                  </div>
                </div>

                {/* Adres - można edytować */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ulica</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miasto</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kod pocztowy</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kraj</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white 
                    ${isSaving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
              </div>
            </form>
          )}

          {/* Sekcja bezpieczeństwa */}
          {activeTab === 'accountSettings' && (
            <div className="space-y-8">
              <form onSubmit={handlePasswordSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FaLock className="mr-2 text-green-600" />
                    Zmiana hasła
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">Zaktualizuj swoje hasło dostępu</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Obecne hasło</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('oldPassword')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nowe hasło</label>
                      <button
                        type="button"
                        onClick={() => setShowPasswordInfo(!showPasswordInfo)}
                        className="text-sm text-green-600 hover:underline flex items-center"
                      >
                        <FaInfoCircle className="mr-1" /> Wymagania
                      </button>
                    </div>
                    
                    {showPasswordInfo && (
                      <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm font-medium mb-2">
                          Hasło musi zawierać:
                        </p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center">
                            {passwordStrength.length ? (
                              <FaCheck className="text-green-500 mr-2" />
                            ) : (
                              <FaTimes className="text-red-500 mr-2" />
                            )}
                            Co najmniej 8 znaków
                          </li>
                          <li className="flex items-center">
                            {passwordStrength.uppercase ? (
                              <FaCheck className="text-green-500 mr-2" />
                            ) : (
                              <FaTimes className="text-red-500 mr-2" />
                            )}
                            Przynajmniej jedną wielką literę
                          </li>
                          <li className="flex items-center">
                            {passwordStrength.lowercase ? (
                              <FaCheck className="text-green-500 mr-2" />
                            ) : (
                              <FaTimes className="text-red-500 mr-2" />
                            )}
                            Przynajmniej jedną małą literę
                          </li>
                          <li className="flex items-center">
                            {passwordStrength.number ? (
                              <FaCheck className="text-green-500 mr-2" />
                            ) : (
                              <FaTimes className="text-red-500 mr-2" />
                            )}
                            Przynajmniej jedną cyfrę
                          </li>
                          <li className="flex items-center">
                            {passwordStrength.special ? (
                              <FaCheck className="text-green-500 mr-2" />
                            ) : (
                              <FaTimes className="text-red-500 mr-2" />
                            )}
                            Przynajmniej jeden znak specjalny (!@#$%^&*(),.?":{}|&lt;&gt;)
                          </li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('newPassword')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    
                    {passwordForm.newPassword && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full mt-2">
                          <div
                            className={`h-full rounded-full ${getPasswordStrengthClass()}`}
                            style={{
                              width: `${
                                Object.values(passwordStrength).filter(Boolean).length * 20
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Potwierdź nowe hasło</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordForm.newPassword && passwordForm.confirmPassword && (
                      <div className="mt-2 flex items-center">
                        {passwordForm.newPassword === passwordForm.confirmPassword ? (
                          <>
                            <FaCheck className="text-green-500 mr-2" />
                            <span className="text-sm text-green-500">
                              Hasła są zgodne
                            </span>
                          </>
                        ) : (
                          <>
                            <FaTimes className="text-red-500 mr-2" />
                            <span className="text-sm text-red-500">
                              Hasła nie są zgodne
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Zmień hasło
                  </button>
                </div>
              </form>

              {/* Sekcja niebezpieczna */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start">
                  <FaExclamationTriangle className="flex-shrink-0 h-6 w-6 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-red-800">Niebezpieczna strefa</h3>
                    <p className="mt-1 text-sm text-red-700">
                      Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <FaTrash className="mr-2 h-4 w-4" />
                        Usuń konto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sekcja powiadomień */}
          {activeTab === 'notifications' && (
            <form className="bg-white shadow rounded-lg p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaBell className="mr-2 text-green-600" />
                  Ustawienia powiadomień
                </h2>
                <p className="mt-1 text-sm text-gray-500">Dostosuj sposób otrzymywania powiadomień</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Powiadomienia email</h3>
                    <p className="text-sm text-gray-500">Ważne aktualizacje i informacje</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Powiadomienia SMS</h3>
                    <p className="text-sm text-gray-500">Pilne informacje i alerty</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
                    <p className="text-sm text-gray-500">Promocje i aktualności</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Zapisz zmiany
                </button>
              </div>
            </form>
          )}

          {/* Sekcja prywatności */}
          {activeTab === 'privacy' && (
            <form className="bg-white shadow rounded-lg p-6">
              <div className="mb-8">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaShieldAlt className="mr-2 text-green-600" />
                  Ustawienia prywatności
                </h2>
                <p className="mt-1 text-sm text-gray-500">Zarządzaj swoją prywatnością i udostępnianiem danych</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Profil publiczny</h3>
                    <p className="text-sm text-gray-500">Udostępniaj swój profil innym użytkownikom</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={privacy.profileVisibility === 'public'}
                      onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.checked ? 'public' : 'private' })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Udostępnianie danych</h3>
                    <p className="text-sm text-gray-500">Zgoda na udostępnianie danych partnerom</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={privacy.dataSharing}
                      onChange={(e) => setPrivacy({ ...privacy, dataSharing: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Spersonalizowane reklamy</h3>
                    <p className="text-sm text-gray-500">Dopasowane rekomendacje i oferty</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={privacy.personalizedAds}
                      onChange={(e) => setPrivacy({ ...privacy, personalizedAds: e.target.checked })}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Zapisz zmiany
                </button>
              </div>
            </form>
          )}

          {/* Modale */}
          {verificationData.showModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>

                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      {verificationData.type === 'email' ? (
                        <FaEnvelope className="h-6 w-6 text-green-600" />
                      ) : verificationData.type === 'phone' ? (
                        <FaPhone className="h-6 w-6 text-green-600" />
                      ) : (
                        <FaLock className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {verificationData.step === 1 
                          ? `Weryfikacja ${verificationData.type === 'email' ? 'adresu email' : verificationData.type === 'phone' ? 'numeru telefonu' : 'zmiany hasła'}`
                          : 'Wprowadź kod weryfikacyjny'}
                      </h3>
                      <div className="mt-2">
                        {verificationData.step === 1 ? (
                          <div>
                            <p className="text-sm text-gray-500">
                              {verificationData.type === 'email' 
                                ? 'Wyślemy kod weryfikacyjny na podany adres email.'
                                : verificationData.type === 'phone'
                                ? 'Wyślemy kod weryfikacyjny SMS na podany numer telefonu.'
                                : 'Wyślemy kod weryfikacyjny aby potwierdzić zmianę hasła.'}
                            </p>
                            <div className="mt-4">
                              <input
                                type={verificationData.type === 'email' ? 'email' : 'tel'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                value={verificationData.tempValue}
                                disabled={true}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-500 mb-4">
                              Wprowadź 6-cyfrowy kod, który wysłaliśmy na Twój {verificationData.type === 'email' ? 'adres email' : 'numer telefonu'}.
                            </p>
                            <div className="flex justify-center space-x-2">
                              <input
                                type="text"
                                maxLength="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-center tracking-widest"
                                value={verificationData.code1}
                                onChange={(e) => setVerificationData({...verificationData, code1: e.target.value})}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                      onClick={handleVerification}
                    >
                      {verificationData.step === 1 ? 'Wyślij kod' : 'Zweryfikuj'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={closeVerificationModal}
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal usunięcia konta */}
          {showDeleteModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
                
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Czy na pewno chcesz usunąć konto?
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną trwale usunięte z naszych serwerów.
                          Nie będziesz mógł/mogła odzyskać swojego konta ani żadnych danych po tej operacji.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                      onClick={() => {
                        // W rzeczywistej aplikacji - wywołanie API do usunięcia konta
                        console.log('Usuwanie konta użytkownika');
                        setShowDeleteModal(false);
                        showAlert('Twoje konto zostało usunięte', 'success');
                        // Przekierowanie do strony głównej po usunięciu konta
                        // navigate('/');
                      }}
                    >
                      Usuń konto
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Style dla przełączników */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #22c55e;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #22c55e;
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .slider.round {
          border-radius: 34px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Settings;