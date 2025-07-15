import React from 'react';
import { Gift, Percent, DollarSign, Calendar, Hash } from 'lucide-react';
import AdminInput from '../../components/Forms/AdminInput';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminTextArea from '../../components/Forms/AdminTextArea';

const PromotionsForm = ({ formData, setFormData, readOnly = false }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const typeOptions = [
    { value: 'percentage', label: 'Procent' },
    { value: 'fixed', label: 'Kwota stała' },
    { value: 'free_shipping', label: 'Darmowa dostawa' }
  ];

  const statusOptions = [
    { value: 'inactive', label: 'Nieaktywna' },
    { value: 'active', label: 'Aktywna' },
    { value: 'expired', label: 'Wygasła' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput
          label="Nazwa promocji"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          disabled={readOnly}
          icon={Gift}
        />

        <AdminInput
          label="Kod promocyjny"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          disabled={readOnly}
          icon={Hash}
          placeholder="np. LATO2024"
        />

        <AdminSelect
          label="Typ promocji"
          value={formData.type}
          onChange={(value) => handleChange('type', value)}
          options={typeOptions}
          disabled={readOnly}
          required
        />

        <AdminInput
          label={formData.type === 'percentage' ? 'Wartość (%)' : 'Wartość (PLN)'}
          type="number"
          value={formData.value}
          onChange={(e) => handleChange('value', e.target.value)}
          required={formData.type !== 'free_shipping'}
          disabled={readOnly || formData.type === 'free_shipping'}
          icon={formData.type === 'percentage' ? Percent : DollarSign}
        />

        <AdminInput
          label="Data rozpoczęcia"
          type="datetime-local"
          value={formData.start_date}
          onChange={(e) => handleChange('start_date', e.target.value)}
          required
          disabled={readOnly}
          icon={Calendar}
        />

        <AdminInput
          label="Data zakończenia"
          type="datetime-local"
          value={formData.end_date}
          onChange={(e) => handleChange('end_date', e.target.value)}
          required
          disabled={readOnly}
          icon={Calendar}
        />

        <AdminInput
          label="Maksymalna liczba użyć"
          type="number"
          value={formData.max_uses}
          onChange={(e) => handleChange('max_uses', e.target.value)}
          disabled={readOnly}
          placeholder="Bez limitu"
        />

        <AdminSelect
          label="Status"
          value={formData.status}
          onChange={(value) => handleChange('status', value)}
          options={statusOptions}
          disabled={readOnly}
        />
      </div>

      <AdminTextArea
        label="Opis"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        disabled={readOnly}
        rows={3}
        placeholder="Opis promocji..."
      />
    </div>
  );
};

export default PromotionsForm;
