import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

// Główny kolor aplikacji
const PRIMARY_COLOR = '#35530A';

/**
 * Komponent wyświetlający historię transakcji użytkownika
 */
const TransactionHistoryTab = () => {
  // Przykładowe dane transakcji
  const transactionData = [
    { id: 1, type: 'purchase', title: 'BMW X5 (2018)', date: '12.05.2025', amount: '220 000 zł', status: 'Zakończona' },
    { id: 2, type: 'sale', title: 'Volkswagen Golf (2015)', date: '05.04.2025', amount: '45 000 zł', status: 'Zakończona' },
    { id: 3, type: 'purchase', title: 'Audi A4 (2020)', date: '28.03.2025', amount: '120 000 zł', status: 'W trakcie' },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
      {/* Nagłówek z ikoną */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center">
          <History 
            size={24} 
            className="text-gray-600 mr-3" 
            style={{ color: PRIMARY_COLOR }} 
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Historia transakcji</h2>
        </div>
        
        {/* Przycisk filtrowania */}
        <button className="flex items-center text-sm sm:text-base bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors duration-200">
          <Filter size={16} className="mr-1.5" />
          Filtruj
        </button>
      </div>
      
      {/* Tabela transakcji - responsywna */}
      {transactionData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Pojazd
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Kwota
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactionData.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    {transaction.type === 'purchase' ? (
                      <div className="flex items-center text-blue-600">
                        <ArrowDownLeft size={16} className="mr-1.5" />
                        <span className="text-xs sm:text-sm">Zakup</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <ArrowUpRight size={16} className="mr-1.5" />
                        <span className="text-xs sm:text-sm">Sprzedaż</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900 font-medium">
                    {transaction.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:text-base font-medium">
                    {transaction.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'Zakończona' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <History size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 mb-2">Brak historii transakcji</p>
          <p className="text-sm text-gray-400">Twoje transakcje pojawią się tutaj po zakupie lub sprzedaży pojazdu</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryTab;