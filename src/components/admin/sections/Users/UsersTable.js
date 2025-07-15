import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldOff, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import AdminTable from '../../components/UI/AdminTable';
import AdminButton from '../../components/UI/AdminButton';
import AdminPagination from '../../components/UI/AdminPagination';
import { formatDate } from '../../components/utils/adminHelpers';

const UsersTable = ({
  users = [],
  loading = false,
  error = null,
  selectedUsers = [],
  onSelectUser = null,
  onSelectAll = null,
  onViewUser = null,
  onEditUser = null,
  onDeleteUser = null,
  onUserAction = null,
  pagination = {},
  onPageChange = null,
  onPageSizeChange = null
}) => {
  const [actionLoading, setActionLoading] = useState({});

  // Handle user action with loading state
  const handleUserAction = async (userId, action) => {
    setActionLoading(prev => ({ ...prev, [userId]: action }));
    
    try {
      await onUserAction(userId, action);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Aktywny' },
      inactive: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Nieaktywny' },
      suspended: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Zawieszony' },
      blocked: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Zablokowany' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  // Get verification badge
  const getVerificationBadge = (verified) => {
    if (verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
          <CheckCircle size={12} className="mr-1" />
          Zweryfikowany
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <AlertCircle size={12} className="mr-1" />
        Niezweryfikowany
      </span>
    );
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Administrator' },
      moderator: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Moderator' },
      user: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Użytkownik' },
      vip: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'VIP' }
    };

    const config = roleConfig[role] || roleConfig.user;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Table columns configuration
  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedUsers.length === users.length && users.length > 0}
          onChange={onSelectAll}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      ),
      render: (_, user) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={() => onSelectUser(user.id)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      ),
      width: '50px',
      sortable: false
    },
    {
      key: 'avatar',
      title: '',
      render: (_, user) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-sm">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </div>
        </div>
      ),
      width: '60px',
      sortable: false
    },
    {
      key: 'name',
      title: 'Użytkownik',
      render: (_, user) => (
        <div>
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'phone',
      title: 'Telefon',
      render: (phone) => (
        <div className="flex items-center text-sm text-gray-600">
          {phone ? (
            <>
              <Phone size={14} className="mr-1" />
              {phone}
            </>
          ) : (
            <span className="text-gray-400">Brak</span>
          )}
        </div>
      ),
      sortable: false
    },
    {
      key: 'role',
      title: 'Rola',
      render: (role) => getRoleBadge(role),
      sortable: true
    },
    {
      key: 'status',
      title: 'Status',
      render: (status) => getStatusBadge(status),
      sortable: true
    },
    {
      key: 'verified',
      title: 'Weryfikacja',
      render: (verified) => getVerificationBadge(verified),
      sortable: true
    },
    {
      key: 'listings_count',
      title: 'Ogłoszenia',
      render: (count) => (
        <span className="text-sm text-gray-600">
          {count || 0}
        </span>
      ),
      sortable: true
    },
    {
      key: 'created_at',
      title: 'Data rejestracji',
      render: (date) => (
        <div className="text-sm text-gray-600">
          <div>{formatDate(date, 'date')}</div>
          <div className="text-xs text-gray-400">{formatDate(date, 'time')}</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'last_active',
      title: 'Ostatnia aktywność',
      render: (date) => (
        <div className="text-sm text-gray-600">
          {date ? formatDate(date, 'relative') : 'Nigdy'}
        </div>
      ),
      sortable: true
    },
    {
      key: 'actions',
      title: 'Akcje',
      render: (_, user) => (
        <UserActions
          user={user}
          loading={actionLoading[user.id]}
          onView={() => onViewUser(user)}
          onEdit={() => onEditUser(user)}
          onDelete={() => onDeleteUser(user.id)}
          onAction={(action) => handleUserAction(user.id, action)}
        />
      ),
      width: '120px',
      sortable: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <AdminTable
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        emptyMessage="Brak użytkowników do wyświetlenia"
        sortable={true}
        searchable={false}
        pagination={false}
      />
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <AdminPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

// User actions component
const UserActions = ({ user, loading, onView, onEdit, onDelete, onAction }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const actionButtons = [
    {
      label: 'Wyświetl',
      icon: Eye,
      onClick: onView,
      variant: 'secondary'
    },
    {
      label: 'Edytuj',
      icon: Edit,
      onClick: onEdit,
      variant: 'secondary'
    }
  ];

  const dropdownActions = [
    {
      label: user.status === 'active' ? 'Dezaktywuj' : 'Aktywuj',
      icon: user.status === 'active' ? UserX : UserCheck,
      onClick: () => onAction(user.status === 'active' ? 'deactivate' : 'activate'),
      disabled: loading === 'activate' || loading === 'deactivate'
    },
    {
      label: user.verified ? 'Usuń weryfikację' : 'Zweryfikuj',
      icon: user.verified ? XCircle : CheckCircle,
      onClick: () => onAction(user.verified ? 'unverify' : 'verify'),
      disabled: loading === 'verify' || loading === 'unverify'
    },
    {
      label: user.status === 'blocked' ? 'Odblokuj' : 'Zablokuj',
      icon: user.status === 'blocked' ? ShieldOff : Shield,
      onClick: () => onAction(user.status === 'blocked' ? 'unblock' : 'block'),
      disabled: loading === 'block' || loading === 'unblock',
      className: user.status === 'blocked' ? 'text-green-600' : 'text-red-600'
    },
    {
      label: 'Resetuj hasło',
      icon: Mail,
      onClick: () => onAction('reset_password'),
      disabled: loading === 'reset_password'
    },
    {
      label: 'Usuń',
      icon: Trash2,
      onClick: onDelete,
      className: 'text-red-600',
      disabled: loading === 'delete'
    }
  ];

  return (
    <div className="flex items-center space-x-2">
      {/* Quick actions */}
      <div className="flex items-center space-x-1">
        {actionButtons.map((action, index) => (
          <AdminButton
            key={index}
            variant={action.variant}
            size="small"
            icon={action.icon}
            onClick={action.onClick}
            disabled={loading}
            title={action.label}
          />
        ))}
      </div>

      {/* Dropdown menu */}
      <div className="relative">
        <AdminButton
          variant="secondary"
          size="small"
          icon={MoreVertical}
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={loading}
        />

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              {dropdownActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    setShowDropdown(false);
                  }}
                  disabled={action.disabled}
                  className={`
                    w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2
                    ${action.className || 'text-gray-700'}
                    ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <action.icon size={16} />
                  <span>{action.label}</span>
                  {action.disabled && loading === action.onClick.toString().match(/action\('(.+?)'\)/)?.[1] && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
