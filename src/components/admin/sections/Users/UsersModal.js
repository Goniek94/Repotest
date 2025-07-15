import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';
import AdminModal from '../../components/UI/AdminModal';
import AdminInput from '../../components/Forms/AdminInput';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminButton from '../../components/UI/AdminButton';
import { validateForm } from '../../components/utils/adminHelpers';

const UsersModal = ({
  isOpen = false,
  mode = 'view',
  user = null,
  onClose = null,
  onSave = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    verified: false,
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        status: user.status || 'active',
        verified: user.verified || false,
        password: '',
        confirmPassword: ''
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        verified: false,
        password: '',
        confirmPassword: ''
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: mode === 'create' ? { required: true, minLength: 8 } : { minLength: 8 },
    confirmPassword: {
      custom: (value) => !value || value === formData.password,
      message: 'Hasła muszą się zgadzać'
    }
  };

  const handleSave = async () => {
    if (mode === 'view') return;

    const validation = validateForm(formData, validationRules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const saveData = { ...formData };
      if (!saveData.password) {
        delete saveData.password;
        delete saveData.confirmPassword;
      }
      await onSave(saveData);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    role: [
      { value: 'user', label: 'Użytkownik' },
      { value: 'moderator', label: 'Moderator' },
      { value: 'admin', label: 'Administrator' }
    ],
    status: [
      { value: 'active', label: 'Aktywny' },
      { value: 'inactive', label: 'Nieaktywny' },
      { value: 'suspended', label: 'Zawieszony' },
      { value: 'blocked', label: 'Zablokowany' }
    ]
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Dodaj użytkownika' : 
               mode === 'edit' ? `Edytuj: ${user?.name}` : 
               `Profil: ${user?.name}`;

  const footer = (
    <div className="flex justify-end space-x-3">
      <AdminButton variant="secondary" onClick={onClose}>
        {mode === 'view' ? 'Zamknij' : 'Anuluj'}
      </AdminButton>
      {!isReadOnly && (
        <AdminButton variant="primary" onClick={handleSave} loading={loading}>
          {mode === 'create' ? 'Utwórz' : 'Zapisz'}
        </AdminButton>
      )}
    </div>
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} size="large" footer={footer}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput
          label="Nazwa użytkownika"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          disabled={isReadOnly}
          icon={User}
        />

        <AdminInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          disabled={isReadOnly}
          icon={Mail}
        />

        <AdminInput
          label="Telefon"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          disabled={isReadOnly}
          icon={Phone}
        />

        <AdminSelect
          label="Rola"
          value={formData.role}
          onChange={(value) => handleChange('role', value)}
          options={options.role}
          disabled={isReadOnly}
        />

        <AdminSelect
          label="Status"
          value={formData.status}
          onChange={(value) => handleChange('status', value)}
          options={options.status}
          disabled={isReadOnly}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.verified}
            onChange={(e) => handleChange('verified', e.target.checked)}
            disabled={isReadOnly}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Zweryfikowany
          </label>
        </div>

        {(mode === 'create' || mode === 'edit') && (
          <>
            <AdminInput
              label={mode === 'create' ? 'Hasło' : 'Nowe hasło (opcjonalne)'}
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              required={mode === 'create'}
              disabled={isReadOnly}
              showPasswordToggle
            />

            <AdminInput
              label="Potwierdź hasło"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required={mode === 'create'}
              disabled={isReadOnly}
              showPasswordToggle
            />
          </>
        )}
      </div>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Błędy:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </AdminModal>
  );
};

export default UsersModal;
