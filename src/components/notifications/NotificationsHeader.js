import React from 'react';
import { Bell } from 'lucide-react';

/**
 * 🔔 NOTIFICATIONS HEADER - Nagłówek panelu powiadomień
 * 
 * Wzorowany na MessagesHeader.js z zielonym tłem i licznikami
 */
const NotificationsHeader = ({ unreadCount = 0, totalCount = 0 }) => {
  return (
    <div className="bg-[#35530A] rounded-t-2xl shadow-lg p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Powiadomienia
            </h1>
          </div>
        </div>
        
        {/* Liczniki tylko na desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-white text-sm font-medium">
              {unreadCount} nieprzeczytanych
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white text-sm font-medium">
              {totalCount} łącznie
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsHeader;
