// src/components/auth/hooks/useRegistrationLogic.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export const useRegistrationLogic = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Verification states
  const [verificationTimers, setVerificationTimers] = useState({
    phone: 0,
    email: 0
  });
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeVerified, setPhoneCodeVerified] = useState(false);
  const [emailCodeVerified, setEmailCodeVerified] = useState(false);
  const [sendingPhoneCode, setSendingPhoneCode] = useState(false);
  const [sendingEmailCode, setSendingEmailCode] = useState(false);

  // Timer for verification code resend
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

  // Send verification code (production)
  const handleSendVerificationCode = async (type, formData, setErrors) => {
    try {
      let response;
      if (type === 'email') {
        setSendingEmailCode(true);
        response = await api.sendEmailVerificationLink(formData.email);
        
        if (response.success) {
          setEmailCodeSent(true);
          startVerificationTimer(type);
        }
      } else if (type === 'phone') {
        setSendingPhoneCode(true);
        const fullPhone = `${formData.phonePrefix}${formData.phone}`;
        response = await api.resendSMSCode(fullPhone);
        
        if (response.success) {
          setPhoneCodeSent(true);
          startVerificationTimer(type);
        }
      }
    } catch (error) {
      console.error(`Błąd wysyłania kodu ${type}:`, error);
      setErrors((prev) => ({
        ...prev,
        [type]: error.message || `Błąd wysyłania kodu ${type === 'phone' ? 'SMS' : 'email'}`
      }));
    } finally {
      if (type === 'email') setSendingEmailCode(false);
      if (type === 'phone') setSendingPhoneCode(false);
    }
  };

  // Verify code (production)
  const handleVerifyCode = async (type, formData, setErrors, setIsSubmitting) => {
    try {
      setIsSubmitting(true);
      
      if (type === 'phone') {
        const response = await api.verifySMSAdvanced(
          `${formData.phonePrefix}${formData.phone}`, 
          formData.phoneCode
        );
        
        if (response.success) {
          setPhoneCodeVerified(true);
          setErrors((prev) => ({ ...prev, phoneCode: '' }));
          setStep(3); // Move to email verification
        }
      } else if (type === 'email') {
        const response = await api.verifyEmailAdvanced(formData.email, formData.emailCode);
        
        if (response.success) {
          setEmailCodeVerified(true);
          setErrors((prev) => ({ ...prev, emailCode: '' }));
          // Complete registration
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      console.error(`Błąd weryfikacji ${type}:`, error);
      setErrors((prev) => ({
        ...prev,
        [`${type}Code`]: error.message || 'Nieprawidłowy kod weryfikacyjny'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // User registration (production)
  const handleRegistration = async (formData, setErrors) => {
    try {
      // Check if phone number has correct format
      if (formData.phonePrefix === '+48' && formData.phone.length !== 9) {
        setErrors({
          general: 'Polski numer telefonu musi zawierać dokładnie 9 cyfr (bez prefiksu).'
        });
        return;
      }
      
      // Format date of birth correctly
      const dobDate = new Date(formData.dob);
      let formattedDob = formData.dob;
      
      // Make sure date is valid
      if (!isNaN(dobDate.getTime())) {
        formattedDob = dobDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
      }
      
      // Full phone number with prefix
      const fullPhoneNumber = `${formData.phonePrefix}${formData.phone}`;
      
      const registrationData = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        confirmEmail: formData.confirmEmail,
        phone: fullPhoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dob: formattedDob,
        termsAccepted: formData.termsAccepted,
        marketingAccepted: formData.marketingAccepted,
        dataProcessingAccepted: formData.dataProcessingAccepted
      };
      
      const data = await api.register(registrationData);
      
      if (data.user) {
        // Show success message
        setShowSuccessModal(true);
        return data;
      } else {
        throw new Error(data.message || 'Błąd podczas rejestracji');
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      
      // Handle errors
      if (error.message?.includes('email już istnieje')) {
        setErrors({
          general: 'Użytkownik z tym adresem email już istnieje w systemie.'
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

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login'); // Redirect to login page
  };

  // Main form submit handler
  const handleSubmit = async (e, formData, validateForm, setErrors, setIsSubmitting) => {
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
        // Proceed to registration
        await handleRegistration(formData, setErrors);
      } else if (step === 2) {
        await handleVerifyCode('phone', formData, setErrors, setIsSubmitting);
      } else if (step === 3) {
        await handleVerifyCode('email', formData, setErrors, setIsSubmitting);
      }
    } catch (error) {
      console.error('Błąd przetwarzania formularza:', error);
      setErrors({ general: error.message || 'Wystąpił błąd. Spróbuj ponownie.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    showSuccessModal,
    setShowSuccessModal,
    verificationTimers,
    phoneCodeSent,
    emailCodeSent,
    phoneCodeVerified,
    emailCodeVerified,
    sendingPhoneCode,
    sendingEmailCode,
    handleSendVerificationCode,
    handleVerifyCode,
    handleRegistration,
    handleSuccessModalClose,
    handleSubmit
  };
};
