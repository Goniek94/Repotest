import React, { memo } from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * EmptyChat - Pusty stan panelu konwersacji
 * Wyświetlany gdy nie wybrano żadnej konwersacji
 */
const EmptyChat = memo(() => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        {/* Główna ikona */}
        <div className="w-20 h-20 mx-auto bg-[#35530A] rounded-full flex items-center justify-center shadow-lg mb-6">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>

        {/* Główny tekst */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Wybierz konwersację
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Kliknij na konwersację z listy po lewej stronie, aby rozpocząć czat. Możesz przeglądać wiadomości według kategorii i łatwo zarządzać swoją korespondencją.
        </p>

        {/* Kategorie */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">📥</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Odebrane</h4>
              <p className="text-sm text-gray-600">Wszystkie wiadomości, które otrzymałeś</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">📤</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Wysłane</h4>
              <p className="text-sm text-gray-600">Wiadomości, które wysłałeś do innych</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">⭐</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Ważne</h4>
              <p className="text-sm text-gray-600">Wiadomości oznaczone gwiazdką</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">📁</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Archiwum</h4>
              <p className="text-sm text-gray-600">Zarchiwizowane konwersacje</p>
            </div>
          </div>
        </div>

        {/* Wskazówka */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-gray-900 mb-2">💡 Wskazówka</h4>
          <p className="text-sm text-gray-600">
            Użyj gwiazdek aby oznaczyć ważne konwersacje, a archiwum do przechowywania starszych wiadomości.
          </p>
        </div>
      </div>
    </div>
  );
});

EmptyChat.displayName = 'EmptyChat';

export default EmptyChat;
