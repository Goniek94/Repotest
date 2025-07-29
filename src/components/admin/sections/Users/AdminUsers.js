import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Filter, Search } from 'lucide-react';
import UsersTable from './UsersTable';
import UsersModal from './UsersModal';
import UsersFilters from './UsersFilters';
import UsersStats from './UsersStats';
import AdminButton from '../../components/UI/AdminButton';
import AdminInput from '../../components/Forms/AdminInput';
import useAdminApi from '../../hooks/useAdminApi';
import useAdminNotifications from '../../hooks/useAdminNotifications';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, edit, create
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    verified: '',
    dateRange: '',
    location: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
    toggleUserBlock, 
    bulkUpdateUsers, 
    exportUsers,
    loading, 
    error 
  } = useAdminApi();
  const { showSuccess, showError } = useAdminNotifications();

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, pagination.pageSize, filters, searchTerm]);

  const fetchUsers = async () => {
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: searchTerm,
        ...filters
      };

      const response = await getUsers(params);
      
      if (response.success) {
        setUsers(response.data.users || []);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.pagination?.totalCount || 0,
          totalPages: response.data.pagination?.totalPages || 0
        }));
      } else {
        showError('Nie udało się załadować użytkowników');
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      showError('Nie udało się załadować użytkowników');
    }
  };

  // Handle user actions
  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    const reason = window.prompt('Podaj powód usunięcia użytkownika (minimum 10 znaków):');
    if (!reason || reason.trim().length < 10) {
      showError('Powód usunięcia musi mieć minimum 10 znaków');
      return;
    }

    try {
      const response = await deleteUser(userId, reason);
      
      if (response.success) {
        showSuccess('Użytkownik został usunięty');
        fetchUsers();
      } else {
        showError('Nie udało się usunąć użytkownika');
      }
    } catch (err) {
      showError('Nie udało się usunąć użytkownika');
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      let response;
      let successMessage;

      switch (action) {
        case 'block':
          const reason = window.prompt('Podaj powód blokady (minimum 10 znaków):');
          if (!reason || reason.trim().length < 10) {
            showError('Powód blokady musi mieć minimum 10 znaków');
            return;
          }
          response = await toggleUserBlock(userId, true, reason);
          successMessage = 'Użytkownik został zablokowany';
          break;
        case 'unblock':
          response = await toggleUserBlock(userId, false);
          successMessage = 'Użytkownik został odblokowany';
          break;
        default:
          showError('Nieznana akcja');
          return;
      }
      
      if (response.success) {
        showSuccess(successMessage);
        fetchUsers();
      } else {
        showError('Nie udało się wykonać akcji');
      }
    } catch (err) {
      showError('Nie udało się wykonać akcji');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      showError('Nie wybrano żadnych użytkowników');
      return;
    }

    const confirmMessage = `Czy na pewno chcesz ${action} ${selectedUsers.length} użytkowników?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setBulkLoading(true);
      
      const updateData = { action };
      const response = await bulkUpdateUsers(selectedUsers, updateData);
      
      if (response.success) {
        showSuccess(`Akcja została wykonana na ${selectedUsers.length} użytkownikach`);
        setSelectedUsers([]);
        fetchUsers();
      } else {
        showError('Nie udało się wykonać akcji zbiorczej');
      }
    } catch (err) {
      showError('Nie udało się wykonać akcji zbiorczej');
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle modal save
  const handleModalSave = async (userData) => {
    try {
      let response;
      
      if (modalMode === 'create') {
        response = await createUser(userData);
      } else if (modalMode === 'edit') {
        response = await updateUser(selectedUser.id, userData);
      }
      
      if (response.success) {
        showSuccess(modalMode === 'create' ? 'Użytkownik został utworzony' : 'Użytkownik został zaktualizowany');
        setShowModal(false);
        fetchUsers();
      } else {
        showError('Nie udało się zapisać użytkownika');
      }
    } catch (err) {
      showError('Nie udało się zapisać użytkownika');
    }
  };

  // Handle export
  const handleExport = async (format = 'json') => {
    try {
      const response = await exportUsers(format, filters);
      
      if (response.success) {
        showSuccess('Dane zostały wyeksportowane');
      } else {
        showError('Nie udało się wyeksportować danych');
      }
    } catch (err) {
      showError('Nie udało się wyeksportować danych');
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size) => {
    setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  // Handle filters
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle selection
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zarządzanie użytkownikami</h1>
          <p className="text-gray-600">Przeglądaj i zarządzaj kontami użytkowników</p>
        </div>
        <div className="flex items-center space-x-3">
          <AdminButton
            variant="secondary"
            icon={Download}
            onClick={() => handleExport('csv')}
          >
            Eksportuj
          </AdminButton>
          <AdminButton
            variant="primary"
            icon={Plus}
            onClick={handleCreateUser}
          >
            Dodaj użytkownika
          </AdminButton>
        </div>
      </div>

      {/* Stats */}
      <UsersStats loading={loading} />

      {/* Filters and search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <AdminInput
              placeholder="Szukaj użytkowników..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Filter toggle and bulk actions */}
          <div className="flex items-center space-x-3">
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Wybrano: {selectedUsers.length}
                </span>
                <AdminButton
                  variant="success"
                  size="small"
                  onClick={() => handleBulkAction('activate')}
                  loading={bulkLoading}
                >
                  Aktywuj
                </AdminButton>
                <AdminButton
                  variant="warning"
                  size="small"
                  onClick={() => handleBulkAction('deactivate')}
                  loading={bulkLoading}
                >
                  Dezaktywuj
                </AdminButton>
                <AdminButton
                  variant="danger"
                  size="small"
                  onClick={() => handleBulkAction('delete')}
                  loading={bulkLoading}
                >
                  Usuń
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

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <UsersFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        )}
      </div>

      {/* Users table */}
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        selectedUsers={selectedUsers}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onUserAction={handleUserAction}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* User modal */}
      {showModal && (
        <UsersModal
          isOpen={showModal}
          mode={modalMode}
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default AdminUsers;
