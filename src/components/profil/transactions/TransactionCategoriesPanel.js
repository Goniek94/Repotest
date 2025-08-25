import React, { memo } from 'react';
import { 
  Receipt, 
  XCircle, 
  RefreshCw, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  CreditCard,
  FileText,
  History,
  BarChart3
} from 'lucide-react';

/**
 * 💳 TRANSACTION CATEGORIES PANEL - Panel kategorii transakcji
 * 
 * Wzorowany na panelu kategorii powiadomień i wiadomości
 * Dopasowany do rozmiarów przycisków z innych paneli
 */
const TransactionCategoriesPanel = memo(({ 
  activeCategory, 
  transactionCounts = {}, 
  onCategoryChange 
}) => {
  const categories = [
    { 
      id: 'wszystkie', 
      label: 'Wszystkie', 
      icon: Receipt, 
      count: transactionCounts.all || 0,
      description: 'Wszystkie transakcje'
    },
    { 
      id: 'platnosci', 
      label: 'Płatności', 
      icon: CreditCard, 
      count: transactionCounts.payments || 0,
      description: 'Płatności za usługi'
    },
    { 
      id: 'zwroty', 
      label: 'Zwroty', 
      icon: RefreshCw, 
      count: transactionCounts.refunds || 0,
      description: 'Zwroty za anulowane ogłoszenia'
    },
    { 
      id: 'faktury', 
      label: 'Faktury', 
      icon: FileText, 
      count: transactionCounts.invoices || 0,
      description: 'Faktury do pobrania'
    },
    { 
      id: 'historia', 
      label: 'Historia Transakcji', 
      icon: History, 
      count: transactionCounts.all || 0,
      description: 'Pełna historia z możliwością wyszukiwania'
    },
    { 
      id: 'statystyki', 
      label: 'Statystyki', 
      icon: BarChart3, 
      count: 0,
      description: 'Statystyki i wykresy transakcji'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Nagłówek panelu - wyrównany z pozostałymi panelami */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 min-h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-[#35530A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 bg-[#35530A] rounded-sm"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-gray-900 truncate leading-tight">
              Kategorie
            </h2>
            <p className="text-xs text-gray-500 truncate leading-tight">
              Wybierz kategorię płatności
            </p>
          </div>
        </div>
      </div>

      {/* Lista kategorii */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="space-y-1 sm:space-y-2">
          {categories.map(category => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            const hasCount = category.count > 0;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  w-full flex items-center gap-2 sm:gap-3 
                  px-3 sm:px-4 py-2 sm:py-3 
                  rounded-lg text-left text-sm sm:text-base
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#35530A] text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                title={category.description}
              >
                {/* Ikona kategorii */}
                <div className={`
                  p-1.5 sm:p-2 rounded-md transition-colors flex-shrink-0
                  ${isActive 
                    ? 'bg-[#2a4208]' 
                    : 'bg-gray-200 group-hover:bg-gray-300'
                  }
                `}>
                  <Icon className={`
                    w-3 h-3 sm:w-4 sm:h-4 
                    ${isActive ? 'text-white' : 'text-gray-600'}
                  `} />
                </div>

                {/* Nazwa kategorii */}
                <span className="font-medium flex-1 truncate">
                  {category.label}
                </span>

                {/* Licznik transakcji */}
                {hasCount && (
                  <div className={`
                    px-1.5 sm:px-2 py-0.5 sm:py-1 
                    rounded-full text-xs font-bold 
                    min-w-[18px] sm:min-w-[20px] text-center
                    flex-shrink-0
                    ${isActive 
                      ? 'bg-white text-[#35530A]' 
                      : 'bg-yellow-500 text-white'
                    }
                  `}>
                    {category.count > 99 ? '99+' : category.count}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
});

TransactionCategoriesPanel.displayName = 'TransactionCategoriesPanel';

export default TransactionCategoriesPanel;
