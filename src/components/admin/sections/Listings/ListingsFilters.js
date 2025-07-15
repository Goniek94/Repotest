import React from 'react';
import { RefreshCw } from 'lucide-react';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminInput from '../../components/Forms/AdminInput';
import AdminButton from '../../components/UI/AdminButton';

const ListingsFilters = ({ filters = {}, onFiltersChange = null }) => {
  const filterOptions = {
    status: [
      { value: '', label: 'Wszystkie statusy' },
      { value: 'pending', label: 'Oczekujące' },
      { value: 'active', label: 'Aktywne' },
      { value: 'rejected', label: 'Odrzucone' },
      { value: 'expired', label: 'Wygasłe' }
    ],
    category: [
      { value: '', label: 'Wszystkie kategorie' },
      { value: 'samochody', label: 'Samochody' },
      { value: 'motocykle', label: 'Motocykle' },
      { value: 'ciezarowe', label: 'Ciężarowe' }
    ],
    condition: [
      { value: '', label: 'Wszystkie stany' },
      { value: 'nowy', label: 'Nowy' },
      { value: 'uzywany', label: 'Używany' },
      { value: 'uszkodzony', label: 'Uszkodzony' }
    ],
    dateRange: [
      { value: '', label: 'Cały okres' },
      { value: 'today', label: 'Dzisiaj' },
      { value: 'last_7_days', label: 'Ostatnie 7 dni' },
      { value: 'last_30_days', label: 'Ostatnie 30 dni' }
    ]
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <AdminSelect
        label="Status"
        value={filters.status || ''}
        onChange={(value) => handleFilterChange('status', value)}
        options={filterOptions.status}
        size="small"
      />

      <AdminSelect
        label="Kategoria"
        value={filters.category || ''}
        onChange={(value) => handleFilterChange('category', value)}
        options={filterOptions.category}
        size="small"
      />

      <AdminSelect
        label="Stan"
        value={filters.condition || ''}
        onChange={(value) => handleFilterChange('condition', value)}
        options={filterOptions.condition}
        size="small"
      />

      <AdminInput
        label="Cena od"
        type="number"
        value={filters.priceFrom || ''}
        onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
        placeholder="0"
        size="small"
      />

      <AdminInput
        label="Cena do"
        type="number"
        value={filters.priceTo || ''}
        onChange={(e) => handleFilterChange('priceTo', e.target.value)}
        placeholder="999999"
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

export default ListingsFilters;
