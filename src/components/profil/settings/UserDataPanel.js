import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle, FaMobileAlt, FaEnvelope, FaGoogle, FaUser, FaInfo } from 'react-icons/fa';
import useUserDashboardData from '../dashboard/hooks/useUserDashboardData';
import { fetchUserSettings, updateUserProfile } from '../../../services/api/userSettingsApi';
import { sendVerificationCode, verifyVerificationCode } from '../../../services/api/verificationApi';
import { useAuth } from '../../../contexts/AuthContext';

const UserDataPanel = () => {
  const { user: authUser } = useAuth();
  const { userData, isLoading: isUserDataLoading } = useUserDashboardData();
  
  const [userForm, setUserForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dob: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Verification states
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  
  // Local state for verification status
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    isEmailVerified: false,
    isPhoneVerified: false,
    registrationType: 'standard'
  });
  
  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchUserSettings();
        console.log('User data loaded from API:', data);
        
        // Fill form with user data from API
        setUserForm({
          name: data.name || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          dob: data.dob ? data.dob : ''
        });
        
        // Set verification status directly from backend data
        setVerificationStatus({
          isVerified: data.isVerified || false,
          isEmailVerified: data.isEmailVerified || false,
          isPhoneVerified: data.isPhoneVerified || false,
          registrationType: data.registrationType || 'standard'
        });
        
        // Check if profile requires verification
        if (data.registrationType === 'google' && !data.isVerified) {
          setShowVerification(true);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading user settings:', err);
        setError('Nie udało się pobrać danych użytkownika. Spróbuj odświeżyć stronę lub zaloguj się ponownie.');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await updateUserProfile(userForm);
      setSuccess(true);
      setLoading(false);
      
      // Briefly show success message
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.log('Error updating profile:', err);
      setError('Nie udało się zaktualizować profilu. Spróbuj ponownie później.');
      setLoading(false);
    }
  };
  
  // Send verification code to phone
  const handleSendVerificationCode = async () => {
    setVerificationLoading(true);
    setVerificationError(null);
    setCodeSent(false);
    
    try {
      const response = await sendVerificationCode({
        phoneNumber: userForm.phoneNumber,
        type: 'phone'
      });
      
      setCodeSent(true);
      setVerificationLoading(false);
      
      // If in dev mode, we might have a code for testing
      if (response.devCode) {
        console.log('Dev verification code:', response.devCode);
      }
    } catch (err) {
      console.log('Error sending verification code:', err);
      setVerificationError('Nie udało się wysłać kodu weryfikacyjnego. Sprawdź numer telefonu i spróbuj ponownie.');
      setVerificationLoading(false);
    }
  };
  
  // Verify phone code
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError('Kod weryfikacyjny musi mieć 6 cyfr.');
      return;
    }
    
    setVerificationLoading(true);
    setVerificationError(null);
    
    try {
      const response = await verifyVerificationCode({
        phoneNumber: userForm.phoneNumber,
        code: verificationCode,
        type: 'phone'
      });
      
      if (response.verified) {
        setVerificationSuccess(true);
        setShowVerification(false);
        
        // Briefly show success message
        setTimeout(() => {
          window.location.reload(); // Reload to update verification status
        }, 2000);
      } else {
        setVerificationError('Nieprawidłowy kod weryfikacyjny. Spróbuj ponownie.');
      }
      
      setVerificationLoading(false);
    } catch (err) {
      console.log('Error verifying code:', err);
      setVerificationError('Nie udało się zweryfikować kodu. Spróbuj ponownie później.');
      setVerificationLoading(false);
    }
  };
  
  // Use local verification status directly
  const { isVerified, isEmailVerified, isPhoneVerified, registrationType } = verificationStatus;
  
  // Render verification indicator with icon
  const renderVerificationStatus = (isVerified, type) => (
    <div className={`flex items-center ${isVerified ? 'text-green-600' : 'text-amber-600'}`}>
      {isVerified ? (
        <>
          <FaCheck className="mr-1" />
          <span>{type === 'email' ? 'E-mail zweryfikowany' : 'Telefon zweryfikowany'}</span>
        </>
      ) : (
        <>
          <FaExclamationTriangle className="mr-1" />
          <span className="mr-2">{type === 'email' ? 'E-mail niezweryfikowany' : 'Telefon niezweryfikowany'}</span>
          <button 
            onClick={() => type === 'email' ? alert('Funkcja weryfikacji e-mail zostanie wkrótce udostępniona') : setShowVerification(true)} 
            className="text-blue-600 hover:underline text-sm"
          >
            Zweryfikuj się
          </button>
        </>
      )}
    </div>
  );
  
  // Loading state
  if (loading || isUserDataLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center text-red-600 mb-4">
          <FaExclamationTriangle className="mr-2" />
          <h2 className="text-lg font-medium">Błąd ładowania danych</h2>
        </div>
        <p className="text-gray-700">{error}</p>
        <p className="mt-4 text-gray-600">
          Spróbuj odświeżyć stronę lub zaloguj się ponownie.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Account type and verification status */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-xl font-medium mb-4">Status konta</h2>
        
        <div className="flex items-center mb-2">
          {registrationType === 'google' ? (
            <div className="flex items-center text-blue-600 mr-4">
              <FaGoogle className="mr-1" />
              <span>Konto Google</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-700 mr-4">
              <FaUser className="mr-1" />
              <span>Konto standardowe</span>
            </div>
          )}
          
          {isVerified ? (
            <div className="text-green-600 flex items-center">
              <FaCheck className="mr-1" />
              <span>Zweryfikowane</span>
            </div>
          ) : (
            <div className="text-amber-600 flex items-center">
              <FaExclamationTriangle className="mr-1" />
              <span>Wymaga weryfikacji</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-gray-600" />
            {renderVerificationStatus(isEmailVerified, 'email')}
          </div>
          <div className="flex items-center">
            <FaMobileAlt className="mr-2 text-gray-600" />
            {renderVerificationStatus(isPhoneVerified, 'phone')}
          </div>
        </div>
      </div>
      
      {/* Verification interface */}
      {showVerification && !isPhoneVerified && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium mb-2 text-blue-700">
            Dokończ weryfikację konta
          </h3>
          <p className="text-gray-700 mb-4">
            Aby w pełni korzystać z serwisu, zweryfikuj swój numer telefonu.
          </p>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Numer telefonu
            </label>
            <div className="flex">
              <input
                type="tel"
                name="phoneNumber"
                value={userForm.phoneNumber}
                onChange={handleChange}
                className="border rounded-l p-2 w-full"
                placeholder="+48 123 456 789"
                disabled={codeSent}
              />
              <button
                onClick={handleSendVerificationCode}
                disabled={verificationLoading || codeSent}
                className={`px-4 py-2 rounded-r 
                  ${codeSent ? 'bg-green-500' : 'bg-blue-600'} 
                  text-white hover:opacity-90 disabled:opacity-50`}
              >
                {codeSent ? 'Kod wysłany' : 'Wyślij kod'}
              </button>
            </div>
          </div>
          
          {codeSent && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Kod weryfikacyjny
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="border rounded-l p-2 w-full"
                  placeholder="123456"
                  maxLength={6}
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={verificationLoading || !verificationCode}
                  className="px-4 py-2 rounded-r bg-blue-600 text-white hover:opacity-90 disabled:opacity-50"
                >
                  Weryfikuj
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Wprowadź 6-cyfrowy kod otrzymany SMS-em
              </p>
            </div>
          )}
          
          {verificationError && (
            <div className="text-red-600 mb-4">
              <FaExclamationTriangle className="inline mr-1" />
              {verificationError}
            </div>
          )}
          
          {verificationSuccess && (
            <div className="text-green-600 mb-4">
              <FaCheck className="inline mr-1" />
              Numer telefonu zweryfikowany pomyślnie! Odświeżanie...
            </div>
          )}
        </div>
      )}
      
      {/* User data form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-4">Dane użytkownika</h2>
          
          {/* Info box for verification data */}
          {isVerified && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-gray-700">
              <div className="flex items-center mb-1 text-blue-700">
                <FaInfo className="mr-1" />
                <span className="font-medium">Dane kluczowe</span>
              </div>
              <p>
                Imię, nazwisko, data urodzenia oraz dane kontaktowe zostały zweryfikowane podczas rejestracji. 
                Jeśli potrzebujesz wprowadzić korektę, skontaktuj się z administratorem.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="name">
                Imię
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userForm.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={registrationType === 'google'}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="lastName">
                Nazwisko
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={userForm.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={registrationType === 'google'}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userForm.email}
                className="w-full p-2 border rounded bg-gray-100"
                disabled={true}
              />
              <p className="text-xs text-gray-500 mt-1">
                Adres e-mail nie może być zmieniony
              </p>
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="phoneNumber">
                Telefon
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={userForm.phoneNumber}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isPhoneVerified ? 'bg-gray-100' : ''}`}
                disabled={isPhoneVerified || showVerification}
              />
              {isPhoneVerified && (
                <p className="text-xs text-gray-500 mt-1">
                  Numer telefonu został zweryfikowany
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="dob">
                Data urodzenia
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={userForm.dob}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={registrationType === 'google'}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading || showVerification}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
        </div>
        
        {success && (
          <div className="mt-3 text-green-600 flex items-center">
            <FaCheck className="mr-2" /> Dane zaktualizowane pomyślnie
          </div>
        )}
        
        {error && (
          <div className="mt-3 text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-2" /> {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserDataPanel;
