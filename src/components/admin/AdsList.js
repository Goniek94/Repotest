// src/components/admin/AdsList.js
/**
 * Komponent do zarządzania ogłoszeniami w panelu administratora
 * Component for managing ads in the admin panel
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminListings from './listings/AdminListings';

const AdsList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    sortBy: 'newest'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  // Pobierz ogłoszenia / Fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/ads', {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            status: filters.status !== 'all' ? filters.status : undefined,
            category: filters.category !== 'all' ? filters.category : undefined,
            sortBy: filters.sortBy
          }
        });
        
        setAds(response.data.ads);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
        setLoading(false);
      } catch (err) {
        console.error('Błąd podczas pobierania ogłoszeń:', err);
        setError('Wystąpił błąd podczas ładowania ogłoszeń. Spróbuj ponownie.');
        setLoading(false);
      }
    };
    
    fetchAds();
  }, [pagination.page, pagination.limit, filters]);

  // Obsługa zmiany filtrów / Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1 // Reset page when filters change
    }));
  };

  // Obsługa zmiany strony / Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Obsługa usuwania ogłoszenia / Handle ad deletion
  const handleDeleteAd = async (adId) => {
    if (window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) {
      try {
        await axios.delete(`/api/admin/ads/${adId}`);
        setAds(ads.filter(ad => ad._id !== adId));
        alert('Ogłoszenie zostało usunięte.');
      } catch (err) {
        console.error('Błąd podczas usuwania ogłoszenia:', err);
        alert('Wystąpił błąd podczas usuwania ogłoszenia. Spróbuj ponownie.');
      }
    }
  };

  // Obsługa edycji ogłoszenia / Handle ad edit
  const handleEditAd = (adId) => {
    window.location.href = `/admin/ads/${adId}/edit`;
  };

  // Obsługa zmiany statusu ogłoszenia / Handle ad status change
  const handleStatusChange = async (adId, newStatus) => {
    try {
      await axios.put(`/api/admin/ads/${adId}`, { status: newStatus });
      setAds(ads.map(ad => {
        if (ad._id === adId) {
          return { ...ad, status: newStatus };
        }
        return ad;
      }));
      alert(`Status ogłoszenia został zmieniony na: ${newStatus}`);
    } catch (err) {
      console.error('Błąd podczas zmiany statusu ogłoszenia:', err);
      alert('Wystąpił błąd podczas zmiany statusu ogłoszenia. Spróbuj ponownie.');
    }
  };

  // Obsługa ustawienia zniżki / Handle setting discount
  const handleSetDiscount = async (adId, discountValue) => {
    try {
      await axios.put(`/api/admin/ads/${adId}/discount`, { discount: discountValue });
      setAds(ads.map(ad => {
        if (ad._id === adId) {
          return { ...ad, discount: discountValue };
        }
        return ad;
      }));
      alert(`Zniżka ${discountValue}% została ustawiona dla ogłoszenia.`);
    } catch (err) {
      console.error('Błąd podczas ustawiania zniżki:', err);
      alert('Wystąpił błąd podczas ustawiania zniżki. Spróbuj ponownie.');
    }
  };

  // Jeśli ładowanie / If loading
  if (loading) {
    return (
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Ładowanie ogłoszeń...</span>
      </div>
    );
  }

  // Jeśli błąd / If error
  if (error) {
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
    <div className="ads-list-container">
      <div className="ads-list-header">
        <h2 className="section-title">Zarządzanie Ogłoszeniami</h2>
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter" 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="all">Wszystkie</option>
              <option value="active">Aktywne</option>
              <option value="pending">Oczekujące</option>
              <option value="rejected">Odrzucone</option>
              <option value="expired">Wygasłe</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category-filter">Kategoria:</label>
            <select 
              id="category-filter" 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="all">Wszystkie</option>
              <option value="cars">Samochody</option>
              <option value="motorcycles">Motocykle</option>
              <option value="parts">Części</option>
              <option value="accessories">Akcesoria</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-filter">Sortuj według:</label>
            <select 
              id="sort-filter" 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="form-select"
            >
              <option value="newest">Najnowsze</option>
              <option value="oldest">Najstarsze</option>
              <option value="price_asc">Cena: rosnąco</option>
              <option value="price_desc">Cena: malejąco</option>
              <option value="title_asc">Tytuł: A-Z</option>
              <option value="title_desc">Tytuł: Z-A</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="ads-list-content">
        <table className="ads-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tytuł</th>
              <th>Użytkownik</th>
              <th>Kategoria</th>
              <th>Cena</th>
              <th>Status</th>
              <th>Data utworzenia</th>
              <th>Zniżka</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {ads.length > 0 ? (
              ads.map(ad => (
                <tr key={ad._id}>
                  <td>{ad._id.substring(0, 8)}...</td>
                  <td>{ad.title}</td>
                  <td>{ad.user?.email || 'Nieznany'}</td>
                  <td>{ad.category}</td>
                  <td>{ad.price} PLN</td>
                  <td>
                    <select 
                      value={ad.status} 
                      onChange={(e) => handleStatusChange(ad._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="active">Aktywne</option>
                      <option value="pending">Oczekujące</option>
                      <option value="rejected">Odrzucone</option>
                      <option value="expired">Wygasłe</option>
                    </select>
                  </td>
                  <td>{new Date(ad.createdAt).toLocaleDateString('pl-PL')}</td>
                  <td>
                    <div className="discount-input-group">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={ad.discount || 0} 
                        onChange={(e) => handleSetDiscount(ad._id, e.target.value)}
                        className="discount-input"
                      />
                      <span>%</span>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEditAd(ad._id)} 
                      className="btn btn-sm btn-primary mr-2"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteAd(ad._id)} 
                      className="btn btn-sm btn-danger"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  Brak ogłoszeń spełniających kryteria wyszukiwania
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination-container">
        <button 
          onClick={() => handlePageChange(pagination.page - 1)} 
          disabled={pagination.page === 1}
          className="btn btn-sm btn-secondary"
        >
          <i className="fas fa-chevron-left"></i> Poprzednia
        </button>
        
        <span className="pagination-info">
          Strona {pagination.page} z {Math.ceil(pagination.total / pagination.limit)}
        </span>
        
        <button 
          onClick={() => handlePageChange(pagination.page + 1)} 
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          className="btn btn-sm btn-secondary"
        >
          Następna <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default AdsList;
