import React, { useState, useEffect } from "react";
import TransactionFilters from "./transactions/TransactionFilters";
import TransactionTable from "./transactions/TransactionTable";
import { getTransactionHistory } from "../../services/api";

// Prosta funkcja powiadomień zamiast react-toastify
const showNotification = (message, type = 'info') => {
  debug(`[${type.toUpperCase()}] ${message}`);
  // Można również użyć window.alert() w razie potrzeby
  // alert(`${type.toUpperCase()}: ${message}`);
};

const PRIMARY_COLOR = "#35530A";

const TransactionHistory = () => {
  // Stany dla danych transakcji
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stany dla filtrowania i sortowania
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pobieranie historii transakcji
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const response = await getTransactionHistory();
        
        // Formatowanie transakcji do odpowiedniego formatu
        const formattedTransactions = response.map(transaction => ({
          id: transaction._id,
          date: new Date(transaction.transactionDate).toISOString().split('T')[0], // Format YYYY-MM-DD
          description: transaction.description,
          amount: `${transaction.amount > 0 ? '+' : ''}${transaction.amount} PLN`,
          status: transaction.status,
          paymentMethod: transaction.paymentMethod,
          adId: transaction.adId,
          adTitle: transaction.adTitle
        }));
        
        setAllTransactions(formattedTransactions);
        setTransactions(formattedTransactions);
        setLoading(false);
      } catch (err) {
        console.error("Błąd podczas pobierania historii transakcji:", err);
        setError("Nie udało się pobrać historii transakcji. Spróbuj ponownie później.");
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  // Formatowanie daty do porównań
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Sortowanie transakcji
  const sortTransactions = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtrowanie po okresie czasu
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    
    if (filter === 'custom') return; // Nie filtruj przy przełączeniu na niestandardowy okres
    
    const today = new Date();
    let filterDate = new Date();
    
    switch(filter) {
      case '30days':
        filterDate.setDate(today.getDate() - 30);
        break;
      case '90days':
        filterDate.setDate(today.getDate() - 90);
        break;
      case '180days':
        filterDate.setDate(today.getDate() - 180);
        break;
      case 'all':
      default:
        setTransactions(allTransactions);
        return;
    }
    
    const filtered = allTransactions.filter(trans => {
      const transDate = formatDate(trans.date);
      return transDate >= filterDate;
    });
    
    setTransactions(filtered);
  };

  // Filtrowanie po niestandardowym okresie
  const handleCustomDateFilter = () => {
    if (!startDate || !endDate) return;
    
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    
    const filtered = allTransactions.filter(trans => {
      const transDate = formatDate(trans.date);
      return transDate >= start && transDate <= end;
    });
    
    setTransactions(filtered);
  };

  // Filtrowanie podczas wyszukiwania
  useEffect(() => {
    if (!allTransactions.length) return;
    
    if (searchTerm.trim() === '') {
      handleDateFilterChange(dateFilter);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allTransactions.filter(trans => 
      trans.description.toLowerCase().includes(searchTermLower) || 
      trans.amount.toLowerCase().includes(searchTermLower) ||
      (trans.adTitle && trans.adTitle.toLowerCase().includes(searchTermLower))
    );
    
    setTransactions(filtered);
  }, [searchTerm, allTransactions]);

  // Sortowanie transakcji na podstawie obecnej konfiguracji
  useEffect(() => {
    if (!transactions.length) return;
    
    const sortedTransactions = [...transactions].sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? formatDate(a.date) - formatDate(b.date)
          : formatDate(b.date) - formatDate(a.date);
      }
      
      if (sortConfig.key === 'amount') {
        const amountA = parseFloat(a.amount.replace(/[^0-9.-]+/g, ""));
        const amountB = parseFloat(b.amount.replace(/[^0-9.-]+/g, ""));
        return sortConfig.direction === 'asc' ? amountA - amountB : amountB - amountA;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setTransactions(sortedTransactions);
  }, [sortConfig]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">HISTORIA TRANSAKCJI</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-4 text-gray-600">Ładowanie historii transakcji...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
          >
            Odśwież stronę
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Brak transakcji w historii.</p>
          <p className="mt-2 text-sm">Twoje transakcje pojawią się tutaj po dokonaniu pierwszej płatności.</p>
        </div>
      ) : (
        <>
          <TransactionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onCustomDateFilter={handleCustomDateFilter}
            onDateFilterChange={handleDateFilterChange}
            primaryColor={PRIMARY_COLOR}
          />
          <TransactionTable
            transactions={transactions}
            onSort={sortTransactions}
            sortConfig={sortConfig}
            primaryColor={PRIMARY_COLOR}
          />
        </>
      )}
    </div>
  );
};

export default TransactionHistory;