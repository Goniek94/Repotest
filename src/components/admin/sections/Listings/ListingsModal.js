import React, { useState, useEffect } from 'react';
import { Car, DollarSign, MapPin, User } from 'lucide-react';
import AdminModal from '../../components/UI/AdminModal';
import AdminInput from '../../components/Forms/AdminInput';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminTextArea from '../../components/Forms/AdminTextArea';
import AdminButton from '../../components/UI/AdminButton';

const ListingsModal = ({
  isOpen = false,
  mode = 'view',
  listing = null,
  onClose = null,
  onSave = null
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    status: 'pending'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listing && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price || '',
        category: listing.category || '',
        condition: listing.condition || '',
        location: listing.location || '',
        status: listing.status || 'pending'
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        location: '',
        status: 'pending'
      });
    }
  }, [listing, mode, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (mode === 'view') return;
    
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    category: [
      { value: 'samochody', label: 'Samochody' },
      { value: 'motocykle', label: 'Motocykle' },
      { value: 'ciezarowe', label: 'Ciężarowe' },
      { value: 'autobusy', label: 'Autobusy' }
    ],
    condition: [
      { value: 'nowy', label: 'Nowy' },
      { value: 'uzywany', label: 'Używany' },
      { value: 'uszkodzony', label: 'Uszkodzony' }
    ],
    status: [
      { value: 'pending', label: 'Oczekuje' },
      { value: 'active', label: 'Aktywne' },
      { value: 'rejected', label: 'Odrzucone' },
      { value: 'expired', label: 'Wygasłe' }
    ]
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Dodaj ogłoszenie' : 
               mode === 'edit' ? `Edytuj: ${listing?.title}` : 
               `Ogłoszenie: ${listing?.title}`;

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput
            label="Tytuł ogłoszenia"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            disabled={isReadOnly}
            icon={Car}
          />

          <AdminInput
            label="Cena"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
            disabled={isReadOnly}
            icon={DollarSign}
          />

          <AdminSelect
            label="Kategoria"
            value={formData.category}
            onChange={(value) => handleChange('category', value)}
            options={options.category}
            disabled={isReadOnly}
            required
          />

          <AdminSelect
            label="Stan"
            value={formData.condition}
            onChange={(value) => handleChange('condition', value)}
            options={options.condition}
            disabled={isReadOnly}
            required
          />

          <AdminInput
            label="Lokalizacja"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            disabled={isReadOnly}
            icon={MapPin}
          />

          <AdminSelect
            label="Status"
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
            options={options.status}
            disabled={isReadOnly}
          />
        </div>

        <AdminTextArea
          label="Opis"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          disabled={isReadOnly}
          rows={4}
        />

        {/* Show listing stats in view mode */}
        {mode === 'view' && listing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{listing.views || 0}</div>
              <div className="text-sm text-gray-500">Wyświetlenia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{listing.messages || 0}</div>
              <div className="text-sm text-gray-500">Wiadomości</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{listing.favorites || 0}</div>
              <div className="text-sm text-gray-500">Obserwujący</div>
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
};

export default ListingsModal;
