import React, { memo } from 'react';
import { Inbox, Send, Star, Archive, Users, Image, Link } from 'lucide-react';
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
    },
    {
      id: 'multimedia',
      label: 'Multimedia',
      icon: Image,
      count: 0,
      description: 'Wiadomości z załącznikami multimedialnymi'
    },
    {
      id: 'linki',
      label: 'Linki',
      icon: Link,
      count: 0,
      description: 'Wiadomości zawierające linki'
    }
  ];

  // ===== RENDER KATEGORII =====
  const renderCategory = (category) => {
    const Icon = category.icon;
    const isActive = activeTab === category.id;
    const hasCount = category.count > 0;

    // Mobile - horizontal layout with small icons
    if (isMobile) {
      return (
        <button
          key={category.id}
          onClick={() => onTabChange(category.id)}
          className={`
            flex flex-col items-center justify-center
            p-3 rounded-xl text-xs font-medium
            transition-all duration-200 group
            min-w-[70px] relative
            ${isActive 
              ? 'bg-[#35530A] text-white shadow-lg' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }
          `}
          title={category.description}
        >
          {/* Ikona kategorii */}
          <div className={`
            p-2 rounded-lg transition-colors mb-1
            ${isActive 
              ? 'bg-[#2a4208]' 
              : 'bg-gray-100 group-hover:bg-gray-200'
            }
          `}>
          <Icon className={`
            w-3 h-3 
            ${isActive ? 'text-white' : 'text-gray-600'}
          `} />
          </div>

          {/* Nazwa kategorii */}
          <span className="truncate max-w-full">
            {category.label}
          </span>

          {/* Licznik nieprzeczytanych */}
          {hasCount && (
            <div className={`
              absolute -top-1 -right-1
              px-1.5 py-0.5 
              rounded-full text-xs font-bold 
              min-w-[18px] text-center
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
    }

    // Desktop - vertical layout (original)
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
        <div className={`
          ${isMobile 
            ? 'flex gap-2 overflow-x-auto pb-2' 
            : 'space-y-1 sm:space-y-2'
          }
        `}>
          {messageCategories.map(renderCategory)}
        </div>
      </div>

      {/* Informacja o braku konwersacji - na dole panelu */}
      <div className="hidden lg:block p-3 bg-[#35530A]/5 border-t border-gray-100">
        <p className="text-xs text-[#35530A] text-center font-medium">
          Kliknij kategorię aby zobaczyć wiadomości
        </p>
      </div>
    </div>
  );
});

CategoriesPanel.displayName = 'CategoriesPanel';

export default CategoriesPanel;
