import React, { memo } from 'react';
import { Inbox, Send, Star, Archive, Users } from 'lucide-react';
import useResponsiveLayout from '../../../hooks/useResponsiveLayout';

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
  const { isMobile, text } = useResponsiveLayout();
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

        {/* Licznik nieprzeczytanych */}
        {hasCount && (
          <div className={`
            px-1.5 sm:px-2 py-0.5 sm:py-1 
            rounded-full text-xs font-bold 
            min-w-[18px] sm:min-w-[20px] text-center
            flex-shrink-0
            ${isActive 
              ? 'bg-white text-[#35530A]' 
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
              Wybierz kategorię wiadomości
            </p>
          </div>
        </div>
      </div>

      {/* Lista kategorii */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="space-y-1 sm:space-y-2">
          {messageCategories.map(renderCategory)}
        </div>

        {/* Informacja o braku konwersacji - tylko na większych ekranach */}
        <div className="hidden lg:block mt-4 sm:mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            Kliknij kategorię aby zobaczyć wiadomości
          </p>
        </div>
      </div>
    </div>
  );
});

CategoriesPanel.displayName = 'CategoriesPanel';

export default CategoriesPanel;
