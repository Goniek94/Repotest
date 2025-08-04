import React, { useState } from 'react';
import { FaBell, FaSave } from 'react-icons/fa';

const NotificationsSection = ({ notifications, setNotifications, loading, setLoading, error, setError, success, setSuccess }) => {
  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Ustawienia powiadomień zostały zaktualizowane!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Wystąpił błąd podczas zapisywania ustawień');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Nagłówek sekcji */}
      <div className="flex items-center space-x-4 p-6 bg-white rounded-xl border border-gray-200 mb-6 flex-shrink-0">
        <div className="w-12 h-12 bg-[#35530A] rounded-xl flex items-center justify-center">
          <FaBell className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Powiadomienia</h2>
          <p className="text-gray-600 mt-1">Dostosuj sposób otrzymywania powiadomień</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <form onSubmit={handleSaveNotifications} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-2 pb-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Powiadomienia email</h3>
                <p className="text-sm text-gray-600">Ważne aktualizacje i informacje</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35530A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Powiadomienia SMS</h3>
                <p className="text-sm text-gray-600">Pilne informacje i alerty</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35530A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Powiadomienia push</h3>
                <p className="text-sm text-gray-600">Natychmiastowe powiadomienia w przeglądarce</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35530A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Newsletter</h3>
                <p className="text-sm text-gray-600">Promocje i aktualności</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.newsletter}
                  onChange={(e) => handleNotificationChange('newsletter', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35530A]"></div>
              </label>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-3 border border-transparent rounded-xl shadow-sm text-white font-semibold bg-[#35530A] hover:bg-[#2a4208] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#35530A] transition-all duration-200 disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {loading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationsSection;
