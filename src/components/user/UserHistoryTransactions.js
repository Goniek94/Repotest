// src/components/user/UserHistoryTransactions.js

import React, { useState } from 'react';

const UserHistoryTransactions = () => {
  // ================================
  // 1. Przykładowe dane transakcji
  // ================================
  // type: 'payment' (zwykła płatność/ogłoszenie) lub 'invoice' (faktura).
  // W realnym projekcie możesz pobierać to z API, a nie trzymać w stanie.
  const [transactions] = useState([
    {
      id: 'TXN-001',
      type: 'payment',
      title: 'Opłata za wyróżnienie ogłoszenia',
      amount: 49.99,
      date: '2024-01-10',
      status: 'Opłacone',
    },
    {
      id: 'TXN-002',
      type: 'payment',
      title: 'Prowizja od sprzedaży (Ogłoszenie #1234)',
      amount: 15.0,
      date: '2024-01-15',
      status: 'Opłacone',
    },
    {
      id: 'TXN-003',
      type: 'payment',
      title: 'Opłata za dodanie ogłoszenia',
      amount: 9.99,
      date: '2024-01-20',
      status: 'Oczekuje',
    },
    {
      id: 'TXN-004',
      type: 'invoice',
      title: 'Faktura za subskrypcję (Plan Premium)',
      amount: 129.0,
      date: '2023-12-05',
      status: 'Opłacone',
    },
    {
      id: 'TXN-005',
      type: 'invoice',
      title: 'Faktura za subskrypcję (Plan Standard)',
      amount: 69.0,
      date: '2023-11-28',
      status: 'Opłacone',
    },
    {
      id: 'TXN-006',
      type: 'payment',
      title: 'Opłata za odnowienie ogłoszenia',
      amount: 19.99,
      date: '2023-10-15',
      status: 'Oczekuje',
    },
    {
      id: 'TXN-007',
      type: 'invoice',
      title: 'Faktura za subskrypcję (Plan Premium)',
      amount: 129.0,
      date: '2023-09-30',
      status: 'Opłacone',
    },
    {
      id: 'TXN-008',
      type: 'payment',
      title: 'Promocja ogłoszenia (Pakiet TOP)',
      amount: 89.99,
      date: '2023-08-10',
      status: 'Opłacone',
    },
    {
      id: 'TXN-009',
      type: 'invoice',
      title: 'Faktura korygująca do #TXN-004',
      amount: -10.0,
      date: '2023-08-02',
      status: 'Opłacone',
    },
    {
      id: 'TXN-010',
      type: 'payment',
      title: 'Prowizja od sprzedaży (Ogłoszenie #9876)',
      amount: 25.0,
      date: '2023-07-25',
      status: 'Opłacone',
    },
    {
      id: 'TXN-011',
      type: 'invoice',
      title: 'Faktura za subskrypcję (Plan Standard)',
      amount: 69.0,
      date: '2023-06-22',
      status: 'Opłacone',
    },
    {
      id: 'TXN-012',
      type: 'payment',
      title: 'Opłata za wyróżnienie ogłoszenia (2 tyg.)',
      amount: 59.99,
      date: '2023-06-10',
      status: 'Opłacone',
    },
    // Możesz dodać więcej – symulując 30 miesięcy wstecz
  ]);

  // ====================================
  // 2. Stan: kategoria, sortowanie
  // ====================================
  // Kategoria: 'all', 'payment' (płatności), 'invoice' (faktury)
  const [activeCategory, setActiveCategory] = useState('all');

  // Sortowanie: klucz (np. 'date' | 'amount') oraz kierunek (asc | desc)
  const [sortKey, setSortKey] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  // Domyślnie ustawiamy malejąco po dacie (najnowsze na górze)

  // ====================================
  // 3. Funkcje pomocnicze: filtrowanie i sortowanie
  // ====================================

  // Funkcja sortująca
  const sortFn = (a, b) => {
    if (sortKey === 'date') {
      // Porównanie dat (nowsza–starsza)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortKey === 'amount') {
      // Porównanie kwot
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    // Jeśli nic nie pasuje, to 0 (brak sortowania)
    return 0;
  };

  // Końcowe filtrowanie + sortowanie
  const filteredAndSortedTransactions = transactions
    .filter((txn) =>
      activeCategory === 'all' ? true : txn.type === activeCategory
    )
    .sort(sortFn);

  // Obsługa kliknięcia w nagłówek kolumny – zmienia klucz sortowania
  // Jeżeli klikniemy ponownie ten sam klucz – zmieni się kierunek asc <-> desc
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // ====================================
  // 4. RENDER
  // ====================================
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-[2px]">
        {/* Nagłówek */}
        <div className="bg-[#35530A] text-white p-4 rounded-t-[2px] flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase">Historia Płatności i Faktur</h2>

          {/* Wybór kategorii */}
          <div>
            {['all', 'payment', 'invoice'].map((cat) => {
              const label =
                cat === 'all'
                  ? 'Wszystkie'
                  : cat === 'payment'
                  ? 'Płatności'
                  : 'Faktury';
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm px-3 py-1 ml-2 rounded 
                    ${
                      activeCategory === cat
                        ? 'bg-yellow-400 text-green-800 font-bold'
                        : 'bg-white text-green-800'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <p className="mb-4">
            Poniżej znajduje się lista Twoich transakcji za ostatnie kilkanaście (lub 30) miesięcy.
            Możesz przełączać kategorie (płatności / faktury) oraz sortować np. po kwocie lub dacie.
          </p>

          {/* Tabela transakcji */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th
                    className="px-4 py-2 text-left uppercase text-sm font-bold cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    ID transakcji
                  </th>
                  <th className="px-4 py-2 text-left uppercase text-sm font-bold">
                    Opis
                  </th>
                  <th
                    className="px-4 py-2 text-left uppercase text-sm font-bold cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Kwota
                    {sortKey === 'amount' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                  <th
                    className="px-4 py-2 text-left uppercase text-sm font-bold cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Data
                    {sortKey === 'date' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                  <th className="px-4 py-2 text-left uppercase text-sm font-bold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-semibold">{txn.id}</td>
                    <td className="px-4 py-2 text-sm">{txn.title}</td>
                    <td className="px-4 py-2 text-sm">{txn.amount.toFixed(2)} zł</td>
                    <td className="px-4 py-2 text-sm">{txn.date}</td>
                    <td className="px-4 py-2 text-sm">
                      {txn.status === 'Opłacone' ? (
                        <span className="text-green-600 font-bold">{txn.status}</span>
                      ) : txn.status === 'Oczekuje' ? (
                        <span className="text-orange-600 font-bold">{txn.status}</span>
                      ) : (
                        <span className="text-gray-600 font-bold">{txn.status}</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredAndSortedTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Brak transakcji w tej kategorii.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Przykładowe pokazywanie, po czym sortujemy */}
          <div className="mt-4 text-sm text-gray-600">
            Sortowanie wg: <strong>{sortKey}</strong> ({sortDirection})
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryTransactions;
