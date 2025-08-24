import React, { useState, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, Receipt, CheckCircle, Clock, XCircle, ShoppingCart, TrendingUp, RefreshCw, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useResponsiveLayout from '../../hooks/useResponsiveLayout';
import TransactionHeader from './transactions/TransactionHeader';
import TransactionCategoriesPanel from './transactions/TransactionCategoriesPanel';
import TransactionListPanel from './transactions/TransactionListPanel';
import TransactionDetailsPanel from './transactions/TransactionDetailsPanel';
import useTransactions from './transactions/hooks/useTransactions';

/**
 * 💳 TRANSACTION HISTORY - Główny komponent historii transakcji
 * 
 * 3-panelowy layout w stylu Messages i Notifications z pełną responsywnością:
 * 1. Panel kategorii (lewy)
 * 2. Panel listy transakcji (środkowy)
 * 3. Panel szczegółów transakcji (prawy)
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
  
  // Stan paneli - kontroluje które panele są widoczne na mobile
  const [panelState, setPanelState] = useState('categories'); // categories, list, details
  
  // Custom hook do zarządzania transakcjami
  const transactionsData = useTransactions(activeCategory, user?.id);

  // ===== EFFECTS =====
  /**
   * Automatycznie otwórz panel listy transakcji po załadowaniu
   */
  useEffect(() => {
    // Jeśli nie ma parametru category w URL, ustaw domyślny
    if (!searchParams.get('category')) {
      setSearchParams({ category: 'wszystkie' });
      // Na mobilnych pokaż kategorie, na desktop od razu listę
      setPanelState(isMobile ? 'categories' : 'list');
    }
  }, [searchParams, setSearchParams, isMobile]);

  // ===== HANDLERS =====
  /**
   * Obsługa zmiany kategorii transakcji
   */
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({ category });
    setPanelState('list'); // Pokaż panel listy
    transactionsData.selectTransaction(null); // Wyczyść wybór
  };

  /**
   * Obsługa wyboru transakcji
   */
  const handleSelectTransaction = (transaction) => {
    transactionsData.selectTransaction(transaction.id);
    setPanelState('details'); // Pokaż panel szczegółów
  };

  /**
   * Obsługa powrotu do poprzedniego panelu
   */
  const handleBack = () => {
    if (panelState === 'details') {
      setPanelState('list');
      transactionsData.selectTransaction(null);
    } else if (panelState === 'list') {
      setPanelState('categories');
    }
  };

  // Oblicz statystyki dla nagłówka
  const totalTransactions = transactionsData.transactionCounts.all || 0;

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

        {/* Mobile Layout - Categories in grid under header */}
        {isMobile && panelState === 'categories' && (
          <div className="bg-white border-b border-gray-200">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">KATEGORIE</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'wszystkie', label: 'Wszystkie', icon: Receipt, count: transactionsData.transactionCounts.all },
                  { id: 'wydatki', label: 'Wydatki', icon: XCircle, count: transactionsData.transactionCounts.expenses },
                  { id: 'zwroty', label: 'Zwroty', icon: RefreshCw, count: transactionsData.transactionCounts.refunds },
                  { id: 'standardowe', label: 'Standardowe', icon: ShoppingCart, count: transactionsData.transactionCounts.standardListings },
                  { id: 'wyrozione', label: 'Wyróżnione', icon: TrendingUp, count: transactionsData.transactionCounts.featuredListings },
                  { id: 'miesiac', label: 'Ten miesiąc', icon: Clock, count: transactionsData.transactionCounts.thisMonth }
                ].map(category => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  const hasCount = category.count > 0;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`
                        flex flex-col items-center justify-center
                        p-3 rounded-xl
                        transition-all duration-200 group
                        h-16 relative
                        ${isActive 
                          ? 'bg-[#35530A] text-white shadow-lg' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }
                      `}
                    >
                      <Icon className={`
                        w-5 h-5 mb-1
                        ${isActive ? 'text-white' : 'text-gray-600'}
                      `} />
                      <span className={`
                        text-xs font-medium text-center
                        ${isActive ? 'text-white' : 'text-gray-700'}
                      `}>
                        {category.label}
                      </span>
                      {hasCount && (
                        <div className={`
                          absolute -top-1 -right-1
                          w-2 h-2 rounded-full
                          ${isActive 
                            ? 'bg-yellow-400' 
                            : 'bg-yellow-500'
                          }
                        `}>
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
          {(panelState === 'list' || isDesktop) && (
            <div className={`
              ${isMobile 
                ? 'w-full' 
                : 'w-72 xl:w-80 flex-shrink-0 border-r border-gray-200'
              }
              ${panelState === 'details' && isMobile ? 'hidden' : ''}
              min-h-[280px] lg:min-h-0
            `}>
              <TransactionListPanel
                isVisible={true}
                transactions={transactionsData.transactions}
                loading={transactionsData.loading}
                error={transactionsData.error}
                activeCategory={activeCategory}
                onSelectTransaction={handleSelectTransaction}
                onBack={handleBack}
                onExport={transactionsData.exportTransactions}
                showBackButton={isMobile && panelState === 'list'}
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
          )}

          {/* Panel szczegółów transakcji - pełna szerokość na mobile gdy aktywny */}
          {(panelState === 'details' || isDesktop) && (
            <div className={`
              ${isMobile && panelState === 'details' 
                ? 'w-full h-full' 
                : 'flex-1'
              }
              relative overflow-hidden
              ${isMobile ? 'h-full' : 'min-h-[400px] lg:min-h-0'}
            `}>
              {transactionsData.selectedTransaction ? (
                <TransactionDetailsPanel
                  isVisible={true}
                  transaction={transactionsData.selectedTransaction}
                  onBack={handleBack}
                  onDownloadReceipt={transactionsData.downloadReceipt}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                      Wybierz transakcję
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Kliknij na transakcję z listy, aby zobaczyć szczegóły
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TransactionHistory.displayName = 'TransactionHistory';

export default TransactionHistory;
