import React, { useState } from 'react';

/**
 * Przykładowy komponent obsługujący powiadomienia użytkownika.
 * Zawiera:
 *  - listę powiadomień w "folderach" (opcjonalnie, np. 'all', 'system', 'offers'),
 *  - flagi: isRead, isImportant,
 *  - funkcje: oznacz jako przeczytane, usuń, toggle ważne,
 *  - wyszukiwarkę po tytule i treści.
 */
const UserNotifications = () => {
  // ================================
  // 1. PRZYKŁADOWE DANE POWIADOMIEŃ
  // ================================
  // Każde powiadomienie ma np.:
  // id, title, date, body, folder/kategoria, isRead, isImportant
  const [notifications, setNotifications] = useState([
    {
      id: 201,
      title: 'Nowa wiadomość od użytkownika Janek123',
      body: 'Masz nową wiadomość w swojej skrzynce. Kliknij tutaj, aby sprawdzić.',
      date: '2024-01-06',
      folder: 'all',        // Możesz używać 'system', 'offers' itd.
      isRead: false,
      isImportant: false
    },
    {
      id: 202,
      title: 'Potwierdzenie wystawienia ogłoszenia',
      body: 'Twoje ogłoszenie "Volkswagen Golf" zostało pomyślnie opublikowane.',
      date: '2024-01-05',
      folder: 'all',
      isRead: true,
      isImportant: false
    },
    {
      id: 203,
      title: 'Oferta specjalna: Pakiet wyróżnień -20%',
      body: 'Skorzystaj z oferty, aby szybciej sprzedać swoje przedmioty.',
      date: '2024-01-04',
      folder: 'offers',
      isRead: false,
      isImportant: true
    },
    {
      id: 204,
      title: 'Planowana przerwa techniczna',
      body: 'W nocy z 10 na 11 stycznia serwis będzie niedostępny przez 2h.',
      date: '2024-01-02',
      folder: 'system',
      isRead: false,
      isImportant: false
    }
  ]);

  // ================================
  // 2. STANY: folder/kategoria, wyszukiwanie, wybrany notificationId
  // ================================
  const [activeFolder, setActiveFolder] = useState('all'); // all, system, offers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  // ================================
  // 3. FUNKCJE POMOCNICZE
  // ================================
  // Filtrowanie (po folderze i wyszukiwarce)
  const filteredNotifications = notifications.filter((notif) => {
    // Folder/kategoria
    if (activeFolder !== 'all' && notif.folder !== activeFolder) return false;

    // Wyszukiwanie
    const q = searchQuery.toLowerCase();
    return (
      notif.title.toLowerCase().includes(q) ||
      notif.body.toLowerCase().includes(q)
    );
  });

  // Znajdź powiadomienie, które jest wybrane (po ID)
  const selectedNotification = notifications.find(
    (n) => n.id === selectedNotificationId
  );

  // Oznacz jako przeczytane
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  // Usuń powiadomienie (np. całkowicie z listy)
  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotificationId === id) {
      setSelectedNotificationId(null);
    }
  };

  // Zaznacz jako ważne / usuń ważne
  const handleToggleImportant = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isImportant: !n.isImportant } : n
      )
    );
  };

  // ================================
  // 4. RENDER
  // ================================
  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-[2px] flex"
        style={{ minHeight: '500px' }}
      >
        {/* LEWA KOLUMNA: foldery/kategorie */}
        <div className="w-1/4 border-r border-gray-200 flex flex-col">
          {/* Nagłówek */}
          <div className="bg-[#35530A] text-white p-4 rounded-t-[2px]">
            <h2 className="text-xl font-bold uppercase">Powiadomienia</h2>
          </div>

          {/* Kategorie (foldery) */}
          <div className="p-4 space-y-2 border-b border-gray-200">
            {[
              { key: 'all', label: 'Wszystkie' },
              { key: 'system', label: 'Systemowe' },
              { key: 'offers', label: 'Oferty' }
            ].map((cat) => (
              <button
                key={cat.key}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 font-semibold
                  ${activeFolder === cat.key ? 'bg-gray-100' : 'bg-white'}
                `}
                onClick={() => {
                  setActiveFolder(cat.key);
                  setSelectedNotificationId(null);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Wyszukiwarka */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Szukaj w tytułach / treści..."
              className="w-full border border-gray-300 rounded px-2 py-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ŚRODKOWA KOLUMNA: lista powiadomień */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <p className="text-gray-500 p-4">Brak powiadomień.</p>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 
                    ${selectedNotificationId === notif.id ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    setSelectedNotificationId(notif.id);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">
                      {notif.title.length > 35
                        ? notif.title.slice(0, 35) + '...'
                        : notif.title}
                    </span>
                    {/* Ikonka "ważne" */}
                    {notif.isImportant && (
                      <span title="Ważne" className="text-red-500 font-bold ml-2">
                        [!]
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {notif.date}{' '}
                    {!notif.isRead && (
                      <span
                        className="inline-block w-2 h-2 rounded-full bg-blue-500 ml-2"
                        title="Nieprzeczytane"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PRAWA KOLUMNA: szczegóły wybranego powiadomienia */}
        <div className="w-5/12 flex flex-col">
          {selectedNotification ? (
            <div className="flex-1 flex flex-col p-4">
              <h3 className="text-lg font-bold mb-2">{selectedNotification.title}</h3>
              <div className="text-sm text-gray-600 mb-2">
                {selectedNotification.date}
                {!selectedNotification.isRead ? ' (nieprzeczytane)' : ''}
              </div>
              <div className="text-sm border-t border-gray-200 pt-2 mt-2 flex-1">
                {selectedNotification.body}
              </div>

              {/* Przyciski akcji */}
              <div className="mt-4 flex gap-2">
                {/* Oznacz jako przeczytane (jeśli jeszcze nieprzeczytane) */}
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(selectedNotification.id)}
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Oznacz jako przeczytane
                  </button>
                )}

                {/* Zaznacz/odznacz jako ważne */}
                <button
                  onClick={() => handleToggleImportant(selectedNotification.id)}
                  className="bg-yellow-500 text-green-800 px-3 py-2 rounded hover:bg-yellow-600 text-sm font-bold"
                >
                  {selectedNotification.isImportant ? 'Usuń ważne' : 'Oznacz jako ważne'}
                </button>

                {/* Usuń powiadomienie */}
                <button
                  onClick={() => handleDelete(selectedNotification.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                >
                  Usuń
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 text-gray-500 italic">
              Wybierz powiadomienie z listy po lewej.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
