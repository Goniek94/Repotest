import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminInput from '../../components/Forms/AdminInput';
import AdminButton from '../../components/UI/AdminButton';

const UsersFilters = ({ filters = {}, onFiltersChange = null }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const filterOptions = {
    status: [
      { value: '', label: 'Wszystkie statusy' },
      { value: 'active', label: 'Aktywny' },
      { value: 'inactive', label: 'Nieaktywny' },
      { value: 'suspended', label: 'Zawieszony' },
      { value: 'blocked', label: 'Zablokowany' }
    ],
    role: [
      { value: '', label: 'Wszystkie role' },
      { value: 'user', label: 'Użytkownik' },
      { value: 'moderator', label: 'Moderator' },
      { value: 'admin', label: 'Administrator' }
    ],
    verified: [
      { value: '', label: 'Wszystkie' },
      { value: 'true', label: 'Zweryfikowani' },
      { value: 'false', label: 'Niezweryfikowani' }
    ],
    dateRange: [
      { value: '', label: 'Cały okres' },
      { value: 'today', label: 'Dzisiaj' },
      { value: 'last_7_days', label: 'Ostatnie 7 dni' },
      { value: 'last_30_days', label: 'Ostatnie 30 dni' },
      { value: 'this_month', label: 'Ten miesiąc' }
    ]
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <AdminSelect
        label="Status"
        value={localFilters.status || ''}
        onChange={(value) => handleFilterChange('status', value)}
        options={filterOptions.status}
        size="small"
      />

      <AdminSelect
        label="Rola"
        value={localFilters.role || ''}
        onChange={(value) => handleFilterChange('role', value)}
        options={filterOptions.role}
        size="small"
      />

      <AdminSelect
        label="Weryfikacja"
        value={localFilters.verified || ''}
        onChange={(value) => handleFilterChange('verified', value)}
        options={filterOptions.verified}
        size="small"
      />

      <AdminSelect
        label="Okres rejestracji"
        value={localFilters.dateRange || ''}
        onChange={(value) => handleFilterChange('dateRange', value)}
        options={filterOptions.dateRange}
        size="small"
      />

      <AdminInput
        label="Miasto"
        value={localFilters.city || ''}
        onChange={(e) => handleFilterChange('city', e.target.value)}
        placeholder="Wpisz miasto..."
        size="small"
      />

      <div className="flex items-end">
        <AdminButton
          variant="secondary"
          icon={RefreshCw}
          onClick={handleReset}
          size="small"
        >
          Resetuj
        </AdminButton>
      </div>
    </div>
  );
};

export default UsersFilters;
