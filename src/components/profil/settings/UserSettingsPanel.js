import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Key, 
  Trash2, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Bell,
  Lock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  fetchUserSettings, 
  updateUserProfile, 
  updateNotificationPreferences,
  changePassword
} from '../../../services/api/userSettingsApi';
import { 
  sendVerificationCode, 
  verifyVerificationCode 
} from '../../../services/api/verificationApi';

const UserSettingsPanel = () => {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editingField, setEditingField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dane formularza hasła
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Dane weryfikacji
  const [verificationState, setVerificationState] = useState({
    showVerification: false,
    verificationCode: '',
    verificationLoading: false,
    verificationError: null,
    verificationSuccess: false,
    codeSent: false
  });
  
  // Dane użytkownika
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    registrationType: 'standard',
    isVerified: false,
    emailVerified: false,
    phoneVerified: false,
    accountCreated: ''
  });

  const [tempData, setTempData] = useState({});
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const tabs = [
    { id: 'profile', label: 'Dane osobowe', icon: User },
    { id: 'security', label: 'Bezpieczeństwo', icon: Shield },
    { id: 'notifications', label: 'Powiadomienia', icon: Bell },
    { id: 'account', label: 'Zarządzanie kontem', icon: Lock }
  ];

  // Pobieranie danych użytkownika
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchUserSettings();
        console.log('Pobrano dane użytkownika:', data);
        
        // Mapowanie danych z API na strukturę komponentu
        setUserData({
          firstName: data.name || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          birthDate: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
          registrationType: data.registrationType || 'standard',
          isVerified: data.isVerified || false,
          emailVerified: data.isEmailVerified || false,
          phoneVerified: data.isPhoneVerified || false,
          accountCreated: data.createdAt || new Date().toISOString()
        });
        
        // Pobieranie preferencji powiadomień
        setNotifications({
          email: data.notifications?.email || true,
          sms: data.notifications?.sms || false,
          push: data.notifications?.push || true,
          marketing: data.notifications?.marketing || false
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Błąd pobierania danych użytkownika:', err);
        setError('Nie udało się pobrać danych użytkownika. Spróbuj odświeżyć stronę.');
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Obsługa edycji pola
  const handleEdit = (field) => {
    setEditingField(field);
    setTempData({ ...tempData, [field]: userData[field] });
  };

  // Obsługa zapisywania zmian
  const handleSave = async (field) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Mapowanie pól z komponentu na strukturę API
      const apiFieldMapping = {
        firstName: 'name',
        lastName: 'lastName',
        phone: 'phoneNumber',
        birthDate: 'dob'
      };
      
      const fieldName = apiFieldMapping[field] || field;
      const updateData = { [fieldName]: tempData[field] };
      
      await updateUserProfile(updateData);
      
      setUserData({ ...userData, [field]: tempData[field] });
      setEditingField(null);
      setTempData({});
      setSuccess(`Pole ${field} zostało zaktualizowane.`);
      
      // Ukryj komunikat sukcesu po 3 sekundach
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setLoading(false);
    } catch (err) {
      console.error('Błąd aktualizacji danych:', err);
      setError('Nie udało się zaktualizować danych. Spróbuj ponownie.');
      setLoading(false);
    }
  };

  // Anulowanie edycji
  const handleCancel = () => {
    setEditingField(null);
    setTempData({});
  };

  // Obsługa zmiany hasła
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Walidacja
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Nowe hasło i potwierdzenie hasła nie są identyczne.');
      setLoading(false);
      return;
    }
    
    try {
      await changePassword({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Hasło zostało zmienione pomyślnie.');
      
      // Ukryj komunikat sukcesu po 3 sekundach
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setLoading(false);
    } catch (err) {
      console.error('Błąd zmiany hasła:', err);
      setError('Nie udało się zmienić hasła. Sprawdź, czy aktualne hasło jest poprawne.');
      setLoading(false);
    }
  };

  // Obsługa aktualizacji preferencji powiadomień
  const handleNotificationChange = async (key, value) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedNotifications = { ...notifications, [key]: value };
      setNotifications(updatedNotifications);
      
      await updateNotificationPreferences(updatedNotifications);
      
      setSuccess('Preferencje powiadomień zostały zaktualizowane.');
      
      // Ukryj komunikat sukcesu po 3 sekundach
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      setLoading(false);
    } catch (err) {
      console.error('Błąd aktualizacji preferencji powiadomień:', err);
      setError('Nie udało się zaktualizować preferencji powiadomień.');
      setLoading(false);
    }
  };

  // Wysyłanie kodu weryfikacyjnego
  const handleSendVerificationCode = async (type) => {
    setVerificationState({
      ...verificationState,
      verificationLoading: true,
      verificationError: null,
      codeSent: false,
      showVerification: true
    });
    
    try {
      const response = await sendVerificationCode({
        phoneNumber: userData.phone,
        type: type
      });
      
      setVerificationState({
        ...verificationState,
        verificationLoading: false,
        codeSent: true,
        showVerification: true
      });
      
      // Jeśli w trybie deweloperskim, możemy mieć kod do testów
      if (response.devCode) {
        console.log('Kod weryfikacyjny (dev):', response.devCode);
      }
    } catch (err) {
      console.error('Błąd wysyłania kodu weryfikacyjnego:', err);
      setVerificationState({
        ...verificationState,
        verificationLoading: false,
        verificationError: 'Nie udało się wysłać kodu weryfikacyjnego. Sprawdź numer telefonu i spróbuj ponownie.',
        showVerification: true
      });
    }
  };

  // Weryfikacja kodu
  const handleVerifyCode = async () => {
    if (!verificationState.verificationCode || verificationState.verificationCode.length !== 6) {
      setVerificationState({
        ...verificationState,
        verificationError: 'Kod weryfikacyjny musi mieć 6 cyfr.'
      });
      return;
    }
    
    setVerificationState({
      ...verificationState,
      verificationLoading: true,
      verificationError: null
    });
    
    try {
      const response = await verifyVerificationCode({
        phoneNumber: userData.phone,
        code: verificationState.verificationCode,
        type: 'phone'
      });
      
      if (response.verified) {
        setVerificationState({
          ...verificationState,
          verificationLoading: false,
          verificationSuccess: true,
          showVerification: false
        });
        
        // Aktualizacja stanu weryfikacji użytkownika
        setUserData({
          ...userData,
          phoneVerified: true,
          isVerified: userData.emailVerified // Użytkownik jest w pełni zweryfikowany, jeśli email jest zweryfikowany
        });
        
        setSuccess('Numer telefonu został zweryfikowany pomyślnie!');
        
        // Ukryj komunikat sukcesu po 3 sekundach
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setVerificationState({
          ...verificationState,
          verificationLoading: false,
          verificationError: 'Nieprawidłowy kod weryfikacyjny. Spróbuj ponownie.'
        });
      }
    } catch (err) {
      console.error('Błąd weryfikacji kodu:', err);
      setVerificationState({
        ...verificationState,
        verificationLoading: false,
        verificationError: 'Nie udało się zweryfikować kodu. Spróbuj ponownie później.'
      });
    }
  };

  // Komponent odznaki weryfikacyjnej
  const VerificationBadge = ({ isVerified, type }) => {
    if (isVerified) {
      return (
        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4 mr-1" />
          Zweryfikowane
        </div>
      );
    }
    
    return (
      <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
        <AlertCircle className="w-4 h-4 mr-1" />
        Wymaga weryfikacji
      </div>
    );
  };

  // Zakładka z danymi osobowymi
  const ProfileTab = () => (
    <div className="space-y-8">
      {/* Status weryfikacji */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <UserCheck className="w-10 h-10 text-green-600 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Status konta</h3>
              <p className="text-sm text-gray-600 mt-1">
                Zarejestrowano: {userData.registrationType === 'google' ? 'przez Google' : 'standardowo'}
              </p>
            </div>
          </div>
          <VerificationBadge isVerified={userData.emailVerified && userData.phoneVerified} type={userData.registrationType} />
        </div>
        
        {(!userData.emailVerified || !userData.phoneVerified) && (
          <div className="bg-white p-5 sm:p-7 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700 mb-4">
              {userData.registrationType === 'google' 
                ? 'Dokończ weryfikację aby uzyskać pełny dostęp do platformy.'
                : 'Zweryfikuj swój email i telefon aby uzyskać pełny dostęp.'}
            </p>
            <div className="flex flex-wrap gap-3">
              {!userData.emailVerified && (
                <button 
                  onClick={() => alert('Funkcja weryfikacji e-mail zostanie wkrótce udostępniona')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Zweryfikuj email
                </button>
              )}
              {!userData.phoneVerified && (
                <button 
                  onClick={() => handleSendVerificationCode('phone')}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Zweryfikuj telefon
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Interfejs weryfikacji telefonu */}
        {verificationState.showVerification && !userData.phoneVerified && (
          <div className="mt-6 bg-blue-50 p-5 sm:p-7 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium mb-3 text-blue-700">
              Weryfikacja numeru telefonu
            </h3>
            <p className="text-gray-700 mb-5">
              Na Twój numer telefonu zostanie wysłany kod weryfikacyjny.
            </p>
            
            <div className="mb-5">
              <label className="block text-gray-700 mb-2">
                Numer telefonu
              </label>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="tel"
                  value={userData.phone}
                  disabled={verificationState.codeSent}
                  className="border rounded-t sm:rounded-t-none sm:rounded-l p-3 w-full bg-white"
                  readOnly
                />
                <button
                  onClick={() => handleSendVerificationCode('phone')}
                  disabled={verificationState.verificationLoading || verificationState.codeSent}
                  className={`px-5 py-3 rounded-b sm:rounded-b-none sm:rounded-r 
                    ${verificationState.codeSent ? 'bg-green-500' : 'bg-blue-600'} 
                    text-white hover:opacity-90 disabled:opacity-50 mt-1 sm:mt-0`}
                >
                  {verificationState.codeSent ? 'Kod wysłany' : 'Wyślij kod'}
                </button>
              </div>
            </div>
            
            {verificationState.codeSent && (
              <div className="mb-5">
                <label className="block text-gray-700 mb-2">
                  Kod weryfikacyjny
                </label>
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="text"
                    value={verificationState.verificationCode}
                    onChange={(e) => setVerificationState({
                      ...verificationState,
                      verificationCode: e.target.value
                    })}
                    className="border rounded-t sm:rounded-t-none sm:rounded-l p-3 w-full"
                    placeholder="123456"
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={verificationState.verificationLoading || !verificationState.verificationCode}
                    className="px-5 py-3 rounded-b sm:rounded-b-none sm:rounded-r bg-blue-600 text-white hover:opacity-90 disabled:opacity-50 mt-1 sm:mt-0"
                  >
                    Weryfikuj
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Wprowadź 6-cyfrowy kod otrzymany SMS-em
                </p>
              </div>
            )}
            
            {verificationState.verificationError && (
              <div className="text-red-600 mb-5 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="inline w-5 h-5 mr-2" />
                {verificationState.verificationError}
              </div>
            )}
            
            {verificationState.verificationSuccess && (
              <div className="text-green-600 mb-5 p-3 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="inline w-5 h-5 mr-2" />
                Numer telefonu zweryfikowany pomyślnie!
              </div>
            )}
            
            <button
              onClick={() => setVerificationState({
                ...verificationState,
                showVerification: false
              })}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Anuluj weryfikację
            </button>
          </div>
        )}
      </div>

      {/* Dane osobowe */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-8">Dane osobowe</h3>
        
        <div className="space-y-8">
          {/* Imię */}
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <User className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-700">Imię</label>
                {editingField === 'firstName' ? (
                  <input
                    type="text"
                    value={tempData.firstName || ''}
                    onChange={(e) => setTempData({ ...tempData, firstName: e.target.value })}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
                  />
                ) : (
                  <p className="mt-2 text-gray-900 truncate text-lg">{userData.firstName}</p>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              {editingField === 'firstName' ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave('firstName')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit('firstName')}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={userData.registrationType === 'google'}
                  title={userData.registrationType === 'google' ? 'Nie można edytować danych z konta Google' : 'Edytuj'}
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Nazwisko */}
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <User className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-700">Nazwisko</label>
                {editingField === 'lastName' ? (
                  <input
                    type="text"
                    value={tempData.lastName || ''}
                    onChange={(e) => setTempData({ ...tempData, lastName: e.target.value })}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
                  />
                ) : (
                  <p className="mt-2 text-gray-900 truncate text-lg">{userData.lastName}</p>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              {editingField === 'lastName' ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave('lastName')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit('lastName')}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={userData.registrationType === 'google'}
                  title={userData.registrationType === 'google' ? 'Nie można edytować danych z konta Google' : 'Edytuj'}
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <Mail className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                  <p className="text-gray-900 truncate mr-2 text-lg">{userData.email}</p>
                  <div className="flex items-center mt-2 sm:mt-0">
                    {userData.emailVerified ? (
                      <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Zweryfikowany
                      </div>
                    ) : (
                      <button 
                        onClick={() => alert('Funkcja weryfikacji e-mail zostanie wkrótce udostępniona')}
                        className="flex items-center bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Zweryfikuj
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Telefon */}
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <Phone className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-700">Telefon</label>
                {editingField === 'phone' ? (
                  <input
                    type="text"
                    value={tempData.phone || ''}
                    onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                    <p className="text-gray-900 truncate mr-2 text-lg">{userData.phone}</p>
                    <div className="flex items-center mt-2 sm:mt-0">
                      {userData.phoneVerified ? (
                        <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Zweryfikowany
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleSendVerificationCode('phone')}
                          className="flex items-center bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Zweryfikuj
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              {editingField === 'phone' ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave('phone')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit('phone')}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={userData.phoneVerified}
                  title={userData.phoneVerified ? 'Nie można edytować zweryfikowanego numeru telefonu' : 'Edytuj'}
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Data urodzenia */}
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1 min-w-0">
              <Calendar className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-700">Data urodzenia</label>
                {editingField === 'birthDate' ? (
                  <input
                    type="date"
                    value={tempData.birthDate || ''}
                    onChange={(e) => setTempData({ ...tempData, birthDate: e.target.value })}
                    className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
                  />
                ) : (
                  <p className="mt-2 text-gray-900 truncate text-lg">{userData.birthDate}</p>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              {editingField === 'birthDate' ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave('birthDate')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit('birthDate')}
                  className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Zakładka z bezpieczeństwem
  const SecurityTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-8">Zmiana hasła</h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aktualne hasło
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nowe hasło
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Potwierdź nowe hasło
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#35530A] hover:bg-[#2A4208] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Zapisywanie...' : 'Zmień hasło'}
          </button>
        </form>
      </div>
    </div>
  );

  // Zakładka z powiadomieniami
  const NotificationsTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-8">Preferencje powiadomień</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900">Powiadomienia e-mail</h4>
              <p className="text-sm text-gray-500 mt-1">Otrzymuj powiadomienia na adres e-mail</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.email} 
                onChange={() => handleNotificationChange('email', !notifications.email)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900">Powiadomienia SMS</h4>
              <p className="text-sm text-gray-500 mt-1">Otrzymuj powiadomienia SMS na telefon</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.sms} 
                onChange={() => handleNotificationChange('sms', !notifications.sms)}
                className="sr-only peer"
                disabled={!userData.phoneVerified}
              />
              <div className={`w-11 h-6 ${!userData.phoneVerified ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 ${!userData.phoneVerified ? 'opacity-50' : ''}`}></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900">Powiadomienia push</h4>
              <p className="text-sm text-gray-500 mt-1">Otrzymuj powiadomienia w przeglądarce</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.push} 
                onChange={() => handleNotificationChange('push', !notifications.push)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900">Powiadomienia marketingowe</h4>
              <p className="text-sm text-gray-500 mt-1">Otrzymuj informacje o promocjach i nowościach</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.marketing} 
                onChange={() => handleNotificationChange('marketing', !notifications.marketing)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Zakładka z zarządzaniem kontem
  const AccountTab = () => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-8">Zarządzanie kontem</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-start">
              <Trash2 className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-medium text-gray-900">Usuń konto</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Usunięcie konta spowoduje trwałe usunięcie wszystkich Twoich danych, ogłoszeń i historii.
                  Ta operacja jest nieodwracalna.
                </p>
              </div>
            </div>
            <button 
              onClick={() => alert('Funkcja usuwania konta zostanie wkrótce udostępniona')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Usuń konto
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-start">
              <Pause className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-medium text-gray-900">Zawieś konto</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Zawieszenie konta ukryje Twoje ogłoszenia i profil, ale zachowa wszystkie dane.
                  Możesz reaktywować konto w dowolnym momencie.
                </p>
              </div>
            </div>
            <button 
              onClick={() => alert('Funkcja zawieszania konta zostanie wkrótce udostępniona')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Zawieś konto
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderowanie odpowiedniej zakładki
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'security':
        return <SecurityTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'account':
        return <AccountTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Nagłówek */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Ustawienia konta</h1>
      </div>
      
      {/* Główna zawartość */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Komunikaty */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}
        
        {/* Zakładki */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Nawigacja zakładek */}
          <div className="w-full md:w-64 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <nav className="flex flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-left ${
                    activeTab === tab.id
                      ? 'bg-[#35530A] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Zawartość zakładki */}
          <div className="flex-1">
            {loading && activeTab !== 'profile' ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Ładowanie...</p>
              </div>
            ) : (
              renderActiveTab()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPanel;
