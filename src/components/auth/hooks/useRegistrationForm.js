// src/components/auth/hooks/useRegistrationForm.js
import { useState } from 'react';
import api from '../../../services/api';

export const useRegistrationForm = () => {
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
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  // Check password strength
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  // Check if age is valid (16-100 years)
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

  // Check if email exists
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

  // Check if phone exists
  const checkPhoneExists = async (phone) => {
    if (!phone || phone.length < 9) return;
    
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

  // Form validation
  const validateForm = async () => {
    const newErrors = {};
    
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
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        newErrors.email = 'Ten adres email jest już zarejestrowany w naszej bazie.';
      }
    }
    
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
    
    const phoneRegex = /^[0-9]{9}$/; 
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Numer telefonu powinien zawierać dokładnie 9 cyfr (bez prefiksu).';
    } else {
      const phoneExists = await checkPhoneExists(formData.phone);
      if (phoneExists) {
        newErrors.phone = 'Ten numer telefonu jest już zarejestrowany w naszej bazie.';
      }
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Data urodzenia jest wymagana.';
    } else {
      const dobDate = new Date(formData.dob);
      
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
    
    return newErrors;
  };

  // Handle input change
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
    
    // Real-time validation for email and phone
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

  // Handle blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email' && value) {
      checkEmailExists(value);
    }
    
    if (name === 'phone' && value) {
      checkPhoneExists(value);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return {
    formData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    isCheckingEmail,
    isCheckingPhone,
    passwordStrength,
    showPassword,
    showConfirmPassword,
    showPasswordInfo,
    setShowPasswordInfo,
    handleInputChange,
    handleBlur,
    togglePasswordVisibility,
    validateForm,
    checkPasswordStrength
  };
};
