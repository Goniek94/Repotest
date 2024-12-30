// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    termsAccepted: false,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      dob,
      termsAccepted,
    } = formData;

    if (!firstName || !lastName || !email || !phoneNumber || !password || !dob || !termsAccepted) {
      setError('Wszystkie obowiązkowe pola muszą być wypełnione i musisz zaakceptować warunki.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są takie same.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      setError('Rejestracja nie powiodła się. Spróbuj ponownie.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-lg px-6 py-8 bg-white shadow-2xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Zarejestruj się</h2>
        <form onSubmit={handleSubmit}>
          {/* Imię i Nazwisko */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imię */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Imię *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>

            {/* Nazwisko */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Nazwisko *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Numer telefonu */}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Numer telefonu *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Hasło i Potwierdź hasło */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Hasło */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Hasło *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>

            {/* Potwierdź hasło */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Potwierdź hasło *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
          </div>

          {/* Data urodzenia */}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Data urodzenia *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Adres */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Adres</h3>

            {/* Ulica */}
            <div className="mt-2">
              <label className="block text-gray-700 text-sm font-semibold mb-1">Ulica</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Miasto i Województwo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Miasto */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Miasto</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Województwo */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Województwo</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Kod pocztowy */}
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1">Kod pocztowy</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Akceptacja warunków */}
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-green-600"
                required
              />
              <span className="ml-2 text-sm text-gray-700">
                Akceptuję{' '}
                <a href="/regulamin" className="text-green-600 hover:underline">
                  regulamin
                </a>
              </span>
            </label>
          </div>

          {/* Wyświetlanie błędów */}
          {error && <p className="text-red-500 text-sm italic mt-4">{error}</p>}

          {/* Przycisk rejestracji */}
          <div className="mt-6 flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              Zarejestruj się
            </button>
          </div>

          {/* Link do logowania */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Masz już konto?{' '}
              <a href="/login" className="text-green-600 hover:underline font-medium">
                Zaloguj się
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
