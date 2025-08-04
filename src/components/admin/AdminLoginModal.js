/**
 * ADMIN LOGIN MODAL
 * 
 * Modal logowania do panelu administratora
 * Pojawia się po kliknięciu "Panel Administratora"
 */

import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import { adminApi } from '../../services/api/adminApi';

const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError('Wszystkie pola są wymagane');
        setLoading(false);
        return;
      }

      // Call admin login API
      const response = await adminApi.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Success - close modal and notify parent
        onLoginSuccess(response.user);
        onClose();
        
        // Reset form
        setFormData({ email: '', password: '' });
      } else {
        setError(response.message || 'Błąd logowania');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      if (error.response?.status === 401) {
        setError('Nieprawidłowy email lub hasło');
      } else if (error.response?.status === 403) {
        setError('Brak uprawnień administratora');
      } else if (error.response?.status === 429) {
        setError('Zbyt wiele prób logowania. Spróbuj ponownie później');
      } else {
        setError('Błąd połączenia z serwerem');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ email: '', password: '' });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Panel Administratora
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Zaloguj się aby uzyskać dostęp do panelu administratora
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email administratora
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-50"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                Hasło
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-50"
                  placeholder="Wprowadź hasło"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Logowanie...</span>
                </div>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Bezpieczeństwo</p>
                <p>Panel administratora jest chroniony dodatkowymi zabezpieczeniami. Wszystkie działania są logowane.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Marketplace Admin Panel v1.0
            </p>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
