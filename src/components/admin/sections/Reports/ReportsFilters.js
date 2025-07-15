import React from 'react';
import { RefreshCw } from 'lucide-react';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminButton from '../../components/UI/AdminButton';

const ReportsFilters = ({ filters = {}, onFiltersChange = null }) => {
  const filterOptions = {
    status: [
      { value: '', label: 'Wszystkie statusy' },
      { value: 'pending', label: 'Oczekujące' },
      { value: 'resolved', label: 'Rozwiązane' },
      { value: 'rejected', label: 'Odrzucone' }
    ],
    type: [
      { value: '', label: 'Wszystkie typy' },
      { value: 'spam', label: 'Spam' },
      { value: 'inappropriate', label: 'Nieodpowiednia treść' },
      { value: 'fake', label: 'Fałszywe ogłoszenie' },
      { value: 'scam', label: 'Oszustwo' },
      { value: 'other', label: 'Inne' }
    ],
    priority: [
      { value: '', label: 'Wszystkie priorytety' },
      { value: 'high', label: 'Wysoki' },
      { value: 'medium', label: 'Średni' },
      { value: 'low', label: 'Niski' }
    ]
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminSelect
        label="Status"
        value={filters.status || ''}
        onChange={(value) => handleFilterChange('status', value)}
        options={filterOptions.status}
        size="small"
      />

      <AdminSelect
        label="Typ zgłoszenia"
        value={filters.type || ''}
        onChange={(value) => handleFilterChange('type', value)}
        options={filterOptions.type}
        size="small"
      />

      <AdminSelect
        label="Priorytet"
        value={filters.priority || ''}
        onChange={(value) => handleFilterChange('priority', value)}
        options={filterOptions.priority}
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

export default ReportsFilters;
