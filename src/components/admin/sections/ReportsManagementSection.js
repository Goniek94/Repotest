// src/components/admin/sections/ReportsManagementSection.js
/**
 * Komponent do zarządzania zgłoszeniami w panelu administratora
 * Component for managing reports in admin panel
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponenty
import ReportDetailsModal from '../components/ReportDetailsModal';
import ReportTable from '../components/ReportTable';
import Pagination from '../components/Pagination';
import SearchFilterBar from '../components/SearchFilterBar';

const ReportsManagementSection = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');

  // Opcje filtrowania
  const filterOptions = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'pending', label: 'Oczekujące' },
    { value: 'resolved', label: 'Rozwiązane' },
    { value: 'rejected', label: 'Odrzucone' },
    { value: 'user', label: 'Użytkownicy' },
    { value: 'ad', label: 'Ogłoszenia' },
    { value: 'comment', label: 'Komentarze' }
  ];

  // Pobieranie zgłoszeń
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        
        // Mapowanie filtrów na parametry API
        let status = '';
        let reportType = '';
        
        if (filter === 'pending') status = 'pending';
        else if (filter === 'resolved') status = 'resolved';
        else if (filter === 'rejected') status = 'rejected';
        else if (filter === 'user') reportType = 'user';
        else if (filter === 'ad') reportType = 'ad';
        else if (filter === 'comment') reportType = 'comment';
        
        const response = await axios.get('/api/admin/reports', {
          params: {
            page: currentPage,
            limit: 10,
            sortBy: sortField,
            sortOrder: sortDirection,
            status,
            reportType,
            search: searchTerm
          }
        });
        
        setReports(response.data.reports);
        setTotalPages(response.data.pagination.pages);
        setLoading(false);
      } catch (err) {
        setError('Wystąpił błąd podczas pobierania zgłoszeń.');
        setLoading(false);
        console.error('Error fetching reports:', err);
      }
    };

    fetchReports();
  }, [currentPage, sortField, sortDirection, filter, searchTerm]);

  // Obsługa rozwiązania zgłoszenia
  const handleResolveReport = async (reportId, resolution) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}/status`, { 
        status: 'resolved',
        adminNote: resolution,
        actionTaken: 'content_removed' // Domyślna akcja, można dodać wybór akcji w formularzu
      });
      
      // Aktualizacja listy zgłoszeń
      setReports(reports.map(report => 
        report._id === reportId 
          ? { 
              ...report, 
              status: 'resolved', 
              adminNote: resolution,
              actionTaken: 'content_removed',
              resolvedAt: new Date().toISOString()
            } 
          : report
      ));
    } catch (err) {
      console.error('Error resolving report:', err);
      alert('Wystąpił błąd podczas rozwiązywania zgłoszenia.');
    }
  };

  // Obsługa odrzucenia zgłoszenia
  const handleRejectReport = async (reportId) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}/status`, { 
        status: 'rejected',
        adminNote: 'Zgłoszenie odrzucone przez administratora',
        actionTaken: 'none'
      });
      
      // Aktualizacja listy zgłoszeń
      setReports(reports.map(report => 
        report._id === reportId 
          ? { 
              ...report, 
              status: 'rejected',
              adminNote: 'Zgłoszenie odrzucone przez administratora',
              actionTaken: 'none',
              resolvedAt: new Date().toISOString()
            } 
          : report
      ));
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert('Wystąpił błąd podczas odrzucania zgłoszenia.');
    }
  };

  // Obsługa usuwania zgłoszenia
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zgłoszenie? Ta operacja jest nieodwracalna.')) {
      return;
    }
    
    try {
      await axios.delete(`/api/admin/reports/${reportId}`);
      
      // Aktualizacja listy zgłoszeń
      setReports(reports.filter(report => report._id !== reportId));
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Wystąpił błąd podczas usuwania zgłoszenia.');
    }
  };

  // Obsługa zmiany sortowania
  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Obsługa podglądu zgłoszenia
  const handlePreviewReport = (report) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
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
      <SearchFilterBar
        title="Zarządzanie Zgłoszeniami"
        searchPlaceholder="Szukaj zgłoszeń..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={filterOptions}
      />
      
      <ReportTable
        reports={reports}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onPreview={handlePreviewReport}
        onResolve={handleResolveReport}
        onReject={handleRejectReport}
        onDelete={handleDeleteReport}
      />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onResolve={handleResolveReport}
        onReject={handleRejectReport}
      />
    </div>
  );
};

export default ReportsManagementSection;
