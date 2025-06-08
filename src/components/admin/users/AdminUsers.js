import React, { useState, useEffect } from 'react';
import dashboardService from '../../../services/dashboard.service';
import { FaUserShield, FaUserSlash, FaExclamationTriangle, FaEye, FaTrash, FaEdit } from 'react-icons/fa';

const AdminUsers = () => {
  // Stan / State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Modalne okna / Modal windows
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [banReason, setBanReason] = useState('');
  const [warnReason, setWarnReason] = useState('');

  // Pobierz użytkowników / Fetch users
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, selectedRole, sortBy, sortOrder]);

  // Funkcja pobierająca użytkowników / Function to fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy,
        sortOrder,
        role: selectedRole
      };
      
      const data = await dashboardService.getUsers(params);
      
      setUsers(data.users || []);
      setTotalPages(data.pagination?.pages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      setError('Wystąpił błąd podczas pobierania listy użytkowników.');
      setLoading(false);
    }
  };

  // Obsługa wyszukiwania / Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset do pierwszej strony przy nowym wyszukiwaniu
    fetchUsers();
  };

  // Obsługa zmiany roli / Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      await dashboardService.updateUser(selectedUser._id, { role: newRole });
      
      // Aktualizuj lokalną listę użytkowników
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, role: newRole } : user
      ));
      
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (err) {
      console.error('Błąd podczas zmiany roli użytkownika:', err);
      setError('Wystąpił błąd podczas zmiany roli użytkownika.');
    }
  };

  // Obsługa banowania użytkownika / Handle user banning
  const handleBanUser = async () => {
    if (!selectedUser) return;
    
    try {
      await dashboardService.updateUser(selectedUser._id, { 
        status: 'banned',
        banReason: banReason || 'Naruszenie regulaminu'
      });
      
      // Aktualizuj lokalną listę użytkowników
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, status: 'banned' } : user
      ));
      
      setShowBanModal(false);
      setSelectedUser(null);
      setBanReason('');
    } catch (err) {
      console.error('Błąd podczas banowania użytkownika:', err);
      setError('Wystąpił błąd podczas banowania użytkownika.');
    }
  };

  // Obsługa ostrzegania użytkownika / Handle user warning
  const handleWarnUser = async () => {
    if (!selectedUser) return;
    
    try {
      await dashboardService.updateUser(selectedUser._id, { 
        warnings: (selectedUser.warnings || 0) + 1,
        lastWarningReason: warnReason || 'Naruszenie regulaminu'
      });
      
      // Aktualizuj lokalną listę użytkowników
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { 
          ...user, 
          warnings: (user.warnings || 0) + 1,
          lastWarningReason: warnReason || 'Naruszenie regulaminu'
        } : user
      ));
      
      setShowWarnModal(false);
      setSelectedUser(null);
      setWarnReason('');
    } catch (err) {
      console.error('Błąd podczas ostrzegania użytkownika:', err);
      setError('Wystąpił błąd podczas ostrzegania użytkownika.');
    }
  };

  // Obsługa usuwania użytkownika / Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await dashboardService.deleteUser(selectedUser._id);
      
      // Usuń użytkownika z lokalnej listy
      setUsers(users.filter(user => user._id !== selectedUser._id));
      
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Błąd podczas usuwania użytkownika:', err);
      setError('Wystąpił błąd podczas usuwania użytkownika.');
    }
  };

  // Formatowanie daty / Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderowanie paginacji / Render pagination
  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i 
            ? 'bg-[#35530A] text-white' 
            : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex justify-center my-6">
        <button
          className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        
        {pages}
        
        <button
          className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
    );
  };

  // Jeśli ładowanie / If loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#35530A]"></div>
        <span className="ml-3">Ładowanie użytkowników...</span>
      </div>
    );
  }

  // Jeśli błąd / If error
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <div className="flex">
          <FaExclamationTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
        <button 
          onClick={fetchUsers} 
          className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Zarządzanie Użytkownikami</h2>
      
      {/* Filtry / Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex">
            <input
              type="text"
              placeholder="Szukaj po email, imieniu lub nazwisku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-[#35530A]"
            />
            <button 
              type="submit" 
              className="bg-[#35530A] text-white px-4 py-2 rounded-r hover:bg-[#2D4A06]"
            >
              Szukaj
            </button>
          </div>
        </form>
        
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#35530A]"
        >
          <option value="">Wszystkie role</option>
          <option value="user">Użytkownicy</option>
          <option value="moderator">Moderatorzy</option>
          <option value="admin">Administratorzy</option>
        </select>
      </div>
      
      {/* Tabela użytkowników / Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <button 
                  className="flex items-center"
                  onClick={() => {
                    if (sortBy === 'email') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('email');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Email
                  {sortBy === 'email' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <button 
                  className="flex items-center"
                  onClick={() => {
                    if (sortBy === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Nazwa
                  {sortBy === 'name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <button 
                  className="flex items-center"
                  onClick={() => {
                    if (sortBy === 'role') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('role');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Rola
                  {sortBy === 'role' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <button 
                  className="flex items-center"
                  onClick={() => {
                    if (sortBy === 'createdAt') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('createdAt');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Data rejestracji
                  {sortBy === 'createdAt' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id} className={user.status === 'banned' ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.name} {user.lastName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'moderator'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 
                       user.role === 'moderator' ? 'Moderator' : 'Użytkownik'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">
                    {user.status === 'banned' ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Zbanowany
                      </span>
                    ) : user.warnings > 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Ostrzeżeń: {user.warnings}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Aktywny
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.location.href = `/admin/users/${user._id}`}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Zobacz szczegóły"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setNewRole(user.role);
                          setShowRoleModal(true);
                        }}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Zmień rolę"
                      >
                        <FaUserShield />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowWarnModal(true);
                        }}
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        title="Ostrzeż użytkownika"
                      >
                        <FaExclamationTriangle />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBanModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Zbanuj użytkownika"
                        disabled={user.status === 'banned'}
                      >
                        <FaUserSlash />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Usuń użytkownika"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Brak użytkowników spełniających kryteria wyszukiwania
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && renderPagination()}
      
      {/* Modal zmiany roli / Role change modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Zmiana roli użytkownika</h3>
            <p className="mb-4">
              Zmieniasz rolę dla użytkownika: <strong>{selectedUser?.email}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nowa rola:
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#35530A] focus:border-[#35530A]"
              >
                <option value="user">Użytkownik</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button 
                onClick={handleRoleChange}
                className="px-4 py-2 bg-[#35530A] text-white rounded-md hover:bg-[#2D4A06]"
              >
                Zapisz zmiany
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal banowania / Ban modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Banowanie użytkownika</h3>
            <p className="mb-4">
              Zamierzasz zbanować użytkownika: <strong>{selectedUser?.email}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Powód bana:
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#35530A] focus:border-[#35530A]"
                rows="3"
                placeholder="Podaj powód banowania użytkownika"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowBanModal(false);
                  setSelectedUser(null);
                  setBanReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button 
                onClick={handleBanUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Zbanuj użytkownika
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal ostrzegania / Warning modal */}
      {showWarnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Ostrzeżenie dla użytkownika</h3>
            <p className="mb-4">
              Zamierzasz wysłać ostrzeżenie dla użytkownika: <strong>{selectedUser?.email}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Powód ostrzeżenia:
              </label>
              <textarea
                value={warnReason}
                onChange={(e) => setWarnReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#35530A] focus:border-[#35530A]"
                rows="3"
                placeholder="Podaj powód ostrzeżenia dla użytkownika"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowWarnModal(false);
                  setSelectedUser(null);
                  setWarnReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button 
                onClick={handleWarnUser}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Wyślij ostrzeżenie
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal usuwania użytkownika / Delete user modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Usuwanie użytkownika</h3>
            <p className="mb-4">
              Czy na pewno chcesz usunąć użytkownika: <strong>{selectedUser?.email}</strong>?
            </p>
            <p className="mb-4 text-red-600 bg-red-50 p-3 rounded-md flex items-start">
              <FaExclamationTriangle className="flex-shrink-0 h-5 w-5 mr-2 mt-0.5" />
              <span>
                Ta operacja jest nieodwracalna. Wszystkie dane użytkownika zostaną usunięte z systemu.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button 
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Usuń użytkownika
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;