import React from 'react';
import { Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import AdminTable from '../../components/UI/AdminTable';
import AdminButton from '../../components/UI/AdminButton';
import { formatDate } from '../../components/utils/adminHelpers';

const ReportsTable = ({
  reports = [],
  loading = false,
  selectedReports = [],
  onSelectReport = null,
  onSelectAll = null,
  onViewReport = null,
  onReportAction = null
}) => {
  const getStatusBadge = (status) => {
    const config = {
      pending: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Oczekuje' },
      resolved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Rozwiązane' },
      rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Odrzucone' }
    };

    const { icon: Icon, color, bg, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${color}`}>
        <Icon size={12} className="mr-1" />
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = {
      low: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Niski' },
      medium: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Średni' },
      high: { color: 'text-red-600', bg: 'bg-red-100', label: 'Wysoki' }
    };

    const { color, bg, label } = config[priority] || config.medium;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${color}`}>
        {label}
      </span>
    );
  };

  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedReports.length === reports.length && reports.length > 0}
          onChange={onSelectAll}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      ),
      render: (_, report) => (
        <input
          type="checkbox"
          checked={selectedReports.includes(report.id)}
          onChange={() => onSelectReport(report.id)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      ),
      width: '50px',
      sortable: false
    },
    {
      key: 'type',
      title: 'Typ zgłoszenia',
      render: (type) => {
        const types = {
          spam: 'Spam',
          inappropriate: 'Nieodpowiednia treść',
          fake: 'Fałszywe ogłoszenie',
          scam: 'Oszustwo',
          other: 'Inne'
        };
        return <span className="text-sm font-medium text-gray-900">{types[type] || type}</span>;
      },
      sortable: true
    },
    {
      key: 'reporter',
      title: 'Zgłaszający',
      render: (reporter) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{reporter?.name}</div>
          <div className="text-gray-500">{reporter?.email}</div>
        </div>
      ),
      sortable: false
    },
    {
      key: 'reported_content',
      title: 'Zgłoszona treść',
      render: (content) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {content?.title || content?.description || 'Brak opisu'}
        </div>
      ),
      sortable: false
    },
    {
      key: 'priority',
      title: 'Priorytet',
      render: (priority) => getPriorityBadge(priority),
      sortable: true
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => getStatusBadge(status),
      sortable: true
    },
    {
      key: 'created_at',
      title: 'Data zgłoszenia',
      render: (date) => (
        <div className="text-sm text-gray-600">
          {formatDate(date, 'date')}
        </div>
      ),
      sortable: true
    },
    {
      key: 'actions',
      title: 'Akcje',
      render: (_, report) => (
        <div className="flex items-center space-x-2">
          <AdminButton variant="secondary" size="small" icon={Eye} onClick={() => onViewReport(report)} />
          {report.status === 'pending' && (
            <>
              <AdminButton 
                variant="success" 
                size="small" 
                icon={CheckCircle} 
                onClick={() => onReportAction(report.id, 'resolve')}
              />
              <AdminButton 
                variant="danger" 
                size="small" 
                icon={XCircle} 
                onClick={() => onReportAction(report.id, 'reject')}
              />
            </>
          )}
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <AdminTable
        columns={columns}
        data={reports}
        loading={loading}
        emptyMessage="Brak zgłoszeń do wyświetlenia"
      />
    </div>
  );
};

export default ReportsTable;
