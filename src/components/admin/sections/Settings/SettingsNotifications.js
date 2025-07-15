import React, { useState } from 'react';
import AdminInput from '../../components/Forms/AdminInput';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminButton from '../../components/UI/AdminButton';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const SettingsNotifications = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emailTemplate: 'default',
    notificationFrequency: 'immediate',
    adminEmails: 'admin@autosell.pl'
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
      showSuccess('Ustawienia powiadomień zostały zapisane');
    } catch (err) {
      showError('Nie udało się zapisać ustawień');
    } finally {
      setLoading(false);
    }
  };

  const templateOptions = [
    { value: 'default', label: 'Domyślny' },
    { value: 'modern', label: 'Nowoczesny' },
    { value: 'minimal', label: 'Minimalistyczny' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Natychmiastowe' },
    { value: 'hourly', label: 'Co godzinę' },
    { value: 'daily', label: 'Codziennie' },
    { value: 'weekly', label: 'Co tydzień' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminSelect
          label="Szablon emaili"
          value={settings.emailTemplate}
          onChange={(value) => handleChange('emailTemplate', value)}
          options={templateOptions}
        />

        <AdminSelect
          label="Częstotliwość powiadomień"
          value={settings.notificationFrequency}
          onChange={(value) => handleChange('notificationFrequency', value)}
          options={frequencyOptions}
        />
      </div>

      <AdminInput
        label="Email administratora"
        type="email"
        value={settings.adminEmails}
        onChange={(e) => handleChange('adminEmails', e.target.value)}
        placeholder="admin@autosell.pl"
      />

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Typy powiadomień</h4>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Powiadomienia email
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleChange('smsNotifications', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Powiadomienia SMS
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleChange('pushNotifications', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Powiadomienia push
            </label>
          </div>
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

export default SettingsNotifications;
