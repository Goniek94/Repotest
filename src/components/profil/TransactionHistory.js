import React, { useState, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TransactionHeader from './transactions/TransactionHeader';
import TransactionCategoriesPanel from './transactions/TransactionCategoriesPanel';
import TransactionListPanel from './transactions/TransactionListPanel';
import TransactionDetailsPanel from './transactions/TransactionDetailsPanel';
import useTransactions from './transactions/hooks/useTransactions';

/**
 * 💳 TRANSACTION HISTORY - Główny komponent historii transakcji
 * 
 * 3-panelowy layout w stylu innych komponentów profilu:
 * 1. Panel kategorii (stały sidebar)
 * 2. Panel listy transakcji (slide-in z prawej)
 * 3. Panel szczegółów transakcji (slide-in z prawej)
 */
const TransactionHistory = memo(() => {
  // ===== HOOKS =====
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ===== STATE =====
  // Aktywna kategoria transakcji
  const [activeCategory, setActiveCategory] = useState(() => {
    const initial = searchParams.get('category');
    return initial || 'wszystkie';
  });
  
  // Stan paneli - kontroluje które panele są widoczne
  const [panelState, setPanelState] = useState('list'); // categories, list, details
  
  // Custom hook do zarządzania transakcjami
  const transactionsData = useTransactions(activeCategory, user?.id);

  // ===== EFFECTS =====
  /**
   * Automatycznie otwórz panel listy transakcji po załadowaniu
   */
  useEffect(() => {
    // Jeśli nie ma parametru category w URL, ustaw domyślny i otwórz panel listy
    if (!searchParams.get('category')) {
      setSearchParams({ category: 'wszystkie' });
      setPanelState('list');
    }
  }, [searchParams, setSearchParams]);

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
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Nagłówek z tytułem i liczbą transakcji */}
        <div className="mb-5">
          <TransactionHeader 
            totalTransactions={totalTransactions}
          />
        </div>

        {/* Główny kontener - jeden panel po lewej, reszta po prawej */}
        <div className="flex gap-5 h-[600px]">
          
          {/* Panel kategorii - zawsze widoczny po lewej */}
          <div className="w-64 flex-shrink-0">
            <TransactionCategoriesPanel
              activeCategory={activeCategory}
              transactionCounts={transactionsData.transactionCounts}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Obszar wysuwanych paneli - po prawej stronie */}
          <div className="flex-1 relative overflow-hidden">
            
            {/* Panel listy transakcji - wysuwa się z prawej */}
            <div className={`
              absolute inset-0 transition-transform duration-300 ease-out
              ${panelState === 'list' || panelState === 'details' 
                ? 'transform translate-x-0' 
                : 'transform translate-x-full'
              }
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

            {/* Panel szczegółów transakcji - wysuwa się z prawej nad panelem listy */}
            <div className={`
              absolute inset-0 transition-transform duration-300 ease-out
              ${panelState === 'details' 
                ? 'transform translate-x-0' 
                : 'transform translate-x-full'
              }
            `}>
              <TransactionDetailsPanel
                isVisible={true}
                transaction={transactionsData.selectedTransaction}
                onBack={handleBack}
                onDownloadReceipt={transactionsData.downloadReceipt}
              />
            </div>

            {/* Domyślny widok gdy żaden panel nie jest aktywny */}
            {panelState === 'categories' && (
              <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Historia Transakcji
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Kliknij na jedną z kategorii po lewej stronie, aby zobaczyć swoje transakcje
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
});

TransactionHistory.displayName = 'TransactionHistory';

export default TransactionHistory;
