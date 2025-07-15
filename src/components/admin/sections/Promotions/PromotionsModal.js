import React, { useState, useEffect } from 'react';
import { Gift, Percent, DollarSign, Calendar } from 'lucide-react';
import AdminModal from '../../components/UI/AdminModal';
import PromotionsForm from './PromotionsForm';
import AdminButton from '../../components/UI/AdminButton';

const PromotionsModal = ({
  isOpen = false,
  mode = 'view',
  promotion = null,
  onClose = null,
  onSave = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    start_date: '',
    end_date: '',
    max_uses: '',
    code: '',
    status: 'inactive'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promotion && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: promotion.name || '',
        description: promotion.description || '',
        type: promotion.type || 'percentage',
        value: promotion.value || '',
        start_date: promotion.start_date || '',
        end_date: promotion.end_date || '',
        max_uses: promotion.max_uses || '',
        code: promotion.code || '',
        status: promotion.status || 'inactive'
      });
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        start_date: '',
        end_date: '',
        max_uses: '',
        code: '',
        status: 'inactive'
      });
    }
  }, [promotion, mode, isOpen]);

  const handleSave = async () => {
    if (mode === 'view') return;
    
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Dodaj promocję' : 
               mode === 'edit' ? `Edytuj: ${promotion?.name}` : 
               `Promocja: ${promotion?.name}`;

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
      <PromotionsForm
        formData={formData}
        setFormData={setFormData}
        readOnly={isReadOnly}
      />
    </AdminModal>
  );
};

export default PromotionsModal;
