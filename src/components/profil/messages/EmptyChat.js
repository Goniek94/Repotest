import React from 'react';
import { MessageSquare, PlusCircle } from 'lucide-react';

/**
 * Komponent pustego czatu
 * Wyświetlany, gdy nie jest wybrana żadna konwersacja
 */
const EmptyChat = ({ onNewMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
        <MessageSquare className="w-12 h-12 text-green-700" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Twoje wiadomości</h2>
      
      <p className="text-gray-500 mb-8 max-w-md">
        Wybierz wiadomość z listy lub utwórz nową, aby rozpocząć konwersację z innym użytkownikiem.
      </p>
      
      <button
        onClick={onNewMessage}
        className="flex items-center px-5 py-3 bg-green-700 text-white rounded-full font-medium hover:bg-green-800 transition-colors shadow-md"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Nowa wiadomość
      </button>
      
      <div className="mt-10 px-8 py-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
        <h3 className="font-semibold text-gray-700 mb-2">
          Wskazówki
        </h3>
        <ul className="text-sm text-gray-600 text-left space-y-2">
          <li>• Możesz oznaczać wiadomości jako ważne klikając ikonę gwiazdki</li>
          <li>• Przeczytane wiadomości są oznaczone białym tłem</li>
          <li>• Możesz archiwizować wiadomości, aby zachować porządek</li>
          <li>• Załączniki są wyświetlane w panelu konwersacji</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyChat;