import React, { useState } from 'react';
import AdminInput from '../../components/Forms/AdminInput';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminButton from '../../components/UI/AdminButton';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const SettingsSecurity = () => {
  const [settings, setSettings] = useState({
    passwordMinLength: 8,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    ipWhitelist: '',
    autoLogout: true
  });
  
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAdminNotifications();

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Ustawienia bezpieczeństwa zostały zapisane');
    } catch (err) {
      showError('Nie udało się zapisać ustawień');
    } finally {
      setLoading(false);
    }
  };

  const sessionTimeoutOptions = [
    { value: 1, label: '1 godzina' },
    { value: 8, label: '8 godzin' },
    { value: 24, label: '24 godziny' },
    { value: 168, label: '1 tydzień' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput
          label="Minimalna długość hasła"
          type="number"
          value={settings.passwordMinLength}
          onChange={(e) => handleChange('passwordMinLength', e.target.value)}
          min="6"
          max="20"
        />

        <AdminSelect
          label="Czas sesji"
          value={settings.sessionTimeout}
          onChange={(value) => handleChange('sessionTimeout', value)}
          options={sessionTimeoutOptions}
        />

        <AdminInput
          label="Maksymalna liczba prób logowania"
          type="number"
          value={settings.maxLoginAttempts}
          onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
          min="3"
          max="10"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Dwuskładnikowe uwierzytelnianie
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.autoLogout}
            onChange={(e) => handleChange('autoLogout', e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Automatyczne wylogowanie przy braku aktywności
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <AdminButton variant="primary" onClick={handleSave} loading={loading}>
          Zapisz ustawienia
        </AdminButton>
      </div>
    </div>
  );
};

export default SettingsSecurity;
