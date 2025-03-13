// Transactions.js
import React, { useState } from 'react';

const Transactions = () => {
  // Dane przykładowe
  const initialTransactions = [
    {
      id: 1,
      title: 'Wyróżnienie ogłoszenia BMW M3',
      date: '2024-01-15',
      amount: -50,
      status: 'completed',
      type: 'promotion'
    },
    {
      id: 2,
      title: 'Doładowanie konta',
      date: '2024-01-14',
      amount: 200,
      status: 'completed',
      type: 'deposit'
    },
    {
      id: 3,
      title: 'Wyróżnienie ogłoszenia Audi A4',
      date: '2024-01-10',
      amount: -50,
      status: 'completed',
      type: 'promotion'
    },
    {
      id: 4,
      title: 'Zakup pakietu ogłoszeń',
      date: '2024-01-05',
      amount: -100,
      status: 'completed',
      type: 'payment'
    },
    {
      id: 5,
      title: 'Doładowanie konta (promocja świąteczna)',
      date: '2023-12-24',
      amount: 300,
      status: 'completed',
      type: 'deposit'
    },
    {
      id: 6,
      title: 'Wyróżnienie ogłoszenia Mercedes E200',
      date: '2023-10-15',
      amount: -50,
      status: 'completed',
      type: 'promotion'
    },
    {
      id: 7,
      title: 'Opłata za wystawienie ogłoszenia',
      date: '2023-08-20',
      amount: -30,
      status: 'completed',
      type: 'payment'
    },
  ];

  // Stany globalne
  const [transactions] = useState(initialTransactions);

  // 1) Filtr typu transakcji: deposit / promotion / payment / all
  const [filterType, setFilterType] = useState('all');

  // 2) Filtr daty: 'all' / '30' (ostatnie 30 dni) / '90' / '365'
  const [dateRange, setDateRange] = useState('all');

  // 3) Sortowanie daty: asc / desc
  const [dateSort, setDateSort] = useState('desc');

  // Funkcja do parsowania daty i zwracania liczby milisekund
  const parseDateMs = (dateStr) => new Date(dateStr).getTime();

  // Funkcja, czy data transakcji mieści się w określonym zakresie (np. 30 dni)
  const isWithinDays = (dateStr, days) => {
    const now = Date.now();
    const txTime = parseDateMs(dateStr);
    const msInOneDay = 24 * 60 * 60 * 1000;
    const cutoff = now - days * msInOneDay;
    return txTime >= cutoff;
  };

  // Przygotowujemy listę transakcji do wyświetlenia: najpierw filtr, potem sort
  const filteredAndSortedTx = transactions
    .filter((tx) => {
      // Filtr typu
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }

      // Filtr zakresu dat
      if (dateRange !== 'all') {
        // dateRange jest np. '30', '90', '365'
        const days = parseInt(dateRange, 10);
        if (!isWithinDays(tx.date, days)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const aDate = parseDateMs(a.date);
      const bDate = parseDateMs(b.date);
      return dateSort === 'asc' ? aDate - bDate : bDate - aDate;
    });

  // ---------------------
  // LEWA KOLUMNA = MENU
  // ---------------------
  const renderLeftMenu = () => (
    <div className="bg-white rounded-md shadow p-4 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">Typ transakcji</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${filterType === 'all'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setFilterType('all')}
            >
              Wszystkie
            </button>
          </li>
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${filterType === 'deposit'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setFilterType('deposit')}
            >
              Doładowania
            </button>
          </li>
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${filterType === 'promotion'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setFilterType('promotion')}
            >
              Wyróżnienia
            </button>
          </li>
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${filterType === 'payment'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setFilterType('payment')}
            >
              Inne płatności
            </button>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Okres</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${dateRange === 'all'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setDateRange('all')}
            >
              Wszystkie daty
            </button>
          </li>
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${dateRange === '30'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setDateRange('30')}
            >
              Ostatnie 30 dni
            </button>
          </li>
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${dateRange === '90'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setDateRange('90')}
            >
              Ostatnie 90 dni
            </button>
          </li>
          <li>
            <button
              className={`
                w-full text-left px-2 py-1 rounded
                ${dateRange === '365'
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => setDateRange('365')}
            >
              Ostatni rok
            </button>
          </li>
        </ul>
      </div>

      <div className="border-t pt-3">
        <p className="text-gray-700 text-sm mb-1 font-semibold">Sortowanie wg daty:</p>
        <div className="flex gap-2">
          <button
            className={`
              px-3 py-1 rounded text-sm
              ${dateSort === 'desc' ? 'bg-green-600 text-white' : 'bg-gray-200'}
            `}
            onClick={() => setDateSort('desc')}
          >
            Najnowsze
          </button>
          <button
            className={`
              px-3 py-1 rounded text-sm
              ${dateSort === 'asc' ? 'bg-green-600 text-white' : 'bg-gray-200'}
            `}
            onClick={() => setDateSort('asc')}
          >
            Najstarsze
          </button>
        </div>
      </div>
    </div>
  );

  // ---------------------
  // PRAWA KOLUMNA = TABELA
  // ---------------------
  const renderTransactionsTable = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">HISTORIA TRANSAKCJI</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedTx.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.title}
                </td>
                <td
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}
                  `}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount} PLN
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`
                      px-2 py-1 text-xs rounded-full
                      ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    `}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredAndSortedTx.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  Brak transakcji w wybranej kategorii lub zakresie dat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // -------------------------
  // GŁÓWNY RENDER DWUKOLUMNOWY
  // -------------------------
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lewa kolumna: menu/filtry (typ + data + sort) */}
        <div className="lg:col-span-1">
          {renderLeftMenu()}
        </div>

        {/* Prawa kolumna: tabela transakcji */}
        <div className="lg:col-span-3">
          {renderTransactionsTable()}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
