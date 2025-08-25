import React, { useState, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, Receipt, CheckCircle, Clock, XCircle, ShoppingCart, TrendingUp, RefreshCw, DollarSign, FileText, Download, History, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useResponsiveLayout from '../../hooks/useResponsiveLayout';
import TransactionHeader from './transactions/TransactionHeader';
import TransactionCategoriesPanel from './transactions/TransactionCategoriesPanel';
import TransactionListPanel from './transactions/TransactionListPanel';
import useTransactions from './transactions/hooks/useTransactions';

/**
 * 💳 TRANSACTION HISTORY - Główny komponent historii transakcji
 * 
 * Jednopanelowy layout podobny do systemu powiadomień:
 * - Kategorie na górze (mobile) lub po lewej (desktop)
 * - Jeden panel z listą transakcji
 */
const TransactionHistory = memo(() => {
  // ===== HOOKS =====
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();
  
  // ===== STATE =====
  // Aktywna kategoria transakcji
  const [activeCategory, setActiveCategory] = useState(() => {
    const initial = searchParams.get('category');
    return initial || 'wszystkie';
  });
  
  // Custom hook do zarządzania transakcjami
  const transactionsData = useTransactions(activeCategory, user?.id);

  // ===== EFFECTS =====
  /**
   * Automatycznie ustaw domyślną kategorię
   */
  useEffect(() => {
    // Jeśli nie ma parametru category w URL, ustaw domyślny
    if (!searchParams.get('category')) {
      setSearchParams({ category: 'wszystkie' });
    }
  }, [searchParams, setSearchParams]);

  // ===== HANDLERS =====
  /**
   * Obsługa zmiany kategorii transakcji
   */
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({ category });
  };

  // Oblicz statystyki dla nagłówka
  const totalTransactions = transactionsData.transactionCounts.all || 0;

  // ===== FILTERING =====
  /**
   * Filtrowanie transakcji na podstawie aktywnej kategorii
   */
  const getFilteredTransactions = () => {
    switch(activeCategory) {
      case 'platnosci':
        return transactionsData.transactions.filter(transaction => 
          transaction.type === 'payment' || transaction.type === 'charge'
        );
      case 'zwroty':
        return transactionsData.transactions.filter(transaction => 
          transaction.type === 'refund'
        );
      case 'faktury':
        return transactionsData.transactions.filter(transaction => 
          transaction.type === 'invoice' || transaction.hasInvoice === true
        );
      case 'historia':
        // Historia transakcji - możliwość wyszukiwania całej historii
        return transactionsData.transactions; // Zwróć wszystkie z możliwością wyszukiwania
      case 'statystyki':
        // Statystyki - może zwrócić puste lub specjalne dane do wyświetlenia statystyk
        return [];
      case 'wszystkie':
      default:
        return transactionsData.transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  // ===== RENDER =====
  return (
    <div className="bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-0 sm:px-1 lg:px-2 py-0 sm:py-1 lg:py-1">
        {/* Nagłówek z tytułem i licznikami - połączony z panelami */}
        <div>
          <TransactionHeader 
            totalTransactions={totalTransactions}
          />
        </div>

        {/* Mobile Layout - Kategorie pod nagłówkiem jak w powiadomieniach */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 -mt-1">
            <div className="px-2 py-2">
              <div className="flex justify-center gap-2 relative">
                {/* Lewa kreska separator */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {/* Prawa kreska separator */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
                {[
                  { id: 'wszystkie', label: 'Wszystkie', icon: Receipt, count: transactionsData.transactionCounts.all },
                  { id: 'platnosci', label: 'Płatności', icon: CreditCard, count: transactionsData.transactionCounts.payments },
                  { id: 'zwroty', label: 'Zwroty', icon: RefreshCw, count: transactionsData.transactionCounts.refunds },
                  { id: 'faktury', label: 'Faktury', icon: FileText, count: transactionsData.transactionCounts.invoices },
                  { id: 'historia', label: 'Historia', icon: History, count: transactionsData.transactionCounts.all },
                  { id: 'statystyki', label: 'Statystyki', icon: BarChart3, count: 0 }
                ].map(category => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  const hasCount = category.count > 0;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`
                        flex items-center justify-center
                        w-12 h-12 rounded-xl
                        transition-all duration-200
                        relative
                        ${isActive 
                          ? 'bg-[#35530A] text-white' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                        }
                      `}
                      title={category.label}
                    >
                      <Icon className="w-5 h-5" />
                      {hasCount && (
                        <div className={`
                          absolute -top-1 -right-1
                          w-5 h-5 
                          rounded-full text-xs font-bold 
                          flex items-center justify-center
                          ${isActive 
                            ? 'bg-white text-[#35530A]' 
                            : 'bg-red-500 text-white'
                          }
                        `}>
                          {category.count > 9 ? '9+' : category.count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Główny kontener - responsywny layout */}
        <div className={`
          flex flex-col lg:flex-row
          bg-white rounded-b-2xl border border-gray-200 border-t-0
          ${isMobile ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : 'overflow-hidden'}
        `} style={{
          boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.15), -3px 0 6px -1px rgba(0, 0, 0, 0.1), 3px 0 6px -1px rgba(0, 0, 0, 0.1)',
          height: isMobile ? '70vh' : 'calc(100vh - 150px)',
          minHeight: isMobile ? '500px' : '600px',
          maxHeight: isMobile ? '80vh' : '800px'
        }}>
          
          {/* Panel kategorii - tylko desktop */}
          {isDesktop && (
            <div className="
              w-64 xl:w-72
              flex-shrink-0 
              border-r border-gray-200
            ">
              <TransactionCategoriesPanel
                activeCategory={activeCategory}
                transactionCounts={transactionsData.transactionCounts}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          )}

          {/* Panel listy transakcji - pełna szerokość na mobile, ograniczona na desktop */}
          <div className={`
            ${isMobile 
              ? 'w-full' 
              : 'flex-1'
            }
            min-h-[280px] lg:min-h-0
          `}>
            <TransactionListPanel
              isVisible={true}
              transactions={filteredTransactions}
              loading={transactionsData.loading}
              error={transactionsData.error}
              activeCategory={activeCategory}
              onSelectTransaction={() => {}} // Usunięte - nie potrzebujemy szczegółów
              onBack={() => {}} // Usunięte - nie ma powrotu
              onExport={transactionsData.exportTransactions}
              showBackButton={false} // Zawsze false - nie ma powrotu
              // Filtry
              searchTerm={transactionsData.searchTerm}
              setSearchTerm={transactionsData.setSearchTerm}
              dateFilter={transactionsData.dateFilter}
              setDateFilter={transactionsData.setDateFilter}
              startDate={transactionsData.startDate}
              setStartDate={transactionsData.setStartDate}
              endDate={transactionsData.endDate}
              setEndDate={transactionsData.setEndDate}
              onCustomDateFilter={transactionsData.onCustomDateFilter}
              onDateFilterChange={transactionsData.onDateFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

TransactionHistory.displayName = 'TransactionHistory';

export default TransactionHistory;
