// src/components/auth/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEye, FaEyeSlash, FaInfoCircle, FaCheck, FaTimes, FaExclamationTriangle, FaSpinner, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api'; // Zmieniono import z axiosInstance na api

// Komponent modalu z powiadomieniem o sukcesie
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="bg-green-100 p-3 rounded-full mb-4">
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rejestracja zakończona pomyślnie!</h2>
        <p className="text-gray-600 mb-6">
          Twoje konto zostało utworzone. Możesz teraz się zalogować i korzystać 
          z pełnej funkcjonalności naszej platformy.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#35530A] hover:bg-[#2D4A06] text-white font-bold py-3 px-4 rounded uppercase transition-colors"
        >
          Przejdź do logowania
        </button>
      </div>
    </div>
  </div>
);

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Stan dla modalu sukcesu
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonePrefix: '+48',
    phone: '',
    dob: '',
    termsAccepted: false,
    marketingAccepted: false,
    dataProcessingAccepted: false,
    phoneCode: '',
    emailCode: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationTimers, setVerificationTimers] = useState({
    phone: 0,
    email: 0
  });
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  // Sprawdzenie siły hasła
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  // Sprawdzenie wieku (16–100 lat)
  const isValidAge = (dateString) => {
    const dob = new Date(dateString);
    if (isNaN(dob.getTime())) {
      return false;
    }
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 16 && age <= 100;
  };

  // Sprawdzanie, czy email już istnieje - realne sprawdzenie
  const checkEmailExists = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    
    setIsCheckingEmail(true);
    try {
      // Używa api zamiast axiosInstance
      const response = await api.checkEmailExists 
        ? api.checkEmailExists(email) 
        : { data: { exists: false } };
      
      if (response.data?.exists) {
        setErrors(prev => ({
          ...prev,
          email: 'Ten adres email jest już zarejestrowany w naszej bazie.'
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Błąd sprawdzania email:', error);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Sprawdzanie, czy numer telefonu już istnieje - realne sprawdzenie
  const checkPhoneExists = async (phone) => {
    if (!phone || phone.length < 9) return;
    
    // Upewnij się, że sprawdzamy pełny numer z prefiksem
    const fullPhone = `${formData.phonePrefix}${phone}`;
    setIsCheckingPhone(true);
    try {
      // Używa api zamiast axiosInstance
      const response = await api.checkPhoneExists 
        ? api.checkPhoneExists(fullPhone) 
        : { data: { exists: false } };
        
      if (response.data?.exists) {
        setErrors(prev => ({
          ...prev,
          phone: 'Ten numer telefonu jest już zarejestrowany w naszej bazie.'
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Błąd sprawdzania telefonu:', error);
      return false;
    } finally {
      setIsCheckingPhone(false);
    }
  };

  // Walidacja formularza (krok 1)
  const validateForm = async () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = 'Imię musi zawierać co najmniej 2 znaki.';
      }
      if (!formData.lastName || formData.lastName.length < 2) {
        newErrors.lastName = 'Nazwisko musi zawierać co najmniej 2 znaki.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Nieprawidłowy format email.';
      } else {
        // Sprawdź czy email już istnieje
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          newErrors.email = 'Ten adres email jest już zarejestrowany w naszej bazie.';
        }
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Hasło musi spełniać wszystkie wymienione kryteria.';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Hasła nie są takie same.';
      }
      
      // Poprawiona walidacja telefonu - dokładnie 9 cyfr dla polskiego numeru
      const phoneRegex = /^[0-9]{9}$/; 
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Numer telefonu powinien zawierać dokładnie 9 cyfr (bez prefiksu).';
      } else {
        // Sprawdź czy telefon już istnieje
        const phoneExists = await checkPhoneExists(formData.phone);
        if (phoneExists) {
          newErrors.phone = 'Ten numer telefonu jest już zarejestrowany w naszej bazie.';
        }
      }
      
      // Poprawiona walidacja daty urodzenia
      if (!formData.dob) {
        newErrors.dob = 'Data urodzenia jest wymagana.';
      } else {
        const dobDate = new Date(formData.dob);
        
        // Sprawdź czy data jest poprawna
        if (isNaN(dobDate.getTime())) {
          newErrors.dob = 'Nieprawidłowy format daty urodzenia.';
        } else {
          const today = new Date();
          if (dobDate >= today) {
            newErrors.dob = 'Data urodzenia musi być z przeszłości.';
          } else if (!isValidAge(formData.dob)) {
            newErrors.dob = 'Musisz mieć co najmniej 16 lat i maks. 100 lat, aby się zarejestrować.';
          }
        }
      }
      
      if (!formData.termsAccepted || !formData.dataProcessingAccepted) {
        newErrors.agreements = 'Musisz zaakceptować regulamin i zgodę na przetwarzanie danych.';
      }
    }
    return newErrors;
  };

  // Obsługa zmiany w polach
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Sprawdzanie email i telefonu podczas wpisywania
    if (name === 'email' && value && value.includes('@')) {
      const timeoutId = setTimeout(() => {
        checkEmailExists(value);
      }, 800);
      return () => clearTimeout(timeoutId);
    }
    
    if (name === 'phone' && value.length >= 9) {
      const timeoutId = setTimeout(() => {
        checkPhoneExists(value);
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  };

  // Obsługa utraty focusu
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email' && value) {
      checkEmailExists(value);
    }
    
    if (name === 'phone' && value) {
      checkPhoneExists(value);
    }
  };

  // Pokaż/ukryj hasło
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Licznik do ponownego wysłania kodu
  const startVerificationTimer = (type) => {
    setVerificationTimers((prev) => ({ ...prev, [type]: 60 }));
    const timer = setInterval(() => {
      setVerificationTimers((prevState) => {
        const newTime = prevState[type] - 1;
        if (newTime <= 0) {
          clearInterval(timer);
        }
        return { ...prevState, [type]: Math.max(0, newTime) };
      });
    }, 1000);
  };

  // Wysyłanie kodu (SYMULACJA)
  const handleSendVerificationCode = async (type) => {
    try {
      console.log(`Symulacja wysyłania kodu weryfikacyjnego na ${type === 'phone' ? formData.phone : formData.email}`);
      
      // Symulacja opóźnienia sieciowego
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Symulacja kodu
      const mockCode = '123456';
      console.log(`Wygenerowany kod: ${mockCode}`);
      startVerificationTimer(type);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [type]: error.message || 'Błąd wysyłania kodu weryfikacyjnego'
      }));
    }
  };

  // Weryfikacja kodu (poprzez API)
  const handleVerifyCode = async (type) => {
    try {
      console.log(`Weryfikacja kodu ${type}: ${formData[`${type}Code`]}`);
      setIsSubmitting(true);
      
      // Wywołanie API zamiast symulacji
      const response = await api.verifyCode(
        formData.email,
        formData[`${type}Code`],
        type
      );
      
      console.log('Odpowiedź z weryfikacji kodu:', response);
      
      if (response.verified) {
        if (type === 'email') {
          // Sukces -> finalny submit
          await handleFinalSubmit();
        } else if (type === 'phone') {
          // Przejście do weryfikacji email
          setStep(3);
          await handleSendVerificationCode('email');
        }
      } else {
        throw new Error(response.message || `Nieprawidłowy kod ${type}`);
      }
    } catch (error) {
      console.error(`Błąd weryfikacji ${type}:`, error);
      setErrors((prev) => ({
        ...prev,
        [`${type}Code`]: error.message || 'Nieprawidłowy kod'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ostateczna rejestracja - RZECZYWISTE DODANIE UŻYTKOWNIKA
  const handleFinalSubmit = async () => {
    try {
      // Sprawdź czy numer telefonu ma prawidłowy format
      if (formData.phonePrefix === '+48' && formData.phone.length !== 9) {
        setErrors({
          general: 'Polski numer telefonu musi zawierać dokładnie 9 cyfr (bez prefiksu).'
        });
        return;
      }
      
      // Poprawne formatowanie daty urodzenia
      const dobDate = new Date(formData.dob);
      let formattedDob = formData.dob;
      
      // Upewnij się, że data jest prawidłowa
      if (!isNaN(dobDate.getTime())) {
        formattedDob = dobDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
      }
      
      // Pełny numer telefonu z prefiksem
      const fullPhoneNumber = `${formData.phonePrefix}${formData.phone}`;
      
      console.log('Rejestracja - dane wysyłane do backendu:', {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhoneNumber,
        dob: formattedDob,
        marketingAccepted: formData.marketingAccepted
      });
      
      // RZECZYWISTA REJESTRACJA - używamy api zamiast axiosInstance
      const response = await api.register({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhoneNumber, // Pełny numer z prefiksem
        password: formData.password,
        dob: formattedDob, // Sformatowana data
        marketingAccepted: formData.marketingAccepted
      });
      
      console.log('Odpowiedź z backendu (rejestracja):', response);
      
      // Pokaż komunikat o sukcesie
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Błąd rejestracji (finalSubmit):', error);
      console.error('Szczegóły błędu:', error.response?.data || error.message);
      
      // Obsługa specyficznych błędów z backendu
      if (error.response?.data?.message?.includes('email już istnieje')) {
        setErrors({
          general: 'Użytkownik o tym adresie email już istnieje w systemie.'
        });
      } else if (error.response?.data?.message?.includes('telefon już istnieje')) {
        setErrors({
          general: 'Ten numer telefonu jest już przypisany do innego konta.'
        });
      } else {
        setErrors({
          general: error.response?.data?.message || error.message || 'Błąd podczas rejestracji. Spróbuj ponownie.'
        });
      }
    }
  };

  // Obsługa zamknięcia modalu sukcesu
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login'); // Przekieruj do strony logowania
  };

  // Submit główny (krok 1->2->3)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validationErrors = await validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        const firstErrorField = Object.keys(validationErrors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
        setIsSubmitting(false);
        return;
      }

      if (step === 1) {
        setStep(2);
        await handleSendVerificationCode('phone');
      } else if (step === 2) {
        await handleVerifyCode('phone');
      } else if (step === 3) {
        await handleVerifyCode('email');
      }
    } catch (error) {
      console.error('Błąd przetwarzania formularza:', error);
      setErrors({ general: error.message || 'Wystąpił błąd. Spróbuj ponownie.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render błędów dla pojedynczego pola
  const renderError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaTimes className="mr-1" /> {errors[fieldName]}
        </p>
      );
    }
    return null;
  };

  // Pasek siły hasła
  const getPasswordStrengthClass = () => {
    const { length, uppercase, lowercase, number, special } = passwordStrength;
    const strength = [length, uppercase, lowercase, number, special].filter(Boolean).length;
    if (strength === 0) return '';
    if (strength < 3) return 'bg-red-500';
    if (strength < 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Render kroków weryfikacji
  const renderVerificationStep = (type) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Weryfikacja {type === 'phone' ? 'numeru telefonu' : 'adresu email'}
        </h3>
        <p className="text-gray-600 mb-4">
          Wprowadź kod weryfikacyjny wysłany na{' '}
          {type === 'phone' ? `${formData.phonePrefix}${formData.phone}` : formData.email}
        </p>
        <div className="bg-blue-50 p-3 rounded text-blue-800 mb-4 text-sm">
          <p className="font-medium flex items-center">
            <FaInfoCircle className="mr-2" /> Uwaga:
          </p>
          <p>
            W trybie testowym, użyj kodu <span className="font-bold">123456</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          name={`${type}Code`}
          value={formData[`${type}Code`]}
          onChange={handleInputChange}
          placeholder="Wprowadź kod"
          className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
          maxLength="6"
        />
        {renderError(`${type}Code`)}

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleSendVerificationCode(type)}
            disabled={verificationTimers[type] > 0 || isSubmitting}
            className="text-[#35530A] hover:text-[#2D4A06] font-medium disabled:text-gray-400"
          >
            {verificationTimers[type] > 0
              ? `Wyślij ponownie (${verificationTimers[type]}s)`
              : 'Wyślij ponownie kod'}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="w-1/3 border border-[#35530A] text-[#35530A] hover:bg-gray-50 font-bold py-3 px-4 rounded uppercase transition-colors"
        >
          Wstecz
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-2/3 bg-[#35530A] hover:bg-[#2D4A06] text-white font-bold py-3 px-4 rounded uppercase transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Weryfikacja...' : 'Weryfikuj'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-8 bg-white rounded shadow-xl mx-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-[#35530A] uppercase">
            {step === 1
              ? 'Zarejestruj się'
              : step === 2
              ? 'Weryfikacja telefonu'
              : 'Weryfikacja email'}
          </h2>
          {step > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#35530A]' : 'bg-gray-300'}`} />
              <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#35530A]' : 'bg-gray-300'}`} />
              <span className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-[#35530A]' : 'bg-gray-300'}`} />
            </div>
          )}
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
            <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              {/* Pola formularza (Krok 1) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Imię */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
                    Imię *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                    required
                  />
                  {renderError('name')}
                </div>

                {/* Nazwisko */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
                    Nazwisko *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                    required
                  />
                  {renderError('lastName')}
                </div>
              </div>

              {/* Data urodzenia */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
                  Data urodzenia * (musisz mieć 16-100 lat)
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                  required
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                />
                {renderError('dob')}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                    required
                  />
                  {isCheckingEmail && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FaSpinner className="h-5 w-5 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
                {renderError('email')}
              </div>

              {/* Numer telefonu (prefix + phone) */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
                  Numer telefonu *
                </label>
                <div className="flex">
                  <div className="w-1/4 mr-2">
                    <select
                      name="phonePrefix"
                      value={formData.phonePrefix}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                    >
                      <option value="+48">+48 (Polska)</option>
                      <option value="+49">+49 (Niemcy)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+1">+1 (USA/Kanada)</option>
                      <option value="+33">+33 (Francja)</option>
                      <option value="+39">+39 (Włochy)</option>
                      <option value="+34">+34 (Hiszpania)</option>
                    </select>
                  </div>
                  <div className="w-3/4 relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                      placeholder="np. 123456789 (bez prefiksu)"
                      required
                      maxLength={formData.phonePrefix === '+48' ? 9 : 14}
                    />
                    {isCheckingPhone && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FaSpinner className="h-5 w-5 text-gray400 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
                {renderError('phone')}
              </div>

              {/* Hasło */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
                    Hasło *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordInfo(!showPasswordInfo)}
                    className="text-sm text-[#35530A] hover:underline flex items-center"
                  >
                    <FaInfoCircle className="mr-1" /> Wymagania</button>
               </div>

               {showPasswordInfo && (
                 <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded">
                   <p className="text-sm font-medium mb-2">Hasło musi zawierać:</p>
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
                       Przynajmniej jeden znak specjalny <strong>(!@#$%^&amp;*(),.?&quot;:{}|&lt;&gt;)</strong>
                     </li>
                   </ul>
                 </div>
               )}

               <div className="relative">
                 <input
                   type={showPassword ? 'text' : 'password'}
                   name="password"
                   value={formData.password}
                   onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => togglePasswordVisibility('password')}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
                 >
                   {showPassword ? <FaEyeSlash /> : <FaEye />}
                 </button>
               </div>

               {/* Pasek siły hasła */}
               {formData.password && (
                 <div className="mt-2">
                   <div className="h-2 bg-gray-200 rounded-full mt-2">
                     <div
                       className={`h-full rounded-full ${getPasswordStrengthClass()}`}
                       style={{
                         width: `${Object.values(passwordStrength).filter(Boolean).length * 20}%`
                       }}
                     ></div>
                   </div>
                 </div>
               )}
               {renderError('password')}
             </div>

             {/* Potwierdzenie hasła */}
             <div>
               <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase">
                 Potwierdź hasło *
               </label>
               <div className="relative">
                 <input
                   type={showConfirmPassword ? 'text' : 'password'}
                   name="confirmPassword"
                   value={formData.confirmPassword}
                   onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => togglePasswordVisibility('confirmPassword')}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
                 >
                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                 </button>
               </div>
               {formData.password && formData.confirmPassword && (
                 <div className="mt-2 flex items-center">
                   {formData.password === formData.confirmPassword ? (
                     <>
                       <FaCheck className="text-green-500 mr-2" />
                       <span className="text-sm text-green-500">Hasła są zgodne</span>
                     </>
                   ) : (
                     <>
                       <FaTimes className="text-red-500 mr-2" />
                       <span className="text-sm text-red-500">Hasła nie są zgodne</span>
                     </>
                   )}
                 </div>
               )}
               {renderError('confirmPassword')}
             </div>

             {/* CHECKBOXY */}
             <div className="space-y-4 border-t pt-6">
               <div className="flex items-start">
                 <div className="flex items-center h-5">
                   <input
                     type="checkbox"
                     name="termsAccepted"
                     checked={formData.termsAccepted}
                     onChange={handleInputChange}
                     className="h-5 w-5 text-[#35530A] border-gray-300 rounded focus:ring-[#35530A]"
                     required
                   />
                 </div>
                 <label className="ml-3 text-sm text-gray-700">
                   * Oświadczam, że zapoznałem się z{' '}
                   <a href="/regulamin" className="text-[#35530A] hover:text-[#2D4A06] font-medium">
                     regulaminem
                   </a>{' '}
                   i akceptuję jego postanowienia
                 </label>
               </div>

               <div className="flex items-start">
                 <div className="flex items-center h-5">
                   <input
                     type="checkbox"
                     name="dataProcessingAccepted"
                     checked={formData.dataProcessingAccepted}
                     onChange={handleInputChange}
                     className="h-5 w-5 text-[#35530A] border-gray-300 rounded focus:ring-[#35530A]"
                     required
                   />
                 </div>
                 <label className="ml-3 text-sm text-gray-700">
                   * Wyrażam zgodę na przetwarzanie moich danych osobowych
                   zgodnie z{' '}
                   <a href="/polityka-prywatnosci" className="text-[#35530A] hover:text-[#2D4A06] font-medium">
                     polityką prywatności
                   </a>
                 </label>
               </div>

               <div className="flex items-start">
                 <div className="flex items-center h-5">
                   <input
                     type="checkbox"
                     name="marketingAccepted"
                     checked={formData.marketingAccepted}
                     onChange={handleInputChange}
                     className="h-5 w-5 text-[#35530A] border-gray-300 rounded focus:ring-[#35530A]"
                   />
                 </div>
                 <label className="ml-3 text-sm text-gray-700">
                   Wyrażam zgodę na otrzymywanie informacji marketingowych i handlowych drogą elektroniczną
                 </label>
               </div>
               {renderError('agreements')}
             </div>

             <button
               type="submit"
               disabled={isSubmitting || isCheckingEmail || isCheckingPhone}
               className="w-full bg-[#35530A] hover:bg-[#2D4A06] text-white font-bold py-3 px-4 rounded uppercase transition-colors disabled:opacity-50 flex items-center justify-center"
             >
               {isSubmitting ? (
                 <>
                   <FaSpinner className="animate-spin mr-2" /> Przetwarzanie...
                 </>
               ) : (
                 'Dalej'
               )}
             </button>
           </>
         )}

         {step === 2 && renderVerificationStep('phone')}
         {step === 3 && renderVerificationStep('email')}

         {step === 1 && (
           <div className="mt-6 text-center">
             <p className="text-sm text-gray-600">
               Masz już konto?{' '}
               <Link to="/login" className="text-[#35530A] hover:text-[#2D4A06] font-medium uppercase">
                 Zaloguj się
               </Link>
             </p>
           </div>
         )}
       </form>
     </div>

     {/* Modal powodzenia */}
     {showSuccessModal && <SuccessModal onClose={handleSuccessModalClose} />}
   </div>
 );
}

export default Register;