// src/components/admin/BonusManager.js
/**
 * Komponent do zarządzania bonusami użytkowników w panelu administratora
 * Component for managing user bonuses in the admin panel
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios/dist/node/axios.cjs';
import './DiscountManager.css'; // Używamy tych samych styli co dla DiscountManager

const BonusManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBonuses, setUserBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBonus, setNewBonus] = useState({
    type: 'discount',
    value: 10,
    description: '',
    expiresAt: ''
  });

  // Pobierz użytkowników / Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/users');
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania użytkowników:', err);
        setError('Wystąpił błąd podczas ładowania użytkowników. Spróbuj ponownie.');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Pobierz bonusy użytkownika / Fetch user bonuses
  useEffect(() => {
    const fetchUserBonuses = async () => {
      if (!selectedUser) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/users/${selectedUser._id}/bonuses`);
        setUserBonuses(response.data.bonuses);
        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania bonusów użytkownika:', err);
        setError('Wystąpił błąd podczas ładowania bonusów. Spróbuj ponownie.');
        setLoading(false);
      }
    };
    
    fetchUserBonuses();
  }, [selectedUser]);

  // Obsługa wyboru użytkownika / Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm('');
  };

  // Obsługa zmiany pola w formularzu nowego bonusu / Handle new bonus form field change
  const handleBonusFormChange = (field, value) => {
    setNewBonus(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Obsługa dodawania nowego bonusu / Handle adding new bonus
  const handleAddBonus = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert('Wybierz użytkownika, aby dodać bonus.');
      return;
    }
    
    try {
      const response = await axios.post(`/api/admin/users/${selectedUser._id}/bonuses`, newBonus);
      setUserBonuses([...userBonuses, response.data.bonus]);
      
      // Reset formularza / Reset form
      setNewBonus({
        type: 'discount',
        value: 10,
        description: '',
        expiresAt: ''
      });
      
      alert('Bonus został dodany pomyślnie.');
    } catch (err) {
      console.error('Błąd podczas dodawania bonusu:', err);
      alert('Wystąpił błąd podczas dodawania bonusu. Spróbuj ponownie.');
    }
  };

  // Obsługa usuwania bonusu / Handle bonus deletion
  const handleDeleteBonus = async (bonusId) => {
    if (!selectedUser) return;
    
    if (window.confirm('Czy na pewno chcesz usunąć ten bonus?')) {
      try {
        await axios.delete(`/api/admin/users/${selectedUser._id}/bonuses/${bonusId}`);
        setUserBonuses(userBonuses.filter(bonus => bonus._id !== bonusId));
        alert('Bonus został usunięty.');
      } catch (err) {
        console.error('Błąd podczas usuwania bonusu:', err);
        alert('Wystąpił błąd podczas usuwania bonusu. Spróbuj ponownie.');
      }
    }
  };

  // Filtrowanie użytkowników na podstawie wyszukiwania / Filter users based on search
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatowanie daty / Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Bezterminowo';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Jeśli ładowanie / If loading
  if (loading && !selectedUser) {
    return (
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Ładowanie danych...</span>
      </div>
    );
  }

  // Jeśli błąd / If error
  if (error && !selectedUser) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-triangle"></i>
        <span>{error}</span>
        <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
          Odśwież stronę
        </button>
      </div>
    );
  }

  return (
    <div className="bonus-manager-container">
      <h2 className="section-title">Zarządzanie Bonusami</h2>
      
      <div className="bonus-manager-content">
        <div className="user-selection-panel">
          <h3>Wybierz użytkownika</h3>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Szukaj użytkownika..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <div className="users-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div 
                  key={user._id} 
                  className={`user-item ${selectedUser && selectedUser._id === user._id ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.name} {user.lastName}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">Brak wyników wyszukiwania</div>
            )}
          </div>
        </div>
        
        <div className="bonus-management-panel">
          {selectedUser ? (
            <>
              <h3>Bonusy użytkownika: {selectedUser.name} {selectedUser.lastName}</h3>
              
              <div className="add-bonus-form">
                <h4>Dodaj nowy bonus</h4>
                <form onSubmit={handleAddBonus}>
                  <div className="form-group">
                    <label htmlFor="bonus-type">Typ bonusu:</label>
                    <select
                      id="bonus-type"
                      value={newBonus.type}
                      onChange={(e) => handleBonusFormChange('type', e.target.value)}
                      className="form-select"
                    >
                      <option value="discount">Zniżka</option>
                      <option value="free_listing">Darmowe ogłoszenie</option>
                      <option value="featured_listing">Wyróżnione ogłoszenie</option>
                      <option value="premium_account">Konto premium</option>
                      <option value="other">Inny</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bonus-value">Wartość:</label>
                    <input
                      id="bonus-value"
                      type="number"
                      min="0"
                      value={newBonus.value}
                      onChange={(e) => handleBonusFormChange('value', parseInt(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bonus-description">Opis:</label>
                    <textarea
                      id="bonus-description"
                      value={newBonus.description}
                      onChange={(e) => handleBonusFormChange('description', e.target.value)}
                      className="form-textarea"
                      placeholder="Opcjonalny opis bonusu"
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bonus-expiry">Data wygaśnięcia:</label>
                    <input
                      id="bonus-expiry"
                      type="date"
                      value={newBonus.expiresAt}
                      onChange={(e) => handleBonusFormChange('expiresAt', e.target.value)}
                      className="form-input"
                    />
                    <small>Pozostaw puste dla bonusu bezterminowego</small>
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Dodaj bonus
                  </button>
                </form>
              </div>
              
              <div className="user-bonuses-list">
                <h4>Aktywne bonusy</h4>
                
                {loading ? (
                  <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Ładowanie bonusów...</span>
                  </div>
                ) : userBonuses.length > 0 ? (
                  <table className="bonuses-table">
                    <thead>
                      <tr>
                        <th>Typ</th>
                        <th>Wartość</th>
                        <th>Opis</th>
                        <th>Data utworzenia</th>
                        <th>Data wygaśnięcia</th>
                        <th>Status</th>
                        <th>Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userBonuses.map(bonus => (
                        <tr key={bonus._id}>
                          <td>{bonus.type}</td>
                          <td>{bonus.value}</td>
                          <td>{bonus.description || '-'}</td>
                          <td>{formatDate(bonus.createdAt)}</td>
                          <td>{formatDate(bonus.expiresAt)}</td>
                          <td>{bonus.isUsed ? 'Wykorzystany' : 'Aktywny'}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteBonus(bonus._id)}
                              className="btn btn-sm btn-danger"
                              disabled={bonus.isUsed}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-bonuses">
                    Użytkownik nie ma żadnych bonusów
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-user-selected">
              <i className="fas fa-user-plus"></i>
              <p>Wybierz użytkownika z listy, aby zarządzać jego bonusami</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonusManager;
