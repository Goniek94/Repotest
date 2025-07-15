import React, { useState } from 'react';
import AdminInput from '../../components/Forms/AdminInput';
import AdminTextArea from '../../components/Forms/AdminTextArea';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminButton from '../../components/UI/AdminButton';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const SettingsGeneral = () => {
  const [settings, setSettings] = useState({
    siteName: 'AutoSell',
    siteDescription: 'Portal ogłoszeń motoryzacyjnych',
    contactEmail: 'kontakt@autosell.pl',
    language: 'pl',
    timezone: 'Europe/Warsaw',
    maintenanceMode: false
  });
  
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useAdminNotifications();

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Ustawienia zostały zapisane');
    } catch (err) {
      showError('Nie udało się zapisać ustawień');
    } finally {
      setLoading(false);
    }
  };

  const languageOptions = [
    { value: 'pl', label: 'Polski' },
    { value: 'en', label: 'English' }
  ];

  const timezoneOptions = [
    { value: 'Europe/Warsaw', label: 'Europa/Warszawa' },
    { value: 'Europe/London', label: 'Europa/Londyn' },
    { value: 'America/New_York', label: 'Ameryka/Nowy Jork' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput
          label="Nazwa strony"
          value={settings.siteName}
          onChange={(e) => handleChange('siteName', e.target.value)}
        />

        <AdminInput
          label="Email kontaktowy"
          type="email"
          value={settings.contactEmail}
          onChange={(e) => handleChange('contactEmail', e.target.value)}
        />

        <AdminSelect
          label="Język"
          value={settings.language}
          onChange={(value) => handleChange('language', value)}
          options={languageOptions}
        />

        <AdminSelect
          label="Strefa czasowa"
          value={settings.timezone}
          onChange={(value) => handleChange('timezone', value)}
          options={timezoneOptions}
        />
      </div>

      <AdminTextArea
        label="Opis strony"
        value={settings.siteDescription}
        onChange={(e) => handleChange('siteDescription', e.target.value)}
        rows={3}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={settings.maintenanceMode}
          onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Tryb konserwacji
        </label>
      </div>

      <div className="flex justify-end">
        <AdminButton variant="primary" onClick={handleSave} loading={loading}>
          Zapisz ustawienia
        </AdminButton>
      </div>
    </div>
  );
};

export default SettingsGeneral;
