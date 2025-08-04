import React, { memo } from 'react';
import { Inbox, Send, Star, Archive, Users } from 'lucide-react';

/**
 * 📂 CATEGORIES PANEL - Panel kategorii wiadomości
 * 
 * Stały sidebar z kategoriami wiadomości (jak na screenshocie)
 * Zawsze widoczny po lewej stronie
 */
const CategoriesPanel = memo(({ 
  activeTab, 
  unreadCount = {}, 
  onTabChange 
}) => {
  // ===== KATEGORIE WIADOMOŚCI =====
  const messageCategories = [
    {
      id: 'odebrane',
      label: 'Odebrane',
      icon: Inbox,
      count: unreadCount.messages || 0,
      description: 'Wszystkie otrzymane wiadomości'
    },
    {
      id: 'wyslane',
      label: 'Wysłane',
      icon: Send,
      count: 0,
      description: 'Wiadomości które wysłałeś'
    },
    {
      id: 'wazne',
      label: 'Ważne',
      icon: Star,
      count: unreadCount.starred || 0,
      description: 'Oznaczone gwiazdką'
    },
    {
      id: 'archiwum',
      label: 'Archiwum',
      icon: Archive,
      count: 0,
      description: 'Zarchiwizowane rozmowy'
    },
    {
      id: 'grupy',
      label: 'Grupy',
      icon: Users,
      count: 0,
      description: 'Rozmowy grupowe'
    }
  ];

  // ===== RENDER KATEGORII =====
  const renderCategory = (category) => {
    const Icon = category.icon;
    const isActive = activeTab === category.id;
    const hasCount = category.count > 0;

    return (
      <button
        key={category.id}
        onClick={() => onTabChange(category.id)}
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
            : 'bg-gray-200 group-hover:bg-gray-300'
          }
        `}>
          <Icon className={`
            w-4 h-4 
            ${isActive ? 'text-white' : 'text-gray-600'}
          `} />
        </div>

        {/* Nazwa kategorii */}
        <span className="font-medium flex-1">
          {category.label}
        </span>

        {/* Licznik nieprzeczytanych */}
        {hasCount && (
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center
            ${isActive 
              ? 'bg-white text-green-600' 
              : 'bg-red-500 text-white'
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
          KATEGORIE
        </h2>
      </div>

      {/* Lista kategorii */}
      <div className="space-y-2">
        {messageCategories.map(renderCategory)}
      </div>

      {/* Informacja o braku konwersacji */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          Kliknij kategorię aby zobaczyć wiadomości
        </p>
      </div>
    </div>
  );
});

CategoriesPanel.displayName = 'CategoriesPanel';

export default CategoriesPanel;
