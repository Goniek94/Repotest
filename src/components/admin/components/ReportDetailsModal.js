// src/components/admin/components/ReportDetailsModal.js
/**
 * Komponent modalny do wyświetlania szczegółów zgłoszenia w panelu administratora
 * Modal component for displaying report details in admin panel
 */

import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ReportDetailsModal = ({ report, isOpen, onClose, onResolve, onReject }) => {
  const [resolution, setResolution] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);

  if (!isOpen || !report) return null;

  const handleResolve = () => {
    onResolve(report._id, resolution);
    setResolution('');
    setShowResolutionForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">
            Szczegóły zgłoszenia
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {report.reportType === 'user' ? 'Zgłoszenie użytkownika' : 
                   report.reportType === 'ad' ? 'Zgłoszenie ogłoszenia' : 'Zgłoszenie komentarza'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Informacje o zgłoszeniu</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Typ zgłoszenia:</span>
                <span className="ml-2 font-medium">{report.reportType}</span>
              </div>
              <div>
                <span className="text-gray-500">Data zgłoszenia:</span>
                <span className="ml-2 font-medium">{new Date(report.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 font-medium">
                  {report.status === 'pending' && 'Oczekujące'}
                  {report.status === 'resolved' && 'Rozwiązane'}
                  {report.status === 'rejected' && 'Odrzucone'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Zgłaszający:</span>
                <span className="ml-2 font-medium">{report.reporter?.username || report.reporter?.email || 'Anonimowy'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {report.reportType === 'user' ? 'Zgłoszony użytkownik' : 
               report.reportType === 'ad' ? 'Zgłoszone ogłoszenie' : 'Zgłoszony komentarz'}
            </h3>
            {report.reportType === 'user' && report.reportedItemDetails && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Użytkownik:</span>
                  <span className="ml-2 font-medium">{report.reportedItemDetails.email || 'Nieznany'}</span>
                </div>
                <div>
                  <span className="text-gray-500">ID użytkownika:</span>
                  <span className="ml-2 font-medium">{report.reportedItem || 'Brak'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Imię i nazwisko:</span>
                  <span className="ml-2 font-medium">
                    {report.reportedItemDetails.name} {report.reportedItemDetails.lastName}
                  </span>
                </div>
              </div>
            )}
            {report.reportType === 'ad' && report.reportedItemDetails && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tytuł ogłoszenia:</span>
                  <span className="ml-2 font-medium">{report.reportedItemDetails.title || 'Nieznany'}</span>
                </div>
                <div>
                  <span className="text-gray-500">ID ogłoszenia:</span>
                  <span className="ml-2 font-medium">{report.reportedItem || 'Brak'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Właściciel:</span>
                  <span className="ml-2 font-medium">
                    {report.reportedItemDetails.user?.email || 'Nieznany'}
                  </span>
                </div>
              </div>
            )}
            {report.reportType === 'comment' && report.reportedItemDetails && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Treść komentarza:</span>
                  <span className="ml-2 font-medium">{report.reportedItemDetails.content || 'Nieznany'}</span>
                </div>
                <div>
                  <span className="text-gray-500">ID komentarza:</span>
                  <span className="ml-2 font-medium">{report.reportedItem || 'Brak'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Autor:</span>
                  <span className="ml-2 font-medium">
                    {report.reportedItemDetails.user?.email || 'Nieznany'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Ogłoszenie:</span>
                  <span className="ml-2 font-medium">
                    {report.reportedItemDetails.ad?.title || 'Nieznane'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Opis zgłoszenia</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{report.description}</p>
          </div>

          {report.status === 'resolved' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Rozwiązanie</h3>
              <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">{report.resolution}</p>
            </div>
          )}

          {report.status === 'rejected' && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Powód odrzucenia</h3>
              <p className="text-sm text-gray-600 bg-red-50 p-3 rounded">{report.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Przyciski akcji */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Zamknij
          </button>

          {report.status === 'pending' && (
            <>
              {!showResolutionForm ? (
                <>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    onClick={() => {
                      onReject(report._id);
                      onClose();
                    }}
                  >
                    Odrzuć
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={() => setShowResolutionForm(true)}
                  >
                    Rozwiąż
                  </button>
                </>
              ) : (
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Opisz podjęte działania..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    onClick={handleResolve}
                    disabled={!resolution.trim()}
                  >
                    Zatwierdź
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => setShowResolutionForm(false)}
                  >
                    Anuluj
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
