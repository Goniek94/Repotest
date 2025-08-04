// src/components/auth/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaExclamationTriangle, FaSpinner, FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { debug } from '../../utils/debug';

// Import modular components
import InputText from './InputText';
import InputPassword from './InputPassword';
import PasswordStrength from './PasswordStrength';
import PhoneSection from './PhoneSection';
import EmailSection from './EmailSection';
import DatePicker from './DatePicker';
import TermsCheckboxes from './TermsCheckboxes';
import VerificationStep from './VerificationStep';

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
    confirmEmail: '',
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

  // Stany dla weryfikacji kodów
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeVerified, setPhoneCodeVerified] = useState(false);
  const [emailCodeVerified, setEmailCodeVerified] = useState(false);
  const [sendingPhoneCode, setSendingPhoneCode] = useState(false);
  const [sendingEmailCode, setSendingEmailCode] = useState(false);

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
      const response = await api.checkEmailExists(email);
      
      if (response.exists) {
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
      const response = await api.checkPhoneExists(fullPhone);
        
      if (response.exists) {
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
      
      // Walidacja potwierdzenia emaila
      if (!formData.confirmEmail) {
        newErrors.confirmEmail = 'Potwierdzenie emaila jest wymagane.';
      } else if (formData.email !== formData.confirmEmail) {
        newErrors.confirmEmail = 'Adresy email nie są identyczne.';
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
    
    // Sprawdzanie kodów weryfikacyjnych w czasie rzeczywistym
    if (name === 'phoneCode' && value === '123456') {
      setPhoneCodeVerified(true);
      setErrors((prev) => ({ ...prev, phoneCode: '' }));
    } else if (name === 'phoneCode') {
      setPhoneCodeVerified(false);
    }
    
    if (name === 'emailCode' && value === '123456') {
      setEmailCodeVerified(true);
      setErrors((prev) => ({ ...prev, emailCode: '' }));
    } else if (name === 'emailCode') {
      setEmailCodeVerified(false);
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

  // SYMULACJA: Wysyłanie linku weryfikacyjnego email lub kodu SMS
  const handleSendVerificationCode = async (type) => {
    try {
      debug(`🎭 SYMULACJA: Wysyłanie ${type === 'phone' ? 'kodu SMS' : 'linku weryfikacyjnego'} na ${type === 'phone' ? formData.phone : formData.email}`);
      
      let response;
      if (type === 'email') {
        // SYMULACJA: Automatyczna weryfikacja email
        response = await api.simulateEmailVerification(formData.email);
        
        if (response.success) {
          // Automatycznie oznacz email jako zweryfikowany
          setEmailCodeVerified(true);
          setEmailCodeSent(true);
          setErrors((prev) => ({ ...prev, email: '' }));
          
          // Pokaż komunikat o symulacji
          alert('🎭 SYMULACJA: Adres e-mail zweryfikowany automatycznie!');
          
          return;
        }
      } else if (type === 'phone') {
        // SYMULACJA: Wysłanie kodu SMS
        const fullPhone = `${formData.phonePrefix}${formData.phone}`;
        response = await api.simulateSMSCode(fullPhone);
        
        if (response.success) {
          setPhoneCodeSent(true);
          startVerificationTimer(type);
          
          // Pokaż komunikat o symulacji
          alert(`🎭 SYMULACJA: Kod SMS wysłany! Wpisz kod: ${response.devCode || '123456'} aby zweryfikować telefon.`);
          
          return;
        }
      }
      
      throw new Error(response?.message || `Błąd symulacji ${type === 'phone' ? 'SMS' : 'email'}`);
    } catch (error) {
      console.error(`🎭 SYMULACJA: Błąd ${type === 'phone' ? 'SMS' : 'email'}:`, error);
      setErrors((prev) => ({
        ...prev,
        [type]: error.message || `Błąd symulacji ${type === 'phone' ? 'SMS' : 'email'}`
      }));
    }
  };

  // SYMULACJA: Weryfikacja kodu
  const handleVerifyCode = async (type) => {
    try {
      debug(`🎭 SYMULACJA: Weryfikacja kodu ${type}: ${formData[`${type}Code`]}`);
      setIsSubmitting(true);
      
      if (type === 'phone') {
        // SYMULACJA: Sprawdź kod SMS
        if (formData.phoneCode === '123456') {
          setPhoneCodeVerified(true);
          setErrors((prev) => ({ ...prev, phoneCode: '' }));
          
          // Automatycznie przejdź do weryfikacji email
          setStep(3);
          
          // Automatycznie wyślij i zweryfikuj email
          await handleSendVerificationCode('email');
          
          alert('🎭 SYMULACJA: Numer telefonu zweryfikowany pomyślnie!');
        } else {
          throw new Error('Nieprawidłowy kod SMS. Użyj kodu: 123456');
        }
      } else if (type === 'email') {
        // SYMULACJA: Email już zweryfikowany automatycznie
        if (emailCodeVerified) {
          // Zakończ rejestrację
          await handleFinalRegistration();
        } else {
          throw new Error('Email nie został jeszcze zweryfikowany');
        }
      }
    } catch (error) {
      console.error(`🎭 SYMULACJA: Błąd weryfikacji ${type}:`, error);
      setErrors((prev) => ({
        ...prev,
        [`${type}Code`]: error.message || 'Nieprawidłowy kod'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // SYMULACJA: Rejestracja użytkownika z automatyczną weryfikacją
  const handleAdvancedRegistration = async () => {
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
      
      debug('🎭 SYMULACJA: Rejestracja użytkownika z automatyczną weryfikacją - dane:', {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhoneNumber,
        dob: formattedDob,
        termsAccepted: formData.termsAccepted,
        marketingAccepted: formData.marketingAccepted,
        emailVerified: true,
        phoneVerified: true
      });
      
      // SYMULACJA: Wysyłaj flagi weryfikacji na backend
      const registrationData = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhoneNumber,
        password: formData.password,
        dob: formattedDob,
        termsAccepted: formData.termsAccepted,
        marketingAccepted: formData.marketingAccepted,
        // FLAGI WERYFIKACJI - SYMULACJA
        emailVerified: true,
        phoneVerified: true
      };
      
      // Użyj standardowej funkcji rejestracji z flagami
      const data = await api.register(registrationData);
      
      debug('🎭 SYMULACJA: Odpowiedź z rejestracji:', data);
      
      if (data.user) {
        // Pokaż komunikat o sukcesie
        setShowSuccessModal(true);
        
        alert('🎭 SYMULACJA: Rejestracja zakończona pomyślnie! Użytkownik utworzony z flagami emailVerified: true, phoneVerified: true. Konto jest w pełni aktywne.');
        
        return data;
      } else {
        throw new Error(data.message || 'Błąd podczas rejestracji');
      }
    } catch (error) {
      console.error('🎭 SYMULACJA: Błąd rejestracji:', error);
      
      // Obsługa błędów
      if (error.message?.includes('email już istnieje')) {
        setErrors({
          general: 'Użytkownik o tym adresie email już istnieje w systemie.'
        });
      } else if (error.message?.includes('telefon już istnieje')) {
        setErrors({
          general: 'Ten numer telefonu jest już przypisany do innego konta.'
        });
      } else if (error.message?.includes('16 lat')) {
        setErrors({
          general: 'Musisz mieć co najmniej 16 lat, aby się zarejestrować.'
        });
      } else {
        setErrors({
          general: error.message || 'Błąd podczas rejestracji. Spróbuj ponownie.'
        });
      }
      throw error;
    }
  };

  // SYMULACJA: Finalizacja rejestracji
  const handleFinalRegistration = async () => {
    try {
      debug('🎭 SYMULACJA: Finalizacja rejestracji');
      
      // Symulujemy opóźnienie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pokaż komunikat o sukcesie
      setShowSuccessModal(true);
      
      alert('🎭 SYMULACJA: Rejestracja zakończona pomyślnie! Użytkownik utworzony z flagami isEmailVerified: true, isPhoneVerified: true');
      
    } catch (error) {
      console.error('🎭 SYMULACJA: Błąd finalizacji rejestracji:', error);
      setErrors({
        general: error.message || 'Błąd podczas finalizacji rejestracji.'
      });
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
        // Użyj zaawansowanej rejestracji zamiast przechodzenia do kroku 2
        await handleAdvancedRegistration();
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


  // Render kroków weryfikacji - używa modularnego komponentu
  const renderVerificationStep = (type) => (
    <VerificationStep
      type={type}
      phonePrefix={formData.phonePrefix}
      phone={formData.phone}
      email={formData.email}
      code={formData[`${type}Code`]}
      onChange={handleInputChange}
      onSendCode={() => handleSendVerificationCode(type)}
      onBack={() => setStep(step - 1)}
      error={errors[`${type}Code`]}
      verificationTimer={verificationTimers[type]}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="w-full max-w-2xl p-10 bg-white rounded-xl shadow-2xl mx-4 my-12 border border-gray-100">
        <div className="mb-10">
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
              {/* Pola formularza (Krok 1) - Modularny kod */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputText
                  label="Imię"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />
                
                <InputText
                  label="Nazwisko"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                />
              </div>

              <DatePicker
                label="Data urodzenia"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                error={errors.dob}
                required
                minAge={16}
                maxAge={100}
              />

              <EmailSection
                email={formData.email}
                confirmEmail={formData.confirmEmail}
                emailCode={formData.emailCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onSendCode={() => {
                  setSendingEmailCode(true);
                  handleSendVerificationCode('email').finally(() => {
                    setSendingEmailCode(false);
                    setEmailCodeSent(true);
                  });
                }}
                error={errors.email}
                confirmEmailError={errors.confirmEmail}
                isChecking={isCheckingEmail}
                isValid={formData.email && !errors.email && !isCheckingEmail}
                codeSent={emailCodeSent}
                codeVerified={emailCodeVerified}
                sendingCode={sendingEmailCode}
                verificationTimer={verificationTimers.email}
              />

              <PhoneSection
                phonePrefix={formData.phonePrefix}
                phone={formData.phone}
                phoneCode={formData.phoneCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onSendCode={() => {
                  setSendingPhoneCode(true);
                  handleSendVerificationCode('phone').finally(() => {
                    setSendingPhoneCode(false);
                    setPhoneCodeSent(true);
                  });
                }}
                error={errors.phone}
                isChecking={isCheckingPhone}
                codeSent={phoneCodeSent}
                codeVerified={phoneCodeVerified}
                sendingCode={sendingPhoneCode}
                verificationTimer={verificationTimers.phone}
              />

              <PasswordStrength
                password={formData.password}
                passwordStrength={passwordStrength}
                showPasswordInfo={showPasswordInfo}
                togglePasswordInfo={() => setShowPasswordInfo(!showPasswordInfo)}
              />

              <InputPassword
                label="Hasło"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                showPassword={showPassword}
                togglePasswordVisibility={() => togglePasswordVisibility('password')}
              />

              <InputPassword
                label="Potwierdź hasło"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
                showPassword={showConfirmPassword}
                togglePasswordVisibility={() => togglePasswordVisibility('confirmPassword')}
                showConfirmation
                confirmValue={formData.password}
              />

              <TermsCheckboxes
                termsAccepted={formData.termsAccepted}
                dataProcessingAccepted={formData.dataProcessingAccepted}
                marketingAccepted={formData.marketingAccepted}
                onChange={handleInputChange}
                error={errors.agreements}
              />

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
                  'ZAREJESTRUJ'
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
