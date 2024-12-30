import React, { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('dane'); // Domyślnie wyświetlane "Dane użytkownika"

  const handleDeleteAccount = () => {
    if (window.confirm('Czy na pewno chcesz usunąć swoje konto?')) {
      console.log('Konto zostało usunięte.');
      // Logika usuwania konta (np. wywołanie API)
    }
  };

  const tabs = [
    { key: 'dane', label: 'Dane użytkownika' },
    { key: 'statystyki', label: 'Statystyki konta' },
    { key: 'mojeOgloszenia', label: 'Moje ogłoszenia' },
    { key: 'ulubione', label: 'Ulubione ogłoszenia' },
    { key: 'wiadomosci', label: 'Wiadomości' },
    { key: 'powiadomienia', label: 'Powiadomienia' },
    { key: 'historia', label: 'Historia transakcji' },
    { key: 'ustawienia', label: 'Ustawienia konta' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dane':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dane użytkownika</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Imię i nazwisko</label>
                <input
                  type="text"
                  placeholder="Wprowadź swoje imię i nazwisko"
                  className="w-full mt-2 p-3 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Adres e-mail</label>
                <input
                  type="email"
                  placeholder="Wprowadź swój e-mail"
                  className="w-full mt-2 p-3 border rounded-lg"
                />
              </div>
              <button className="bg-green-600 text-white py-2 px-4 rounded-lg">
                Zapisz zmiany
              </button>
            </form>
          </div>
        );
      case 'statystyki':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Statystyki konta</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">15</p>
                <p className="text-sm text-gray-600">Aktywne ogłoszenia</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-blue-600">5</p>
                <p className="text-sm text-gray-600">Ulubione ogłoszenia</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-yellow-600">10</p>
                <p className="text-sm text-gray-600">Wiadomości</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-red-600">Aktywne</p>
                <p className="text-sm text-gray-600">Status konta</p>
              </div>
            </div>
          </div>
        );
      case 'mojeOgloszenia':
        return <p>Lista Twoich ogłoszeń będzie tutaj wyświetlona.</p>;
      case 'ulubione':
        return <p>Ulubione ogłoszenia zostaną tu wyświetlone.</p>;
      case 'wiadomosci':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Wiadomości</h2>
            <div className="mb-4">
              <button
                onClick={() => alert('Przychodzące wiadomości')}
                className="bg-gray-200 py-2 px-4 rounded-lg mr-4"
              >
                Przychodzące
              </button>
              <button
                onClick={() => alert('Wysłane wiadomości')}
                className="bg-gray-200 py-2 px-4 rounded-lg mr-4"
              >
                Wysłane
              </button>
              <button
                onClick={() => alert('Wersje robocze')}
                className="bg-gray-200 py-2 px-4 rounded-lg mr-4"
              >
                Wersje robocze
              </button>
              <button
                onClick={() => alert('Zapisane wiadomości')}
                className="bg-gray-200 py-2 px-4 rounded-lg"
              >
                Zapisane
              </button>
            </div>
          </div>
        );
      case 'powiadomienia':
        return <p>Twoje powiadomienia są tutaj wyświetlone.</p>;
      case 'historia':
        return <p>Historia transakcji jest tutaj widoczna.</p>;
      case 'ustawienia':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ustawienia konta</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Zmień hasło</label>
              <input
                type="password"
                placeholder="Nowe hasło"
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
              Zapisz nowe hasło
            </button>
            <hr className="my-6" />
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white py-2 px-4 rounded-lg"
            >
              Usuń konto
            </button>
          </div>
        );
      default:
        return <p>Wybierz opcję z menu po lewej stronie.</p>;
    }
  };

  return (
    <div className="flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">Twoje Konto</h1>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.key} className="mb-4">
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  activeTab === tab.key ? 'bg-green-600 text-white' : 'hover:bg-green-100'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderTabContent()}</main>
    </div>
  );
};

export default Profile;
