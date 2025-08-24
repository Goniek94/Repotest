import React, { memo } from 'react';
import { Bell, Inbox, MessageCircle, Settings, FileText, CreditCard, MessageSquare, AlertTriangle, Cog } from 'lucide-react';

/**
 * 🔔 NOTIFICATIONS CATEGORIES PANEL - Panel kategorii powiadomień
 * 
 * Wzorowany na zdjęciu z kategoriami jak w oryginalnym designie
 * Dopasowany do rozmiarów przycisków z panelu wiadomości
 */
const NotificationsCategoriesPanel = memo(({ 
  activeTab, 
  categoryCounts, 
  onTabChange 
}) => {
  const categories = [
    { 
      id: 'all', 
      label: 'Wszystkie', 
      icon: Bell, 
      count: categoryCounts.all,
      description: 'Wszystkie powiadomienia'
    },
    { 
      id: 'unread', 
      label: 'Nieprzeczytane', 
      icon: Inbox, 
      count: categoryCounts.unread,
      description: 'Nieprzeczytane powiadomienia'
    },
    { 
      id: 'listings', 
      label: 'Ogłoszenia', 
      icon: FileText, 
      count: categoryCounts.listings || 0,
      description: 'Powiadomienia o ogłoszeniach'
    },
    { 
      id: 'messages', 
      label: 'Wiadomości', 
      icon: MessageCircle, 
      count: categoryCounts.messages,
      description: 'Powiadomienia o wiadomościach'
    },
    { 
      id: 'comments', 
      label: 'Komentarze', 
      icon: MessageSquare, 
      count: categoryCounts.comments || 0,
      description: 'Powiadomienia o komentarzach'
    },
    { 
      id: 'payments', 
      label: 'Płatności', 
      icon: CreditCard, 
      count: categoryCounts.payments || 0,
      description: 'Powiadomienia o płatnościach'
    },
    { 
      id: 'system', 
      label: 'Systemowe', 
      icon: AlertTriangle, 
      count: categoryCounts.system,
      description: 'Powiadomienia systemowe'
    },
    { 
      id: 'preferences', 
      label: 'Preferencje', 
      icon: Cog, 
      count: categoryCounts.preferences || 0,
      description: 'Powiadomienia o preferencjach'
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
              Wybierz kategorię powiadomień
            </p>
          </div>
        </div>
      </div>

      {/* Lista kategorii */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="space-y-1 sm:space-y-2">
          {categories.map(category => {
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

      {/* Informacja o braku powiadomień - na dole panelu */}
      <div className="hidden lg:block p-3 bg-[#35530A]/5 border-t border-gray-100">
        <p className="text-xs text-[#35530A] text-center font-medium">
          Kliknij kategorię aby zobaczyć powiadomienia
        </p>
      </div>
    </div>
  );
});

NotificationsCategoriesPanel.displayName = 'NotificationsCategoriesPanel';

export default NotificationsCategoriesPanel;
