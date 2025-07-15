import React from 'react';
import { Eye, Edit, Trash2, Play, Pause } from 'lucide-react';
import AdminTable from '../../components/UI/AdminTable';
import AdminButton from '../../components/UI/AdminButton';
import { formatDate, formatCurrency } from '../../components/utils/adminHelpers';

const PromotionsTable = ({
  promotions = [],
  loading = false,
  onViewPromotion = null,
  onEditPromotion = null,
  onDeletePromotion = null,
  onPromotionAction = null
}) => {
  const getStatusBadge = (status) => {
    const config = {
      active: { color: 'text-green-600', bg: 'bg-green-100', label: 'Aktywna' },
      inactive: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Nieaktywna' },
      expired: { color: 'text-red-600', bg: 'bg-red-100', label: 'Wygasła' }
    };

    const { color, bg, label } = config[status] || config.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${color}`}>
        {label}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      title: 'Nazwa promocji',
      render: (name) => <span className="font-medium text-gray-900">{name}</span>,
      sortable: true
    },
    {
      key: 'type',
      title: 'Typ',
      render: (type) => {
        const types = {
          percentage: 'Procent',
          fixed: 'Kwota',
          free_shipping: 'Darmowa dostawa'
        };
        return <span className="text-sm text-gray-600">{types[type] || type}</span>;
      },
      sortable: true
    },
    {
      key: 'discount',
      title: 'Zniżka',
      render: (_, promotion) => (
        <span className="font-medium text-gray-900">
          {promotion.type === 'percentage' ? `${promotion.value}%` : 
           promotion.type === 'fixed' ? formatCurrency(promotion.value) : 
           'Darmowa dostawa'}
        </span>
      ),
      sortable: false
    },
    {
      key: 'start_date',
      title: 'Data rozpoczęcia',
      render: (date) => <span className="text-sm text-gray-600">{formatDate(date, 'date')}</span>,
      sortable: true
    },
    {
      key: 'end_date',
      title: 'Data zakończenia',
      render: (date) => <span className="text-sm text-gray-600">{formatDate(date, 'date')}</span>,
      sortable: true
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => getStatusBadge(status),
      sortable: true
    },
    {
      key: 'used_count',
      title: 'Użycia',
      render: (_, promotion) => (
        <span className="text-sm text-gray-600">
          {promotion.used_count || 0}
          {promotion.max_uses ? ` / ${promotion.max_uses}` : ''}
        </span>
      ),
      sortable: true
    },
    {
      key: 'actions',
      title: 'Akcje',
      render: (_, promotion) => (
        <div className="flex items-center space-x-2">
          <AdminButton variant="secondary" size="small" icon={Eye} onClick={() => onViewPromotion(promotion)} />
          <AdminButton variant="secondary" size="small" icon={Edit} onClick={() => onEditPromotion(promotion)} />
          <AdminButton 
            variant={promotion.status === 'active' ? 'warning' : 'success'}
            size="small" 
            icon={promotion.status === 'active' ? Pause : Play}
            onClick={() => onPromotionAction(promotion.id, promotion.status === 'active' ? 'deactivate' : 'activate')}
          />
          <AdminButton variant="danger" size="small" icon={Trash2} onClick={() => onDeletePromotion(promotion.id)} />
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <AdminTable
        columns={columns}
        data={promotions}
        loading={loading}
        emptyMessage="Brak promocji do wyświetlenia"
      />
    </div>
  );
};

export default PromotionsTable;
