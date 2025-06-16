// src/components/admin/components/ReportTable.js
/**
 * Komponent tabeli zgłoszeń w panelu administratora
 * Report table component for admin panel
 */

import React from 'react';
import { FaEye, FaCheck, FaTimes, FaTrash, FaFlag, FaUser, FaCarAlt } from 'react-icons/fa';

// Komponent renderujący status zgłoszenia
const ReportStatus = ({ status }) => {
  switch (status) {
    case 'resolved':
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Rozwiązane</span>;
    case 'pending':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Oczekujące</span>;
    case 'rejected':
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Odrzucone</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  }
};

const ReportTable = ({ 
  reports, 
  sortField, 
  sortDirection, 
  onSortChange, 
  onPreview, 
  onResolve, 
  onReject,
  onDelete 
}) => {
  // Funkcja do zmiany sortowania
  const handleSort = (field) => {
    if (field === sortField) {
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  // Renderowanie nagłówka kolumny z sortowaniem
  const renderSortableHeader = (field, label) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(field)}
    >
      {label} {sortField === field && (sortDirection === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {renderSortableHeader('type', 'Typ')}
            {renderSortableHeader('reportType', 'Kategoria')}
            {renderSortableHeader('reporter', 'Zgłaszający')}
            {renderSortableHeader('status', 'Status')}
            {renderSortableHeader('createdAt', 'Data zgłoszenia')}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 mr-3 flex items-center justify-center">
                    {report.reportType === 'user' ? (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-blue-500" />
                      </div>
                    ) : report.reportType === 'ad' ? (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FaCarAlt className="text-green-500" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <FaFlag className="text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {report.reportType === 'user' ? 'Użytkownik' : 
                     report.reportType === 'ad' ? 'Ogłoszenie' : 'Komentarz'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{report.reason}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{report.reporter?.email || 'Anonimowy'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ReportStatus status={report.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(report.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    title="Podgląd"
                    onClick={() => onPreview(report)}
                  >
                    <FaEye />
                  </button>
                  
                  {report.status === 'pending' && (
                    <>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        title="Rozwiąż"
                        onClick={() => onPreview(report)}
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Odrzuć"
                        onClick={() => onReject(report._id)}
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="text-red-600 hover:text-red-900"
                    title="Usuń"
                    onClick={() => onDelete(report._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
