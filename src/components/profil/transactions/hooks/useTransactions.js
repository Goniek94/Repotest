import { useState, useEffect, useCallback } from 'react';
import TransactionsService from '../../../../services/api/transactionsApi';

/**
 * 🔄 useTransactions - Custom hook do zarządzania transakcjami
 * 
 * Podobny do useConversations, ale dla transakcji
 * Obsługuje pobieranie, filtrowanie i zarządzanie stanem transakcji
 */
const useTransactions = (activeCategory, userId) => {
  // ===== STATE =====
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionCounts, setTransactionCounts] = useState({});
  
  // Filtry
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('wszystkie');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ===== MOCK DATA =====
  // Tymczasowe dane testowe - w przyszłości zastąpione prawdziwymi danymi z API
  const mockTransactions = [
    {
      id: 'TXN001',
      description: 'Opłata za publikację ogłoszenia',
      amount: '-30.00 PLN',
      date: '2024-01-15T10:30:00Z',
      status: 'Zakończona',
      category: 'Ogłoszenie standardowe',
      type: 'standard_listing',
      paymentMethod: 'Karta kredytowa',
      adTitle: 'BMW X5 2018 - Stan idealny',
      adId: 'AD001'
    },
    {
      id: 'TXN002',
      description: 'Opłata za wyróżnienie ogłoszenia',
      amount: '-50.00 PLN',
      date: '2024-01-10T14:20:00Z',
      status: 'Zakończona',
      category: 'Ogłoszenie wyróżnione',
      type: 'featured_listing',
      paymentMethod: 'BLIK'
    },
    {
      id: 'TXN003',
      description: 'Opłata za wyróżnienie ogłoszenia',
      amount: '-50.00 PLN',
      date: '2024-01-08T09:15:00Z',
      status: 'Zakończona',
      category: 'Ogłoszenie wyróżnione',
      type: 'featured_listing',
      paymentMethod: 'Przelew bankowy',
      adTitle: 'Audi A4 2020 - Jak nowy',
      adId: 'AD002'
    },
    {
      id: 'TXN004',
      description: 'Zwrot za anulowane ogłoszenie',
      amount: '+30.00 PLN',
      date: '2024-01-05T16:45:00Z',
      status: 'Zakończona',
      category: 'Zwrot',
      type: 'refund',
      paymentMethod: 'Przelew bankowy',
      adTitle: 'Mercedes C-Class 2019',
      adId: 'AD003'
    },
    {
      id: 'TXN005',
      description: 'Opłata za publikację ogłoszenia',
      amount: '-30.00 PLN',
      date: '2024-01-03T11:30:00Z',
      status: 'W trakcie',
      category: 'Ogłoszenie standardowe',
      type: 'standard_listing',
      paymentMethod: 'PayPal',
      adTitle: 'Volkswagen Golf 2021',
      adId: 'AD004'
    },
    {
      id: 'TXN006',
      description: 'Opłata za wyróżnienie ogłoszenia',
      amount: '-50.00 PLN',
      date: '2024-01-02T15:20:00Z',
      status: 'Zakończona',
      category: 'Ogłoszenie wyróżnione',
      type: 'featured_listing',
      paymentMethod: 'Przelewy24',
      adTitle: 'Toyota Corolla 2022',
      adId: 'AD005'
    }
  ];

  // ===== FUNKCJE POMOCNICZE =====
  
  /**
   * Formatuje kwotę transakcji
   */
  const formatAmount = useCallback((amount) => {
    const numAmount = parseFloat(amount);
    const sign = numAmount >= 0 ? '+' : '-';
    return `${sign}${Math.abs(numAmount).toFixed(2)} PLN`;
  }, []);

  /**
   * Formatuje status transakcji
   */
  const formatStatus = useCallback((status) => {
    const statusMap = {
      'completed': 'Zakończona',
      'pending': 'W trakcie',
      'failed': 'Nieudana',
      'cancelled': 'Anulowana',
      'refunded': 'Zwrócona'
    };
    return statusMap[status] || status;
  }, []);

  /**
   * Pobiera nazwę kategorii na podstawie typu transakcji
   */
  const getCategoryName = useCallback((type) => {
    const categoryMap = {
      'standard_listing': 'Ogłoszenie standardowe',
      'featured_listing': 'Ogłoszenie wyróżnione',
      'refund': 'Zwrot'
    };
    return categoryMap[type] || 'Inne';
  }, []);

  /**
   * Pobiera opis usługi na podstawie typu transakcji
   */
  const getServiceDescription = useCallback((type) => {
    const descriptionMap = {
      'standard_listing': 'Opłata za publikację ogłoszenia',
      'featured_listing': 'Opłata za wyróżnienie ogłoszenia',
      'refund': 'Zwrot za anulowane ogłoszenie'
    };
    return descriptionMap[type] || 'Opłata za usługę';
  }, []);

  /**
   * Filtruje transakcje według kategorii
   */
  const filterByCategory = useCallback((transactions, category) => {
    if (category === 'wszystkie') return transactions;
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return transactions.filter(transaction => {
      switch (category) {
        case 'wydatki':
          return transaction.amount.includes('-');
        case 'zwroty':
          return transaction.type === 'refund' || transaction.amount.includes('+');
        case 'standardowe':
          return transaction.type === 'standard_listing';
        case 'wyrozione':
          return transaction.type === 'featured_listing';
        case 'miesiac':
          const transactionDate = new Date(transaction.date);
          return transactionDate.getMonth() === thisMonth && 
                 transactionDate.getFullYear() === thisYear;
        default:
          return true;
      }
    });
  }, []);

  /**
   * Filtruje transakcje według wyszukiwanej frazy
   */
  const filterBySearch = useCallback((transactions, searchTerm) => {
    if (!searchTerm) return transactions;
    
    const term = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(term) ||
      transaction.category.toLowerCase().includes(term) ||
      transaction.id.toLowerCase().includes(term)
    );
  }, []);

  /**
   * Filtruje transakcje według daty
   */
  const filterByDate = useCallback((transactions, dateFilter, startDate, endDate) => {
    if (dateFilter === 'wszystkie') return transactions;
    
    const now = new Date();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch (dateFilter) {
        case 'dzisiaj':
          return transactionDate.toDateString() === now.toDateString();
        case 'tydzien':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'miesiac':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return transactionDate >= monthAgo;
        case 'rok':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return transactionDate >= yearAgo;
        case 'zakres':
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transactionDate >= start && transactionDate <= end;
          }
          return true;
        default:
          return true;
      }
    });
  }, []);

  /**
   * Oblicza liczniki dla kategorii
   */
  const calculateCounts = useCallback((transactions) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    return {
      all: transactions.length,
      expenses: transactions.filter(t => t.amount.includes('-')).length,
      refunds: transactions.filter(t => t.type === 'refund').length,
      standardListings: transactions.filter(t => t.type === 'standard_listing').length,
      featuredListings: transactions.filter(t => t.type === 'featured_listing').length,
      thisMonth: transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }).length
    };
  }, []);

  // ===== EFFECTS =====
  
  /**
   * Pobiera transakcje przy pierwszym załadowaniu
   */
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Pobierz transakcje z API
        const response = await TransactionsService.getHistory({
          page: 1,
          limit: 100 // Pobierz wszystkie transakcje na raz
        });
        
        if (response && response.transactions && response.transactions.length > 0) {
          // Konwertuj format API na format używany przez komponent
          const formattedTransactions = response.transactions.map(transaction => ({
            id: transaction.transactionId || transaction.id,
            description: transaction.description || getServiceDescription(transaction.type),
            amount: formatAmount(transaction.amount),
            date: transaction.createdAt || transaction.date,
            status: formatStatus(transaction.status),
            category: getCategoryName(transaction.type),
            type: transaction.type,
            paymentMethod: transaction.paymentMethod,
            adTitle: transaction.ad?.headline || transaction.metadata?.adTitle,
            adId: transaction.ad?.id || transaction.adId,
            invoiceRequested: transaction.invoiceRequested,
            invoiceGenerated: transaction.invoiceGenerated
          }));
          
          setTransactions(formattedTransactions);
          console.log(`Pobrano ${formattedTransactions.length} transakcji z API`);
        } else {
          // Fallback na mock data jeśli brak transakcji
          console.log('Brak transakcji w API, używam mock data');
          setTransactions(mockTransactions);
        }
      } catch (err) {
        console.error('Błąd pobierania transakcji z API:', err);
        setError('Nie udało się pobrać historii transakcji');
        // Fallback na mock data w przypadku błędu
        setTransactions(mockTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  /**
   * Filtruje transakcje gdy zmienią się filtry
   */
  useEffect(() => {
    let filtered = transactions;
    
    // Filtruj według kategorii
    filtered = filterByCategory(filtered, activeCategory);
    
    // Filtruj według wyszukiwanej frazy
    filtered = filterBySearch(filtered, searchTerm);
    
    // Filtruj według daty
    filtered = filterByDate(filtered, dateFilter, startDate, endDate);
    
    // Sortuj według daty (najnowsze pierwsze)
    filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredTransactions(filtered);
  }, [transactions, activeCategory, searchTerm, dateFilter, startDate, endDate, 
      filterByCategory, filterBySearch, filterByDate]);

  /**
   * Oblicza liczniki gdy zmienią się transakcje
   */
  useEffect(() => {
    const counts = calculateCounts(transactions);
    setTransactionCounts(counts);
  }, [transactions, calculateCounts]);

  // ===== HANDLERS =====
  
  /**
   * Wybiera transakcję do wyświetlenia szczegółów
   */
  const selectTransaction = useCallback((transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    setSelectedTransaction(transaction || null);
  }, [transactions]);

  /**
   * Eksportuje transakcje do CSV
   */
  const exportTransactions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Przygotuj filtry dla API
      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (dateFilter !== 'wszystkie' && dateFilter !== 'zakres') {
        const now = new Date();
        switch (dateFilter) {
          case 'dzisiaj':
            filters.startDate = now.toISOString().split('T')[0];
            filters.endDate = now.toISOString().split('T')[0];
            break;
          case 'tydzien':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filters.startDate = weekAgo.toISOString().split('T')[0];
            break;
          case 'miesiac':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filters.startDate = monthAgo.toISOString().split('T')[0];
            break;
          case 'rok':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            filters.startDate = yearAgo.toISOString().split('T')[0];
            break;
        }
      }

      try {
        // Spróbuj pobrać z API
        const blob = await TransactionsService.exportTransactions(filters);
        
        // Utwórz link do pobrania
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `transakcje_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Eksport transakcji z API zakończony pomyślnie');
      } catch (apiError) {
        console.warn('Eksport z API nieudany, używam lokalnych danych:', apiError);
        
        // Fallback - eksport lokalnych danych
        const csvContent = [
          ['ID', 'Opis', 'Kwota', 'Data', 'Status', 'Kategoria', 'Typ'].join(','),
          ...filteredTransactions.map(t => [
            t.id,
            `"${t.description}"`,
            t.amount,
            t.date,
            t.status,
            t.category,
            t.type
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `transakcje_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
    } catch (error) {
      console.error('Błąd podczas eksportu transakcji:', error);
      setError('Nie udało się wyeksportować transakcji');
    } finally {
      setLoading(false);
    }
  }, [filteredTransactions, startDate, endDate, dateFilter]);

  /**
   * Pobiera fakturę/paragon dla transakcji
   */
  const downloadReceipt = useCallback(async (transaction) => {
    try {
      setLoading(true);
      
      console.log('Pobieranie faktury dla transakcji:', transaction.id);
      
      try {
        // Spróbuj pobrać fakturę z API
        const blob = await TransactionsService.downloadInvoice(transaction.id);
        
        // Utwórz link do pobrania
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Faktura_${transaction.id}.pdf`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('Faktura pobrana pomyślnie');
      } catch (apiError) {
        console.warn('Pobieranie faktury z API nieudane:', apiError);
        
        // Jeśli faktura nie istnieje, spróbuj ją zażądać
        if (apiError.response?.status === 404 || apiError.response?.status === 400) {
          try {
            await TransactionsService.requestInvoice(transaction.id);
            alert('Faktura została zażądana i zostanie wysłana na Twój adres email w ciągu kilku minut.');
          } catch (requestError) {
            console.error('Błąd podczas żądania faktury:', requestError);
            alert('Nie udało się zażądać faktury. Spróbuj ponownie później.');
          }
        } else {
          throw apiError;
        }
      }
      
    } catch (error) {
      console.error('Błąd podczas pobierania faktury:', error);
      setError('Nie udało się pobrać faktury');
      alert('Nie udało się pobrać faktury. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== RETURN =====
  return {
    // Stan
    transactions: filteredTransactions,
    selectedTransaction,
    loading,
    error,
    transactionCounts,
    
    // Filtry
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    
    // Akcje
    selectTransaction,
    exportTransactions,
    downloadReceipt,
    
    // Funkcje filtrowania
    onCustomDateFilter: (start, end) => {
      setStartDate(start);
      setEndDate(end);
      setDateFilter('zakres');
    },
    
    onDateFilterChange: (filter) => {
      setDateFilter(filter);
      if (filter !== 'zakres') {
        setStartDate('');
        setEndDate('');
      }
    }
  };
};

export default useTransactions;
