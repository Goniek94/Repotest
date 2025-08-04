import React from 'react';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaWallet, 
  FaChartLine,
  FaCreditCard,
  FaMoneyBillWave
} from 'react-icons/fa';

const TransactionStats = ({ transactions }) => {
  // Obliczanie statystyk
  const calculateStats = () => {
    const income = transactions
      .filter(t => t.amount.includes('+'))
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0);
    
    const expenses = transactions
      .filter(t => t.amount.includes('-'))
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.replace(/[^0-9.-]+/g, ""))), 0);
    
    const balance = income - expenses;
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === thisMonth && transDate.getFullYear() === thisYear;
    });
    
    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.amount.includes('+'))
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0);
    
    const thisMonthExpenses = thisMonthTransactions
      .filter(t => t.amount.includes('-'))
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.replace(/[^0-9.-]+/g, ""))), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      thisMonthIncome,
      thisMonthExpenses,
      totalTransactions: transactions.length,
      thisMonthTransactions: thisMonthTransactions.length
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  const StatCard = ({ icon, title, value, subtitle, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<FaArrowUp className="text-green-600 text-xl" />}
        title="Łączne przychody"
        value={formatCurrency(stats.totalIncome)}
        subtitle={`${stats.thisMonthIncome > 0 ? formatCurrency(stats.thisMonthIncome) : 'Brak'} w tym miesiącu`}
        color="text-green-600"
        bgColor="bg-green-100"
      />
      
      <StatCard
        icon={<FaArrowDown className="text-red-600 text-xl" />}
        title="Łączne wydatki"
        value={formatCurrency(stats.totalExpenses)}
        subtitle={`${stats.thisMonthExpenses > 0 ? formatCurrency(stats.thisMonthExpenses) : 'Brak'} w tym miesiącu`}
        color="text-red-600"
        bgColor="bg-red-100"
      />
      
      <StatCard
        icon={<FaWallet className="text-[#35530A] text-xl" />}
        title="Saldo"
        value={formatCurrency(stats.balance)}
        subtitle={`${stats.balance >= 0 ? 'Dodatnie' : 'Ujemne'} saldo`}
        color={stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}
        bgColor="bg-[#35530A] bg-opacity-10"
      />
      
      <StatCard
        icon={<FaChartLine className="text-blue-600 text-xl" />}
        title="Transakcje"
        value={stats.totalTransactions}
        subtitle={`${stats.thisMonthTransactions} w tym miesiącu`}
        color="text-blue-600"
        bgColor="bg-blue-100"
      />
    </div>
  );
};

export default TransactionStats;
