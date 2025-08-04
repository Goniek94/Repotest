import React, { useState } from 'react';
import { 
  FaShieldAlt, FaKey, FaEye, FaEyeSlash, FaSave, FaTrash, FaExclamationTriangle
} from 'react-icons/fa';

const SecuritySection = ({ 
  passwordForm, 
  setPasswordForm,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  setLoading,
  error,
  setError,
  success,
  setSuccess
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Hasło zostało zmienione pomyślnie!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Wystąpił błąd podczas zmiany hasła');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Żądanie usunięcia konta zostało wysłane. Sprawdź email.');
      setShowDeleteConfirm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Wystąpił błąd podczas usuwania konta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Nagłówek sekcji */}
      <div className="flex items-center space-x-4 p-6 bg-white rounded-xl border border-gray-200 mb-6">
        <div className="w-12 h-12 bg-[#35530A] rounded-xl flex items-center justify-center">
          <FaShieldAlt className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bezpieczeństwo</h2>
          <p className="text-gray-600 mt-1">Zarządzaj hasłem i zabezpieczeniami konta</p>
        </div>
      </div>

      {/* Formularz zmiany hasła */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaKey className="mr-3 text-[#35530A]" />
            Zmiana hasła
          </h3>
          <p className="text-gray-600 mt-1">Zaktualizuj swoje hasło dostępu</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Obecne hasło</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] transition-all duration-200"
                placeholder="Wprowadź obecne hasło"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nowe hasło</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] transition-all duration-200"
                placeholder="Wprowadź nowe hasło"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Potwierdź nowe hasło</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A] transition-all duration-200"
                placeholder="Potwierdź nowe hasło"
              />
            </div>
            {passwordForm.newPassword && passwordForm.confirmPassword && (
              <div className="mt-2 text-sm">
                {passwordForm.newPassword === passwordForm.confirmPassword ? (
                  <span className="text-green-600">✓ Hasła są zgodne</span>
                ) : (
                  <span className="text-red-600">✗ Hasła nie są zgodne</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-8 py-3 border border-transparent rounded-xl shadow-sm text-white font-semibold bg-[#35530A] hover:bg-[#2a4208] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#35530A] transition-all duration-200 disabled:opacity-50"
          >
            <FaSave className="mr-2" />
            {loading ? 'Zapisywanie...' : 'Zmień hasło'}
          </button>
        </div>
      </form>

      {/* Sekcja usuwania konta */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Strefa niebezpieczna</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center space-x-3">
              <FaTrash className="text-red-500 text-lg" />
              <div>
                <h4 className="font-medium text-red-900">Usuń konto</h4>
                <p className="text-sm text-red-600">Trwale usuń swoje konto i wszystkie dane</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Usuń konto
            </button>
          </div>
        </div>
      </div>

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">Potwierdź usunięcie konta</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Ta akcja jest nieodwracalna. Wszystkie Twoje dane, ogłoszenia i wiadomości zostaną trwale usunięte.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Usuwanie...' : 'Usuń konto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySection;
