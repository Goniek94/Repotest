import React, { useState, useEffect } from 'react';
import { FaGoogle, FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sprawdź, czy użytkownik jest już zalogowany
  useEffect(() => {
    if (isAuthenticated && window.location.pathname === '/login') {
      // Przekieruj na stronę główną lub poprzednią stronę, jeśli jest
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email.trim()) {
        setError('Email jest wymagany');
        setLoading(false);
        return;
      }
      if (!password.trim()) {
        setError('Hasło jest wymagane');
        setLoading(false);
        return;
      }

      console.log('LoginModal - próba logowania');
      // Prawdziwe logowanie
      await login(email, password);
      console.log('Logowanie udane');

      // Przekierowanie po zalogowaniu
      if (window.location.pathname === '/login') {
        const returnPath = location.state?.from || '/';
        console.log('Przekierowuję do:', returnPath);
        navigate(returnPath, { replace: true });
      }

      if (onClose) onClose();
    } catch (err) {
      console.error("Błąd logowania:", err);
      setError(typeof err === 'string' ? err : 'Wystąpił błąd podczas logowania. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleInfoBox = () => {
    setShowInfo(!showInfo);
  };

  if (!isOpen && window.location.pathname !== '/login') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-2 sm:px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl max-w-md w-full relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-2xl font-bold"
          >
            ×
          </button>
        )}
        <h2 className="text-xl sm:text-2xl font-bold uppercase mb-6 text-center text-[#35530A]">
          Zaloguj się
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 uppercase text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-[2px] focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
              placeholder="Podaj swój email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 uppercase text-gray-700">
              Hasło
              <button 
                type="button" 
                onClick={toggleInfoBox}
                className="ml-1 text-gray-500 hover:text-[#35530A] focus:outline-none"
                aria-label="Informacje o haśle"
              >
                <FaInfoCircle size={14} />
              </button>
            </label>

            {showInfo && (
              <div className="mb-2 p-2 bg-blue-50 text-sm rounded text-blue-800 border border-blue-200">
                <p>Hasło musi zawierać co najmniej 8 znaków, w tym jedną wielką literę, jedną cyfrę i jeden znak specjalny.</p>
              </div>
            )}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-[2px] focus:outline-none focus:border-[#35530A] focus:ring-1 focus:ring-[#35530A]"
                placeholder="Podaj hasło"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/reset-password"
              className="text-[#35530A] hover:underline text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
              }}
            >
              Zapomniałeś hasła?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#35530A] text-white py-3 rounded-[2px] uppercase text-base font-semibold hover:bg-[#2D4A06] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>

          <div className="relative flex items-center justify-center mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Lub</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-[2px] uppercase text-base font-semibold hover:bg-gray-50 transition-colors"
          >
            <FaGoogle className="text-red-600" />
            Zaloguj przez Google
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          <span className="uppercase text-gray-700">Nie masz konta?</span>{' '}
          <Link
            to="/register"
            className="text-[#35530A] font-semibold hover:underline uppercase"
            onClick={onClose}
          >
            Zarejestruj się
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;