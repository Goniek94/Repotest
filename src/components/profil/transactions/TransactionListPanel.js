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
 * Wzorowany na NotificationsListPanel.js z powiadomień
 * Dopasowany do stylu powiadomień z podobnym układem
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
  showBackButton = false,
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

  // Render pojedynczej transakcji - wzorowany na NotificationItem
  const renderTransaction = (transaction, index) => (
    <div
      key={transaction.id || index}
      onClick={() => onSelectTransaction(transaction)}
      className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0"
    >
      <div className="flex items-start gap-3">
        {/* Ikona transakcji */}
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          {getTransactionIcon(transaction.type, transaction.amount)}
        </div>
        
        {/* Główna zawartość */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {transaction.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
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
            
            {/* Kwota i status */}
            <div className="text-right flex-shrink-0 ml-3">
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
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-[#35530A] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Błąd ładowania</h3>
          <p className="text-gray-500 text-sm text-center mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#35530A] text-white rounded-lg hover:bg-[#2a4208] transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header z przyciskiem powrotu i akcjami - wzorowany na powiadomieniach */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="flex items-center justify-center w-8 h-8 hover:bg-[#35530A]/10 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-[#35530A]" />
              </button>
            )}
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              {activeCategory === 'wszystkie' && 'WSZYSTKIE TRANSAKCJE'}
              {activeCategory === 'wydatki' && 'WYDATKI'}
              {activeCategory === 'zwroty' && 'ZWROTY'}
              {activeCategory === 'standardowe' && 'STANDARDOWE'}
              {activeCategory === 'wyrozione' && 'WYRÓŻNIONE'}
              {activeCategory === 'miesiac' && 'TEN MIESIĄC'}
            </h3>
          </div>
          
          {/* Przycisk eksportu */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#35530A] hover:bg-[#35530A]/10 rounded-lg transition-colors"
            title="Eksportuj transakcje"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Eksportuj</span>
          </button>
        </div>

        {/* Filtry - kompaktowe */}
        <div className="mt-3">
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
      </div>

      {/* Lista transakcji z suwakiem - wzorowana na powiadomieniach */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              Brak transakcji
            </h3>
            <p className="text-gray-500 text-sm text-center">
              {activeCategory === 'wszystkie' 
                ? 'Gdy pojawią się nowe transakcje, zobaczysz je tutaj'
                : `Brak transakcji w kategorii "${activeCategory}"`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {transactions.map(renderTransaction)}
          </div>
        )}
      </div>

      {/* Footer z informacją o liczbie transakcji - wzorowany na powiadomieniach */}
      {transactions.length > 0 && (
        <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {transactions.length} {transactions.length === 1 ? 'transakcja' : 'transakcji'}
            </span>
            <span className="text-[#35530A] font-medium">
              {activeCategory === 'wszystkie' ? 'Wszystkie kategorie' : activeCategory}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

TransactionListPanel.displayName = 'TransactionListPanel';

export default TransactionListPanel;
