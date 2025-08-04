import React, { memo } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Star, 
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';

/**
 * 📂 TRANSACTION CATEGORIES PANEL - Panel kategorii transakcji
 * 
 * Stały sidebar z kategoriami transakcji (podobnie jak w Messages)
 * Zawsze widoczny po lewej stronie
 */
const TransactionCategoriesPanel = memo(({ 
  activeCategory, 
  transactionCounts = {}, 
  onCategoryChange 
}) => {
  // ===== KATEGORIE TRANSAKCJI =====
  const transactionCategories = [
    {
      id: 'wszystkie',
      label: 'Wszystkie',
      icon: CreditCard,
      count: transactionCounts.all || 0,
      description: 'Wszystkie transakcje',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'wydatki',
      label: 'Wydatki',
      icon: TrendingDown,
      count: transactionCounts.expenses || 0,
      description: 'Opłaty za ogłoszenia',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 'standardowe',
      label: 'Standardowe',
      icon: FileText,
      count: transactionCounts.standardListings || 0,
      description: 'Opłaty za standardowe ogłoszenia',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'wyrozione',
      label: 'Wyróżnione',
      icon: Star,
      count: transactionCounts.featuredListings || 0,
      description: 'Opłaty za wyróżnione ogłoszenia',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'zwroty',
      label: 'Zwroty',
      icon: RefreshCw,
      count: transactionCounts.refunds || 0,
      description: 'Zwroty za anulowane ogłoszenia',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'miesiac',
      label: 'Ten miesiąc',
      icon: Calendar,
      count: transactionCounts.thisMonth || 0,
      description: 'Transakcje z tego miesiąca',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ];

  // ===== RENDER KATEGORII =====
  const renderCategory = (category) => {
    const Icon = category.icon;
    const isActive = activeCategory === category.id;
    const hasCount = category.count > 0;

    return (
      <button
        key={category.id}
        onClick={() => onCategoryChange(category.id)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
          transition-all duration-200 group
          ${isActive 
            ? 'bg-green-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        title={category.description}
      >
        {/* Ikona kategorii */}
        <div className={`
          p-2 rounded-md transition-colors
          ${isActive 
            ? 'bg-green-500' 
            : `${category.bgColor} group-hover:opacity-80`
          }
        `}>
          <Icon className={`
            w-4 h-4 
            ${isActive ? 'text-white' : category.color}
          `} />
        </div>

        {/* Nazwa kategorii */}
        <span className="font-medium flex-1">
          {category.label}
        </span>

        {/* Licznik transakcji */}
        {hasCount && (
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center
            ${isActive 
              ? 'bg-white text-green-600' 
              : 'bg-gray-200 text-gray-600'
            }
          `}>
            {category.count > 99 ? '99+' : category.count}
          </div>
        )}
      </button>
    );
  };

  // ===== RENDER =====
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit lg:h-full overflow-x-hidden">
      {/* Nagłówek panelu */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          KATEGORIE TRANSAKCJI
        </h2>
      </div>

      {/* Lista kategorii */}
      <div className="space-y-2">
        {transactionCategories.map(renderCategory)}
      </div>

      {/* Informacja pomocnicza */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-medium text-gray-600">
            Opłaty za ogłoszenia
          </p>
        </div>
        <p className="text-xs text-gray-500">
          System obsługuje tylko opłaty za publikację i wyróżnienie ogłoszeń
        </p>
      </div>

      {/* Dodatkowe informacje */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-1">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <p className="text-xs font-medium text-blue-800">
            Cennik usług
          </p>
        </div>
        <p className="text-xs text-blue-600">
          Standardowe: 30.00 PLN • Wyróżnione: 50.00 PLN
        </p>
      </div>
    </div>
  );
});

TransactionCategoriesPanel.displayName = 'TransactionCategoriesPanel';

export default TransactionCategoriesPanel;
