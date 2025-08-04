import React, { memo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import TransactionFilters from './TransactionFilters';

/**
 * 📋 TRANSACTION LIST PANEL - Panel listy transakcji
 * 
 * Wyświetla listę transakcji z możliwością filtrowania i sortowania
 * Slide-in panel podobny do ConversationsPanel
 */
const TransactionListPanel = memo(({ 
  isVisible,
  transactions = [],
  loading = false,
  error = null,
  activeCategory,
  onSelectTransaction,
  onBack,
  onExport,
  // Filtry
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onCustomDateFilter,
  onDateFilterChange
}) => {
  // Formatowanie daty
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formatowanie kwoty
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(Math.abs(parseFloat(amount.replace(/[^0-9.-]+/g, ""))));
  };

  // Ikona dla typu transakcji
  const getTransactionIcon = (type, amount) => {
    if (amount.includes('+')) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  // Kolor dla statusu
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'zakończona':
        return 'bg-green-100 text-green-800';
      case 'w trakcie':
        return 'bg-yellow-100 text-yellow-800';
      case 'anulowana':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render pojedynczej transakcji
  const renderTransaction = (transaction, index) => (
    <div
      key={transaction.id || index}
      onClick={() => onSelectTransaction(transaction)}
      className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Lewa strona - ikona i opis */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            {getTransactionIcon(transaction.type, transaction.amount)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">
                {formatDate(transaction.date)}
              </span>
              {transaction.category && (
                <>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {transaction.category}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Prawa strona - kwota i status */}
        <div className="text-right">
          <p className={`text-sm font-bold ${
            transaction.amount.includes('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            {transaction.amount.includes('+') ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
            getStatusColor(transaction.status)
          }`}>
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Ładowanie transakcji...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Błąd ładowania</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
      {/* Nagłówek panelu */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Transakcje
              </h2>
              <p className="text-sm text-gray-600">
                {activeCategory === 'wszystkie' ? 'Wszystkie transakcje' : 
                 activeCategory === 'przychody' ? 'Przychody' :
                 activeCategory === 'wydatki' ? 'Wydatki' :
                 activeCategory === 'premium' ? 'Opłaty premium' :
                 activeCategory === 'promocje' ? 'Opłaty za promocje' :
                 activeCategory === 'zwroty' ? 'Zwroty' :
                 activeCategory === 'miesiac' ? 'Ten miesiąc' : 'Transakcje'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Eksportuj</span>
          </button>
        </div>

        {/* Filtry */}
        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onCustomDateFilter={onCustomDateFilter}
          onDateFilterChange={onDateFilterChange}
          primaryColor="#35530A"
        />
      </div>

      {/* Lista transakcji */}
      <div className="flex-1 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Brak transakcji
              </h3>
              <p className="text-gray-600">
                {activeCategory === 'wszystkie' 
                  ? 'Nie masz jeszcze żadnych transakcji'
                  : `Brak transakcji w kategorii "${activeCategory}"`
                }
              </p>
            </div>
          </div>
        ) : (
          <div>
            {transactions.map(renderTransaction)}
          </div>
        )}
      </div>

      {/* Stopka z liczbą transakcji */}
      {transactions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Wyświetlono {transactions.length} {transactions.length === 1 ? 'transakcję' : 'transakcji'}
          </p>
        </div>
      )}
    </div>
  );
});

TransactionListPanel.displayName = 'TransactionListPanel';

export default TransactionListPanel;
