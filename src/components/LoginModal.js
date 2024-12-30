import React from 'react';

const LoginModal = ({ setIsLoggedIn, onClose }) => {
  const handleLogin = () => {
    // Symulacja logowania
    setIsLoggedIn(true);
    onClose(); // Zamknięcie modala po zalogowaniu
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Zaloguj się</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email lub Numer Telefonu
            </label>
            <input
              type="text"
              id="email"
              className="w-full border-gray-300 rounded-lg shadow-sm p-2"
              placeholder="Podaj swój email lub telefon"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Hasło
            </label>
            <input
              type="password"
              id="password"
              className="w-full border-gray-300 rounded-lg shadow-sm p-2"
              placeholder="Podaj hasło"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Zaloguj się
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="#reset" className="text-green-600 hover:underline">
            Odzyskaj hasło
          </a>
          <br />
          Nie masz konta?{' '}
          <a href="#register" className="text-green-600 hover:underline">
            Zarejestruj się
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
