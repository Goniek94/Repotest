import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/api/client';
import { fetchUserSettings, updateUserSettings } from '../../../services/api/userSettingsApi';
import {
  FaUser, FaLock, FaBell, FaShieldAlt, FaTrash,
  FaExclamationTriangle, FaCheckCircle, FaEnvelope, FaPhone,
  FaInfoCircle, FaCheck, FaTimes, FaEye, FaEyeSlash
} from 'react-icons/fa';

const SettingsPanel = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('accountSettings');
  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);
  // State for showing password requirements info
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  // State for password form fields
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  // State for password strength requirements
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // User settings state
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    push: false
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState(null);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Fetch user settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoadingSettings(true);
        const data = await fetchUserSettings();
        if (data.notificationPreferences) {
          setNotificationPreferences(data.notificationPreferences);
        }
        setLoadingSettings(false);
      } catch (err) {
        setSettingsError('Błąd podczas pobierania ustawień użytkownika.');
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle notification preferences change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  // Save notification preferences
  const handleSaveNotificationPreferences = async () => {
    try {
      setSettingsError(null);
      setSettingsSuccess(false);
      await updateUserSettings({ notificationPreferences });
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2000);
    } catch (err) {
      setSettingsError('Błąd podczas zapisywania ustawień powiadomień.');
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // Password strength validation
    if (name === 'newPassword') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle password form submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Add password update logic here (API call)
    // Example: apiClient.post('/user/change-password', passwordForm)
    // .then(...)
    // .catch(...)
  };

  // ... (pozostała logika bez zmian)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Komunikat o niekompletnym profilu */}
      {/* ... (pozostała logika bez zmian) */}

      {/* Sekcja powiadomień */}
      {activeTab === 'notifications' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <FaBell className="mr-2 text-green-600" />
            Ustawienia powiadomień
          </h2>
          {loadingSettings ? (
            <p>Ładowanie ustawień...</p>
          ) : (
            <>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="email"
                    checked={notificationPreferences.email}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  Powiadomienia e-mail
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sms"
                    checked={notificationPreferences.sms}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  Powiadomienia SMS
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="push"
                    checked={notificationPreferences.push}
                    onChange={handleNotificationChange}
                    className="mr-2"
                  />
                  Powiadomienia push
                </label>
              </div>
              <button
                type="button"
                onClick={handleSaveNotificationPreferences}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Zapisz ustawienia powiadomień
              </button>
              {settingsSuccess && (
                <div className="mt-3 text-green-600 flex items-center">
                  <FaCheckCircle className="mr-2" /> Ustawienia zapisane!
                </div>
              )}
              {settingsError && (
                <div className="mt-3 text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-2" /> {settingsError}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Sekcja bezpieczeństwa */}
      {activeTab === 'accountSettings' && (
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
                      <span>{passwordStrength.length ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}Co najmniej 8 znaków</span>
                    </li>
                    <li className="flex items-center">
                      <span>{passwordStrength.uppercase ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}Przynajmniej jedną wielką literę</span>
                    </li>
                    <li className="flex items-center">
                      <span>{passwordStrength.lowercase ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}Przynajmniej jedną małą literę</span>
                    </li>
                    <li className="flex items-center">
                      <span>{passwordStrength.number ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}Przynajmniej jedną cyfrę</span>
                    </li>
                    <li className="flex items-center">
<span>{passwordStrength.special ? <FaCheck className="text-green-500 mr-2" /> : <FaTimes className="text-red-500 mr-2" />}Przynajmniej jeden znak specjalny (!@#$%^&*(),.?":{}|{'<'}{'>'})</span>
                    </li>
                  </ul>
                </div>
              )}
              {/* ... (pozostała logika bez zmian) */}
            </div>
            {/* ... (pozostała logika bez zmian) */}
          </div>
          {/* ... (pozostała logika bez zmian) */}
        </form>
      )}
      {/* ... (pozostała logika bez zmian) */}
    </div>
  );
};

export default SettingsPanel;
