import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import AuthService from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Text, Button, Container, Flex } from '../ui';

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Stan dla siły hasła
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Sprawdź, czy użytkownik jest już zalogowany
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Sprawdź, czy w URL jest token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    const emailFromUrl = params.get('email');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      if (emailFromUrl) {
        setEmail(emailFromUrl);
      }
      setStep(2);
    }
  }, [location.search]);

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPasswordStrength(e.target.value);
  };

  const isStrongPassword = (password) => {
    const { length, uppercase, lowercase, number, special } = passwordStrength;
    return length && uppercase && lowercase && number && special;
  };

  const getPasswordStrengthClass = () => {
    const { length, uppercase, lowercase, number, special } = passwordStrength;
    const strength = [length, uppercase, lowercase, number, special].filter(Boolean).length;
    if (strength === 0) return '';
    if (strength < 3) return 'bg-red-500';
    if (strength < 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!email.trim()) {
        setError('Email jest wymagany');
        return;
      }

      await AuthService.requestPasswordReset(email);
      setSuccess('Link do resetowania hasła został wysłany na podany adres email. Sprawdź swoją skrzynkę odbiorczą.');
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd podczas wysyłania linku resetującego. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token.trim()) {
        setError('Token jest wymagany');
        return;
      }
      if (!password.trim()) {
        setError('Hasło jest wymagane');
        return;
      }
      if (password !== confirmPassword) {
        setError('Hasła nie są identyczne');
        return;
      }
      if (!isStrongPassword(password)) {
        setError('Hasło nie spełnia wymagań bezpieczeństwa');
        return;
      }

      await AuthService.confirmPasswordReset(token, password);
      setSuccess('Hasło zostało zmienione. Możesz teraz zalogować się używając nowego hasła.');
      
      // Przekieruj do strony logowania po 3 sekundach
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd podczas resetowania hasła. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <Flex justify="center">
        <Card className="w-full max-w-md">
          <div className="p-6">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 text-[#35530A] hover:text-[#44671A] transition-colors"
            >
              <FaArrowLeft /> Powrót
            </button>

            <Text variant="h2" className="mb-6 text-center text-[#35530A]">
              {step === 1 ? 'Resetowanie hasła' : 'Ustaw nowe hasło'}
            </Text>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                <p>{success}</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Adres email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
                    placeholder="Podaj swój adres email"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    fullWidth
                    className="py-3"
                  >
                    {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Kod resetujący
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
                    placeholder="Wklej kod z emaila"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nowe hasło
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordInfo(!showPasswordInfo)}
                      className="text-sm text-[#35530A] hover:underline flex items-center"
                    >
                      <FaInfoCircle className="mr-1" /> Wymagania
                    </button>
                  </div>
                  
                  {showPasswordInfo && (
                    <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-sm font-medium mb-2">
                        Hasło musi zawierać:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center">
                          {passwordStrength.length ? (
                            <FaCheck className="text-green-500 mr-2" />
                          ) : (
                            <FaTimes className="text-red-500 mr-2" />
                          )}
                          Co najmniej 8 znaków
                        </li>
                        <li className="flex items-center">
                          {passwordStrength.uppercase ? (
                            <FaCheck className="text-green-500 mr-2" />
                          ) : (
                            <FaTimes className="text-red-500 mr-2" />
                          )}
                          Przynajmniej jedną wielką literę
                        </li>
                        <li className="flex items-center">
                          {passwordStrength.lowercase ? (
                            <FaCheck className="text-green-500 mr-2" />
                          ) : (
                            <FaTimes className="text-red-500 mr-2" />
                          )}
                          Przynajmniej jedną małą literę
                        </li>
                        <li className="flex items-center">
                          {passwordStrength.number ? (
                            <FaCheck className="text-green-500 mr-2" />
                          ) : (
                            <FaTimes className="text-red-500 mr-2" />
                          )}
                          Przynajmniej jedną cyfrę
                        </li>
                        <li className="flex items-center">
                          {passwordStrength.special ? (
                            <FaCheck className="text-green-500 mr-2" />
                          ) : (
                            <FaTimes className="text-red-500 mr-2" />
                          )}
                          Przynajmniej jeden znak specjalny (!@#$%^&*(),.?":{}|&lt;&gt;)
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
                      placeholder="Wprowadź nowe hasło"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  
                  {password && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full mt-2">
                        <div
                          className={`h-full rounded-full ${getPasswordStrengthClass()}`}
                          style={{
                            width: `${
                              Object.values(passwordStrength).filter(Boolean).length * 20
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Potwierdź nowe hasło
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#35530A] focus:border-[#35530A]"
                      placeholder="Potwierdź nowe hasło"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#35530A] focus:outline-none"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {password && confirmPassword && (
                    <div className="mt-2 flex items-center">
                      {password === confirmPassword ? (
                        <>
                          <FaCheck className="text-green-500 mr-2" />
                          <span className="text-sm text-green-500">
                            Hasła są zgodne
                          </span>
                        </>
                      ) : (
                        <>
                          <FaTimes className="text-red-500 mr-2" />
                          <span className="text-sm text-red-500">
                            Hasła nie są zgodne
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    fullWidth
                    className="py-3"
                  >
                    {loading ? 'Resetowanie...' : 'Zresetuj hasło'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </Flex>
    </Container>
  );
};

export default ResetPassword;
