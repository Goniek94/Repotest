import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import AdminModal from '../../components/UI/AdminModal';
import AdminButton from '../../components/UI/AdminButton';
import AdminTextArea from '../../components/Forms/AdminTextArea';
import { formatDate } from '../../components/utils/adminHelpers';

const ReportsModal = ({
  isOpen = false,
  report = null,
  onClose = null,
  onAction = null
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await onAction(report.id, action, reason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-between">
      <AdminButton variant="secondary" onClick={onClose}>
        Zamknij
      </AdminButton>
      {report?.status === 'pending' && (
        <div className="flex space-x-3">
          <AdminButton 
            variant="danger" 
            icon={XCircle}
            onClick={() => handleAction('reject')}
            loading={loading}
          >
            Odrzuć
          </AdminButton>
          <AdminButton 
            variant="success" 
            icon={CheckCircle}
            onClick={() => handleAction('resolve')}
            loading={loading}
          >
            Rozwiąż
          </AdminButton>
        </div>
      )}
    </div>
  );

  return (
    <AdminModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Zgłoszenie #${report?.id}`}
      size="large"
      footer={footer}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ zgłoszenia</label>
            <p className="text-sm text-gray-900">{report?.type}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <p className="text-sm text-gray-900">{report?.status}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zgłaszający</label>
            <p className="text-sm text-gray-900">{report?.reporter?.name}</p>
            <p className="text-xs text-gray-500">{report?.reporter?.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data zgłoszenia</label>
            <p className="text-sm text-gray-900">{formatDate(report?.created_at)}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opis problemu</label>
          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{report?.description}</p>
        </div>

        {report?.reported_content && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zgłoszona treść</label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{report.reported_content.title}</p>
              <p className="text-sm text-gray-600 mt-1">{report.reported_content.description}</p>
            </div>
          </div>
        )}

        {report?.status === 'pending' && (
          <AdminTextArea
            label="Powód decyzji (opcjonalnie)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Dodaj powód rozwiązania lub odrzucenia zgłoszenia..."
            rows={3}
          />
        )}
      </div>
    </AdminModal>
  );
};

export default ReportsModal;
