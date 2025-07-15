import React, { useState, useEffect } from 'react';
import { Filter, CheckCircle, XCircle } from 'lucide-react';
import ReportsTable from './ReportsTable';
import ReportsModal from './ReportsModal';
import ReportsFilters from './ReportsFilters';
import AdminButton from '../../components/UI/AdminButton';
import AdminInput from '../../components/Forms/AdminInput';
import useAdminApi from '../../hooks/useAdminApi';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedReports, setSelectedReports] = useState([]);

  const { get, post } = useAdminApi();
  const { showSuccess, showError } = useAdminNotifications();

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await get('/reports', filters);
      if (response.success) {
        setReports(response.data.reports);
      }
    } catch (err) {
      showError('Nie udało się załadować zgłoszeń');
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId, action, reason = '') => {
    try {
      const response = await post(`/reports/${reportId}/${action}`, { reason });
      if (response.success) {
        showSuccess(`Zgłoszenie zostało ${action === 'resolve' ? 'rozwiązane' : 'odrzucone'}`);
        fetchReports();
      }
    } catch (err) {
      showError('Nie udało się wykonać akcji');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReports.length === 0) return;
    
    try {
      const response = await post('/reports/bulk-action', {
        reportIds: selectedReports,
        action: action
      });
      
      if (response.success) {
        showSuccess(`Akcja została wykonana na ${selectedReports.length} zgłoszeniach`);
        setSelectedReports([]);
        fetchReports();
      }
    } catch (err) {
      showError('Nie udało się wykonać akcji zbiorczej');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zgłoszenia</h1>
          <p className="text-gray-600">Zarządzaj zgłoszeniami użytkowników</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filtry</h3>
          <div className="flex items-center space-x-3">
            {selectedReports.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Wybrano: {selectedReports.length}</span>
                <AdminButton variant="success" size="small" onClick={() => handleBulkAction('resolve')}>
                  Rozwiąż
                </AdminButton>
                <AdminButton variant="danger" size="small" onClick={() => handleBulkAction('reject')}>
                  Odrzuć
                </AdminButton>
              </div>
            )}
            <AdminButton
              variant="secondary"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ukryj filtry' : 'Pokaż filtry'}
            </AdminButton>
          </div>
        </div>

        {showFilters && (
          <ReportsFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}
      </div>

      {/* Reports table */}
      <ReportsTable
        reports={reports}
        loading={loading}
        selectedReports={selectedReports}
        onSelectReport={(id) => {
          setSelectedReports(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
          );
        }}
        onSelectAll={() => {
          setSelectedReports(selectedReports.length === reports.length ? [] : reports.map(r => r.id));
        }}
        onViewReport={(report) => {
          setSelectedReport(report);
          setShowModal(true);
        }}
        onReportAction={handleReportAction}
      />

      {/* Modal */}
      {showModal && (
        <ReportsModal
          isOpen={showModal}
          report={selectedReport}
          onClose={() => setShowModal(false)}
          onAction={handleReportAction}
        />
      )}
    </div>
  );
};

export default AdminReports;
