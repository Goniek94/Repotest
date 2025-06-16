// src/components/admin/sections/UserManagement.js
/**
 * Komponent do zarządzania użytkownikami w panelu administratora
 * Component for managing users in admin panel
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaBan, FaUnlock, FaTrash, FaUserShield } from 'react-icons/fa';

// Komponent modalny do blokowania użytkownika
const UserBlockModal = ({ user, isOpen, onClose, onBlock }) => {
  const [blockType, setBlockType] = useState('suspend');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(7);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4 text-gray-800">
          {blockType === 'suspend' ? 'Zawieś użytkownika' : 'Zbanuj użytkownika'}
        </h2>
        <p className="mb-4 text-gray-600">
          Użytkownik: <span className="font-medium">{user?.email}</span>
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Typ blokady</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="blockType"
                value="suspend"
                checked={blockType === 'suspend'}
                onChange={() => setBlockType('suspend')}
              />
              <span className="ml-2">Tymczasowa</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="blockType"
                value="ban"
                checked={blockType === 'ban'}
                onChange={() => setBlockType('ban')}
              />
              <span className="ml-2">Permanentna</span>
            </label>
          </div>
        </div>
        
        {blockType === 'suspend' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Czas trwania (dni)
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            >
              <option value="1">1 dzień</option>
              <option value="3">3 dni</option>
              <option value="7">7 dni</option>
              <option value="14">14 dni</option>
              <option value="30">30 dni</option>
            </select>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Powód
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Podaj powód blokady..."
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Anuluj
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => onBlock({ type: blockType, reason, duration })}
          >
            {blockType === 'suspend' ? 'Zawieś' : 'Zbanuj'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Główny komponent zarządzania użytkownikami
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');

  // Pobieranie użytkowników
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/users', {
          params: {
            page: currentPage,
            limit: 10,
            sort: sortField,
            direction: sortDirection,
            filter,
            search: searchTerm
          }
        });
        
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Wystąpił błąd podczas pobierania danych użytkowników.');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [currentPage, sortField, sortDirection, filter, searchTerm]);

  // Obsługa blokowania użytkownika
  const handleBlockUser = async (blockData) => {
    try {
      await axios.post(`/api/admin/users/${selectedUser._id}/block`, blockData);
      
      // Aktualizacja listy użytkowników
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { 
              ...user, 
              status: blockData.type === 'ban' ? 'banned' : 'suspended',
              blockReason: blockData.reason,
              blockExpires: blockData.type === 'suspend' 
                ? new Date(Date.now() + blockData.duration * 24 * 60 * 60 * 1000).toISOString()
                : null
            } 
          : user
      ));
      
      setIsBlockModalOpen(false);
    } catch (err) {
      console.error('Error blocking user:', err);
      alert('Wystąpił błąd podczas blokowania użytkownika.');
    }
  };

  // Obsługa odblokowania użytkownika
  const handleUnblockUser = async (userId) => {
    try {
      await axios.post(`/api/admin/users/${userId}/unblock`);
      
      // Aktualizacja listy użytkowników
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, status: 'active', blockReason: null, blockExpires: null } 
          : user
      ));
    } catch (err) {
      console.error('Error unblocking user:', err);
      alert('Wystąpił błąd podczas odblokowywania użytkownika.');
    }
  };

  // Obsługa zmiany roli użytkownika
  const handleChangeRole = async (userId, newRole) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      
      // Aktualizacja listy użytkowników
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, role: newRole } 
          : user
      ));
    } catch (err) {
      console.error('Error changing user role:', err);
      alert('Wystąpił błąd podczas zmiany roli użytkownika.');
    }
  };

  // Filtrowanie użytkowników
  const filteredUsers = users.filter(user => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower)
    );
  });

  // Renderowanie statusu użytkownika
  const renderUserStatus = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aktywny</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Zawieszony</span>;
      case 'banned':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Zbanowany</span>;
      case 'unverified':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Niezweryfikowany</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Błąd!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Zarządzanie Użytkownikami</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Szukaj użytkowników..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Wszyscy</option>
            <option value="active">Aktywni</option>
            <option value="suspended">Zawieszeni</option>
            <option value="banned">Zbanowani</option>
            <option value="unverified">Niezweryfikowani</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  if (sortField === 'email') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('email');
                    setSortDirection('asc');
                  }
                }}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  if (sortField === 'username') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('username');
                    setSortDirection('asc');
                  }
                }}
              >
                Nazwa użytkownika {sortField === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  if (sortField === 'role') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('role');
                    setSortDirection('asc');
                  }
                }}
              >
                Rola {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  if (sortField === 'status') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('status');
                    setSortDirection('asc');
                  }
                }}
              >
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => {
                  if (sortField === 'createdAt') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('createdAt');
                    setSortDirection('asc');
                  }
                }}
              >
                Data rejestracji {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.username || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderUserStatus(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      title="Edytuj"
                      onClick={() => {
                        // Implementacja edycji użytkownika
                      }}
                    >
                      <FaEdit />
                    </button>
                    
                    {user.status === 'active' || user.status === 'unverified' ? (
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Zablokuj"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsBlockModalOpen(true);
                        }}
                      >
                        <FaBan />
                      </button>
                    ) : (
                      <button 
                        className="text-green-600 hover:text-green-900"
                        title="Odblokuj"
                        onClick={() => handleUnblockUser(user._id)}
                      >
                        <FaUnlock />
                      </button>
                    )}
                    
                    {user.role !== 'admin' ? (
                      <button 
                        className="text-purple-600 hover:text-purple-900"
                        title="Nadaj uprawnienia administratora"
                        onClick={() => handleChangeRole(user._id, 'admin')}
                      >
                        <FaUserShield />
                      </button>
                    ) : (
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        title="Odbierz uprawnienia administratora"
                        onClick={() => handleChangeRole(user._id, 'user')}
                      >
                        <FaUserShield />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginacja */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Strona <span className="font-medium">{currentPage}</span> z <span className="font-medium">{totalPages}</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 border rounded-md ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Poprzednia
          </button>
          
          <button
            className={`px-4 py-2 border rounded-md ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Następna
          </button>
        </div>
      </div>
      
      {/* Modal blokowania użytkownika */}
      <UserBlockModal
        user={selectedUser}
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onBlock={handleBlockUser}
      />
    </div>
  );
};

export default UserManagement;
