import React, { useState } from 'react';
import { Download } from 'lucide-react';
import AdminModal from '../../components/UI/AdminModal';
import AdminSelect from '../../components/Forms/AdminSelect';
import AdminButton from '../../components/UI/AdminButton';
import useAdminApi from '../../hooks/useAdminApi';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const StatisticsExport = ({ isOpen = false, onClose = null, timeRange = 'last_30_days' }) => {
  const [format, setFormat] = useState('csv');
  const [dataType, setDataType] = useState('all');
  const [loading, setLoading] = useState(false);

  const { get } = useAdminApi();
  const { showSuccess, showError } = useAdminNotifications();

  const formatOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'pdf', label: 'PDF' }
  ];

  const dataTypeOptions = [
    { value: 'all', label: 'Wszystkie dane' },
    { value: 'users', label: 'Tylko użytkownicy' },
    { value: 'listings', label: 'Tylko ogłoszenia' },
    { value: 'revenue', label: 'Tylko przychody' }
  ];

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await get('/statistics/export', {
        format,
        dataType,
        timeRange
      });

      if (response.success) {
        // Trigger download
        const blob = new Blob([response.data], { 
          type: format === 'csv' ? 'text/csv' : 
                format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                'application/pdf'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statistics.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showSuccess('Dane zostały wyeksportowane');
        onClose();
      }
    } catch (err) {
      showError('Nie udało się wyeksportować danych');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <AdminButton variant="secondary" onClick={onClose}>
        Anuluj
      </AdminButton>
      <AdminButton 
        variant="primary" 
        icon={Download}
        onClick={handleExport}
        loading={loading}
      >
        Eksportuj
      </AdminButton>
    </div>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Eksportuj statystyki"
      footer={footer}
    >
      <div className="space-y-6">
        <AdminSelect
          label="Format pliku"
          value={format}
          onChange={setFormat}
          options={formatOptions}
        />

        <AdminSelect
          label="Typ danych"
          value={dataType}
          onChange={setDataType}
          options={dataTypeOptions}
        />

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Okres danych:</h4>
          <p className="text-sm text-gray-600">
            {timeRange === 'last_7_days' && 'Ostatnie 7 dni'}
            {timeRange === 'last_30_days' && 'Ostatnie 30 dni'}
            {timeRange === 'last_90_days' && 'Ostatnie 90 dni'}
            {timeRange === 'this_year' && 'Ten rok'}
          </p>
        </div>
      </div>
    </AdminModal>
  );
};

export default StatisticsExport;
