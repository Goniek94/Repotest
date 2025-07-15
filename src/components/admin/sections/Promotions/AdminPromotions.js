import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause } from 'lucide-react';
import PromotionsTable from './PromotionsTable';
import PromotionsModal from './PromotionsModal';
import AdminButton from '../../components/UI/AdminButton';
import useAdminApi from '../../hooks/useAdminApi';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');

  const { get, post, put, del } = useAdminApi();
  const { showSuccess, showError } = useAdminNotifications();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await get('/promotions');
      if (response.success) {
        setPromotions(response.data.promotions);
      }
    } catch (err) {
      showError('Nie udało się załadować promocji');
    } finally {
      setLoading(false);
    }
  };

  const handlePromotionAction = async (promotionId, action) => {
    try {
      const response = await post(`/promotions/${promotionId}/${action}`);
      if (response.success) {
        showSuccess(`Promocja została ${action === 'activate' ? 'aktywowana' : 'dezaktywowana'}`);
        fetchPromotions();
      }
    } catch (err) {
      showError('Nie udało się wykonać akcji');
    }
  };

  const handleDelete = async (promotionId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę promocję?')) return;
    
    try {
      const response = await del(`/promotions/${promotionId}`);
      if (response.success) {
        showSuccess('Promocja została usunięta');
        fetchPromotions();
      }
    } catch (err) {
      showError('Nie udało się usunąć promocji');
    }
  };

  const handleModalSave = async (promotionData) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await post('/promotions', promotionData);
      } else if (modalMode === 'edit') {
        response = await put(`/promotions/${selectedPromotion.id}`, promotionData);
      }
      
      if (response.success) {
        showSuccess(modalMode === 'create' ? 'Promocja utworzona' : 'Promocja zaktualizowana');
        setShowModal(false);
        fetchPromotions();
      }
    } catch (err) {
      showError('Nie udało się zapisać promocji');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promocje i zniżki</h1>
          <p className="text-gray-600">Zarządzaj promocjami dla użytkowników</p>
        </div>
        <AdminButton 
          variant="primary" 
          icon={Plus}
          onClick={() => {
            setSelectedPromotion(null);
            setModalMode('create');
            setShowModal(true);
          }}
        >
          Dodaj promocję
        </AdminButton>
      </div>

      {/* Promotions table */}
      <PromotionsTable
        promotions={promotions}
        loading={loading}
        onViewPromotion={(promotion) => {
          setSelectedPromotion(promotion);
          setModalMode('view');
          setShowModal(true);
        }}
        onEditPromotion={(promotion) => {
          setSelectedPromotion(promotion);
          setModalMode('edit');
          setShowModal(true);
        }}
        onDeletePromotion={handleDelete}
        onPromotionAction={handlePromotionAction}
      />

      {/* Modal */}
      {showModal && (
        <PromotionsModal
          isOpen={showModal}
          mode={modalMode}
          promotion={selectedPromotion}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default AdminPromotions;
